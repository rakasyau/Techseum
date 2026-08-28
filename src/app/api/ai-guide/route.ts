import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { question, topicTitle, topicCategory, currentLevel, chatHistory } = await req.json();

    if (!question || !topicTitle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    // Build conversation history for context
    const historyParts = (chatHistory || []).map((msg: { role: string; text: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    const systemInstruction = `You are the Techseum Museum AI Guide — an expert museum curator and educator specializing in technology and science.

CONTEXT:
- Current exhibit: "${topicTitle}" (Category: ${topicCategory || "Technology"})
- User's reading level: "${currentLevel}"

BEHAVIOR RULES:
1. Match your explanation depth to the user's level:
   - "Simple": Use everyday analogies, no jargon, short sentences. Think 12-year-old audience.
   - "Beginner": Step-by-step explanations with basic technical terms defined inline.
   - "Technical": Use proper engineering terminology, reference architectures and pipelines.
   - "Deep Dive": Use physics equations, silicon-level details, thermodynamics, signal theory.

2. Keep answers concise (2-4 paragraphs max) but information-rich.
3. Use concrete examples tied to the current exhibit topic.
4. When referencing physics or math, use clear notation (e.g., P = C·V²·f for dynamic power).
5. Be enthusiastic but precise — you're a museum guide, not a textbook.
6. If the user asks something unrelated to technology/science, gently redirect back to the exhibit.
7. Answer in the same language as the user's question (support English and Indonesian).`;

    const requestBody = {
      system_instruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: [
        ...historyParts,
        {
          role: "user",
          parts: [{ text: question }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 1024,
      },
    };

    // Candidate models with automatic failover (handles temporary high-demand spikes)
    const candidateModels = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];
    let aiText = "";
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            aiText = candidateText;
            break; // Success!
          }
        } else {
          const errorText = await response.text();
          console.warn(`Gemini model ${modelName} returned status ${response.status}:`, errorText);
          lastError = { status: response.status, errorText };
        }
      } catch (err) {
        console.warn(`Fetch to ${modelName} failed:`, err);
        lastError = err;
      }
    }

    if (!aiText) {
      return NextResponse.json(
        {
          error: "AI Guide service is momentarily busy. Please try again in a few seconds.",
          details: lastError,
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true, reply: aiText });
  } catch (error) {
    console.error("AI Guide API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
