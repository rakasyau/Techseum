"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, ArrowUp, Sparkles, UserRound, X } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

/*
 * The exhibit assistant.
 *
 * Streams answers from /api/ai/ask, which grounds the model in this exhibit's
 * own content server-side. The provider key never reaches the browser, and no
 * provider name is shown in the interface — it is simply "the assistant".
 */

interface Turn {
  role: "user" | "assistant";
  text: string;
}

export function ExhibitAssistant({
  topicSlug,
  level,
  suggestions,
}: {
  topicSlug: string;
  level: number;
  suggestions: { q: string; a: string }[];
}) {
  const { t } = useLanguage();
  const reduce = useReducedMotion();

  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [turns, setTurns] = React.useState<Turn[]>([]);
  const [streaming, setStreaming] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const scroller = React.useRef<HTMLDivElement>(null);

  const scrollToEnd = React.useCallback(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  React.useEffect(() => {
    scrollToEnd();
  }, [turns, scrollToEnd]);

  const ask = React.useCallback(
    async (question: string) => {
      const text = question.trim();
      if (!text || streaming) return;

      setError(null);
      setInput("");

      // Build the history the server will use, including the new question.
      const outgoing: Turn[] = [...turns, { role: "user", text }];
      setTurns([...outgoing, { role: "assistant", text: "" }]);
      setStreaming(true);

      try {
        const response = await fetch("/api/ai/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topicSlug, level, turns: outgoing }),
        });

        if (!response.ok) {
          let message = t.ai.unavailable;
          try {
            const data = (await response.json()) as { error?: string };
            if (data.error) message = data.error;
          } catch {
            /* keep the default */
          }
          // Drop the empty assistant placeholder so the error is what shows.
          setTurns(outgoing);
          setError(message);
          return;
        }

        if (!response.body) {
          setTurns(outgoing);
          setError(t.ai.unavailable);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setTurns([
            ...outgoing,
            { role: "assistant", text: accumulated },
          ]);
        }

        if (!accumulated.trim()) {
          setTurns(outgoing);
          setError(t.ai.unavailable);
        }
      } catch {
        setTurns((prev) =>
          prev[prev.length - 1]?.role === "assistant" &&
          prev[prev.length - 1]?.text === ""
            ? prev.slice(0, -1)
            : prev
        );
        setError(t.errors.network);
      } finally {
        setStreaming(false);
      }
    },
    [turns, streaming, topicSlug, level, t]
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[13px] font-medium transition-colors",
          open
            ? "border-accent bg-accent-soft text-accent-ink"
            : "border-line bg-paper text-ink-soft hover:border-accent hover:text-accent-ink"
        )}
      >
        <Sparkles size={14} />
        {t.ai.open}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 8 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 w-full min-w-0 overflow-hidden rounded-2xl border border-line bg-paper shadow-card"
          >
            <div className="flex items-center gap-2.5 border-b border-line bg-paper-alt px-4 py-3">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-accent-soft text-accent-ink">
                <Sparkles size={14} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold">
                  {t.ai.title}
                </p>
                <p className="truncate text-2xs text-ink-muted">
                  {t.ai.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.common.close}
                className="text-ink-faint transition-colors hover:text-ink"
              >
                <X size={15} />
              </button>
            </div>

            <div
              ref={scroller}
              className="max-h-[min(340px,50dvh)] space-y-3 overflow-y-auto px-4 py-4"
            >
              {turns.length === 0 ? (
                <div>
                  <p className="text-[12.5px] leading-relaxed text-ink-muted">
                    {t.ai.suggestions}
                  </p>
                  <div className="mt-3 space-y-2">
                    {suggestions.map((item) => (
                      <button
                        key={item.q}
                        type="button"
                        onClick={() => void ask(item.q)}
                        className="block w-full rounded-xl border border-line px-3.5 py-2.5 text-left text-[12.5px] font-medium text-ink-soft transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent-ink"
                      >
                        {item.q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                turns.map((turn, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex gap-2.5",
                      turn.role === "user" && "justify-end"
                    )}
                  >
                    {turn.role === "assistant" ? (
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-ink">
                        <Sparkles size={12} />
                      </span>
                    ) : null}

                    <div
                      className={cn(
                        "max-w-[52ch] rounded-xl px-3.5 py-2.5 text-[12.5px] leading-relaxed",
                        turn.role === "user"
                          ? "bg-ink text-paper"
                          : "bg-paper-alt text-ink-soft"
                      )}
                    >
                      {turn.text ? (
                        <p className="whitespace-pre-wrap">{turn.text}</p>
                      ) : (
                        <span className="flex items-center gap-2 text-ink-muted">
                          <span className="flex gap-1" aria-hidden>
                            {[0, 1, 2].map((d) => (
                              <span
                                key={d}
                                className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-faint"
                                style={{ animationDelay: d * 0.16 + "s" }}
                              />
                            ))}
                          </span>
                          {t.ai.thinking}
                        </span>
                      )}
                    </div>

                    {turn.role === "user" ? (
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-paper-sink text-ink-faint">
                        <UserRound size={12} />
                      </span>
                    ) : null}
                  </div>
                ))
              )}

              {error ? (
                <p
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-danger/25 bg-danger-soft px-3.5 py-2.5 text-[12.5px] leading-relaxed text-danger"
                >
                  <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden />
                  {error}
                </p>
              ) : null}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void ask(input);
              }}
              className="flex items-center gap-2 border-t border-line p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.ai.placeholder}
                aria-label={t.ai.placeholder}
                disabled={streaming}
                className="min-w-0 flex-1 bg-transparent px-2 text-[13px] outline-none placeholder:text-ink-faint disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || streaming}
                aria-label={t.ai.send}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-paper transition-opacity disabled:opacity-35"
              >
                <ArrowUp size={14} />
              </button>
            </form>

            <p className="border-t border-line px-4 py-2 text-[10px] leading-relaxed text-ink-faint">
              {t.ai.disclaimer}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
