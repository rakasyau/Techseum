"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Check,
  ChevronDown,
  ChevronUp,
  GripVertical,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import type { Challenge } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/lib/use-progress";
import { useLanguage } from "@/components/language-provider";

/* One engine, three interaction types. Ordering and drag-drop both resolve to
   a sequence; multiple-choice resolves to a set. Feedback is immediate and
   always explains why, because the explanation is the actual teaching. */
export function ChallengeEngine({
  challenge,
  compact = false,
}: {
  challenge: Challenge;
  compact?: boolean;
}) {
  const reduce = useReducedMotion();
  const { t } = useLanguage();
  const { user, recordChallenge } = useProgress();
  const isSequence =
    challenge.type === "ordering" || challenge.type === "drag-drop";

  // Start in the authored order so the server and the first client render
  // agree. The shuffle below runs after mount, where a random order is safe.
  const [order, setOrder] = React.useState<string[]>(() =>
    isSequence ? challenge.options.map((o) => o.id) : []
  );
  const [selected, setSelected] = React.useState<string[]>([]);
  const [status, setStatus] = React.useState<"idle" | "correct" | "wrong">(
    "idle"
  );
  const [attempts, setAttempts] = React.useState(0);

  React.useEffect(() => {
    setOrder((prev) => {
      // Only shuffle an untouched sequence, and only once per challenge.
      if (challenge.type === "multiple-choice") return prev;
      if (prev.length === 0) return shuffle(challenge.options.map((o) => o.id));
      return shuffle(prev);
    });
    setStatus("idle");
    setSelected([]);
    setAttempts(0);
  }, [challenge.id, challenge.type, challenge.options]);

  const labelFor = (id: string) =>
    challenge.options.find((o) => o.id === id)?.label ?? id;
  const detailFor = (id: string) =>
    challenge.options.find((o) => o.id === id)?.detail;

  const current = isSequence ? order : selected;

  const check = () => {
    setAttempts((a) => a + 1);
    const correct =
      challenge.answer.length === current.length &&
      challenge.answer.every((a, i) => a === current[i]);
    setStatus(correct ? "correct" : "wrong");

    // Record the attempt server-side. XP is computed there and paid at most
    // once per challenge, so a retry cannot farm points.
    if (user) void recordChallenge(challenge.id, correct);
  };

  const reset = () => {
    setStatus("idle");
    setSelected([]);
    if (isSequence) {
      setOrder(shuffle(challenge.options.map((o) => o.id)));
    }
  };

  const move = (index: number, dir: -1 | 1) => {
    setOrder((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setStatus("idle");
  };

  const toggleSelect = (id: string) => {
    setStatus("idle");
    setSelected((prev) =>
      challenge.type === "multiple-choice"
        ? [id]
        : prev.includes(id)
          ? prev.filter((x) => x !== id)
          : [...prev, id]
    );
  };

  const dragIndex = React.useRef<number | null>(null);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-line bg-paper",
        !compact && "shadow-card"
      )}
    >
      <div className="flex items-start gap-3.5 border-b border-line bg-paper-alt px-5 py-4">
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-white">
          <Sparkles size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[15px] font-semibold leading-snug tracking-[-0.015em]">
            {challenge.question}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-2xs text-ink-muted">
            <span className="font-medium text-accent-ink">
              +{challenge.xpReward} {t.common.xp}
            </span>
            {challenge.type === "multiple-choice" ? (
              <span>{t.challenge.chooseBest}</span>
            ) : null}
            {challenge.type === "ordering" ? (
              <span>{t.challenge.putInOrder}</span>
            ) : null}
            {challenge.type === "drag-drop" ? (
              <span>{t.challenge.sortItems}</span>
            ) : null}
            {attempts > 0 ? (
              <span className="tnum">
                {attempts} {t.challenge.attempts}
              </span>
            ) : null}
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {challenge.hint && status === "idle" && attempts === 0 ? (
          <p className="mb-4 rounded-xl border border-line bg-paper-alt px-4 py-3 text-[12.5px] leading-relaxed text-ink-muted">
            <span className="font-medium text-ink-soft">Hint: </span>
            {challenge.hint}
          </p>
        ) : null}

        {isSequence ? (
          <ol className="space-y-2">
            {order.map((id, index) => {
              const isDrop = challenge.type === "drag-drop";
              return (
                <li
                  key={id}
                  draggable
                  onDragStart={() => {
                    dragIndex.current = index;
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    const from = dragIndex.current;
                    if (from === null || from === index) return;
                    setOrder((prev) => {
                      const next = [...prev];
                      const [moved] = next.splice(from, 1);
                      next.splice(index, 0, moved);
                      return next;
                    });
                    dragIndex.current = null;
                    setStatus("idle");
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border bg-paper px-3 py-3 transition-colors",
                    status === "correct"
                      ? "border-success/40 bg-success-soft/50"
                      : status === "wrong"
                        ? "border-danger/40 bg-danger-soft/40"
                        : "border-line hover:border-line-strong"
                  )}
                >
                  <span className="tnum grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line bg-paper-alt font-mono text-[11px] font-semibold text-ink-soft">
                    {index + 1}
                  </span>
                  <GripVertical
                    size={15}
                    className="shrink-0 cursor-grab text-ink-ghost active:cursor-grabbing"
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-medium">
                      {isDrop && challenge.answer[index]
                        ? labelFor(id) + " to " + challenge.answer[index]
                        : labelFor(id)}
                    </span>
                    {detailFor(id) ? (
                      <span className="mt-0.5 block text-2xs text-ink-muted">
                        {detailFor(id)}
                      </span>
                    ) : null}
                  </span>
                  <span className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label={`Move ${labelFor(id)} up`}
                      className="grid h-7 w-7 place-items-center rounded-lg border border-line text-ink-muted transition-colors hover:border-ink hover:text-ink disabled:opacity-30"
                    >
                      <ChevronUp size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === order.length - 1}
                      aria-label={`Move ${labelFor(id)} down`}
                      className="grid h-7 w-7 place-items-center rounded-lg border border-line text-ink-muted transition-colors hover:border-ink hover:text-ink disabled:opacity-30"
                    >
                      <ChevronDown size={13} />
                    </button>
                  </span>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="space-y-2">
            {challenge.options.map((o) => {
              const picked = selected.includes(o.id);
              const isRight = challenge.answer.includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => toggleSelect(o.id)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-200",
                    status !== "idle" && isRight
                      ? "border-success/45 bg-success-soft/50"
                      : status === "wrong" && picked && !isRight
                        ? "border-danger/45 bg-danger-soft/40"
                        : picked
                          ? "border-ink bg-paper-alt"
                          : "border-line hover:border-line-strong hover:bg-paper-alt"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors",
                      picked
                        ? "border-ink bg-ink text-paper"
                        : "border-line-strong"
                    )}
                    aria-hidden
                  >
                    {picked ? <Check size={11} /> : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-medium leading-snug">
                      {o.label}
                    </span>
                    {o.detail ? (
                      <span className="mt-1 block text-2xs text-ink-muted">
                        {o.detail}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <AnimatePresence mode="wait">
          {status !== "idle" ? (
            <motion.div
              key={status}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.28 }}
              className={cn(
                "mt-4 flex gap-3 rounded-xl border p-4",
                status === "correct"
                  ? "border-success/25 bg-success-soft"
                  : "border-danger/25 bg-danger-soft"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 shrink-0",
                  status === "correct" ? "text-success" : "text-danger"
                )}
                aria-hidden
              >
                {status === "correct" ? <Check size={17} /> : <X size={17} />}
              </span>
              <div>
                <p
                  className={cn(
                    "font-display text-[13.5px] font-semibold",
                    status === "correct" ? "text-success" : "text-danger"
                  )}
                >
                  {status === "correct"
                    ? `Correct — +${challenge.xpReward} XP`
                    : "Not quite"}
                </p>
                <p className="mt-1.5 max-w-measure text-[13px] leading-relaxed text-ink-soft">
                  {challenge.explanation}
                </p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          {status === "idle" ? (
            <Button
              onClick={check}
              disabled={current.length === 0}
              size={compact ? "sm" : "md"}
            >
              Check answer
            </Button>
          ) : (
            <Button
              onClick={reset}
              variant="outline"
              size={compact ? "sm" : "md"}
            >
              <RotateCcw size={14} />
              Try again
            </Button>
          )}
          {status === "correct" ? (
            <span className="text-2xs text-ink-muted">
              Saved to your progress
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
