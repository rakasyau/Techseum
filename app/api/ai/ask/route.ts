import { NextResponse } from "next/server";
import { serverEnv } from "@/lib/env";
import { rateLimit, pruneBuckets } from "@/lib/rate-limit";
import { getCurrentUser } from "@/lib/auth";
import { buildSystemPrompt } from "@/lib/ai-prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_QUESTION_CHARS = 600;
const MAX_TURNS = 8;
const WINDOW_MS = 60000;

interface IncomingTurn {
  role: "user" | "assistant";
  text: string;
}

function sanitizeTurns(input: unknown): IncomingTurn[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter(
      (t): t is IncomingTurn =>
        typeof t === "object" &&
        t !== null &&
        typeof (t as IncomingTurn).text === "string" &&
        ((t as IncomingTurn).role === "user" ||
          (t as IncomingTurn).role === "assistant")
    )
    .map((t) => ({
      role: t.role,
      text: t.text
        // eslint-disable-next-line no-control-regex
        .replace(/[\u0000-\u001f\u007f]/g, " ")
        .slice(0, MAX_QUESTION_CHARS),
    }))
    .slice(-MAX_TURNS);
}

interface StreamChunk {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  // Signed-in users get a more generous allowance; anonymous visitors are
  // still served so the assistant works before registering.
  const identity =
    user?.id ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "anonymous";
  pruneBuckets();
  const limit = rateLimit("ai:" + identity, user ? 30 : 10, WINDOW_MS);

  if (!limit.allowed) {
    return NextResponse.json(
      {
        error:
          "You have reached the question limit for now. Please try again in a minute.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      }
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const topicSlug =
    typeof payload.topicSlug === "string"
      ? payload.topicSlug.slice(0, 64)
      : "";
  const level =
    typeof payload.level === "number" && payload.level >= 1 && payload.level <= 4
      ? Math.floor(payload.level)
      : 1;
  const turns = sanitizeTurns(payload.turns);

  if (!topicSlug) {
    return NextResponse.json(
      { error: "Missing exhibit context." },
      { status: 400 }
    );
  }
  if (turns.length === 0 || turns[turns.length - 1].role !== "user") {
    return NextResponse.json({ error: "Ask a question first." }, { status: 400 });
  }

  let apiKey: string;
  let model: string;
  try {
    apiKey = serverEnv.aiApiKey;
    model = serverEnv.aiModel;
  } catch {
    return NextResponse.json(
      { error: "The assistant is not configured on this deployment." },
      { status: 503 }
    );
  }

  const endpoint =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    encodeURIComponent(model) +
    ":streamGenerateContent?alt=sse";

  const upstream = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: buildSystemPrompt(topicSlug, level) }],
      },
      contents: turns.map((t) => ({
        role: t.role === "assistant" ? "model" : "user",
        parts: [{ text: t.text }],
      })),
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 700,
        topP: 0.95,
      },
    }),
    signal: AbortSignal.timeout(45000),
  }).catch(() => null);

  if (!upstream || !upstream.ok || !upstream.body) {
    const status = upstream?.status;
    const message =
      status === 401 || status === 403
        ? "The assistant is temporarily unavailable."
        : status === 429
          ? "The assistant is busy right now. Please try again shortly."
          : "The assistant could not be reached. Please try again.";
    return NextResponse.json({ error: message }, { status: 503 });
  }

  // Re-stream the provider's SSE frames as plain text chunks.
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const body = upstream.body;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = body.getReader();
      let buffer = "";

      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // The provider may separate frames with "\n\n" or "\r\n\r\n".
          // Normalising makes one parser handle both; the trailing partial
          // frame stays buffered until its separator arrives.
          buffer = buffer.replace(/\r\n/g, "\n");
          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";

          for (const frame of frames) {
            // A frame may span several "data:" lines; they concatenate.
            const data = frame
              .split("\n")
              .filter((l) => l.startsWith("data:"))
              .map((l) => l.slice(5).trim())
              .join("");
            if (!data || data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data) as StreamChunk;
              const text = parsed.candidates?.[0]?.content?.parts
                ?.map((p) => p.text ?? "")
                .join("");
              if (text) controller.enqueue(encoder.encode(text));
            } catch {
              // Skip a malformed frame rather than tearing down the stream.
            }
          }
        }
      } catch {
        // A network hiccup mid-stream ends the response cleanly.
      } finally {
        controller.close();
        reader.releaseLock();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-RateLimit-Remaining": String(limit.remaining),
    },
  });
}
