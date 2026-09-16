"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Clock, Quote } from "lucide-react";
import type { Topic } from "@/lib/types";
import { LevelContent } from "./level-content";
import { ChallengeEngine } from "./challenge-engine";
import { ExhibitAssistant } from "./exhibit-assistant";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { challengesForTopic } from "@/lib/data/challenges";
import { buildQuestions } from "@/lib/ask-why-questions";
import { useLanguage } from "@/components/language-provider";
import { useProgress, topicProgress } from "@/lib/use-progress";
import { useExplorerCount } from "@/lib/use-stats";

export function TopicReader({ topic }: { topic: Topic }) {
  const { t } = useLanguage();
  const { user, markLevelRead } = useProgress();
  const explorers = useExplorerCount(topic.slug);

  const [level, setLevel] = React.useState<number>(
    user?.preferences.defaultLevel ?? topic.difficultyDefault
  );
  const reduce = useReducedMotion();

  const saved = topicProgress(user, topic.slug);
  const read = saved.completedLevels;

  const active = topic.levels.find((l) => l.level === level) ?? topic.levels[0];
  const challenges = challengesForTopic(topic.slug);
  const questions = buildQuestions(topic);

  // Reading a level is recorded once per signed-in user per level. It is
  // fire-and-forget: an anonymous visitor can still read everything, they
  // simply do not accrue XP.
  const recorded = React.useRef<Set<number>>(new Set());
  React.useEffect(() => {
    if (!user) return;
    if (recorded.current.has(level)) return;
    recorded.current.add(level);
    void markLevelRead(topic.slug, level);
  }, [level, user, topic.slug, markLevelRead]);

  const progress =
    topic.levels.length > 0
      ? Math.round(
          (topic.levels.filter((l) => read.includes(l.level)).length /
            topic.levels.length) *
            100
        )
      : 0;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
      <div className="min-w-0">
        <div
          className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:px-0"
          role="tablist"
          aria-label={t.topic.explanationDepth}
        >
          {topic.levels.map((l) => {
            const isActive = l.level === level;
            const isRead = read.includes(l.level);
            return (
              <button
                key={l.level}
                role="tab"
                aria-selected={isActive}
                onClick={() => setLevel(l.level)}
                className={cn(
                  "group relative shrink-0 rounded-2xl border px-4 py-3 text-left transition-all duration-200",
                  isActive
                    ? "border-ink bg-ink text-paper shadow-card"
                    : "border-line bg-paper hover:border-line-strong"
                )}
              >
                <span
                  className={cn(
                    "block text-2xs font-semibold uppercase tracking-[0.12em]",
                    isActive ? "text-paper/55" : "text-ink-muted"
                  )}
                >
                  {t.topic.level} {l.level}
                </span>
                <span className="mt-1 flex items-center gap-2">
                  <span className="font-display text-[14px] font-semibold tracking-[-0.015em]">
                    {t.topic.levelNames[l.level - 1]}
                  </span>
                  {isRead && !isActive ? (
                    <span
                      className="grid h-3.5 w-3.5 place-items-center rounded-full bg-success text-white"
                      title={t.topic.read}
                    >
                      <Check size={9} />
                    </span>
                  ) : null}
                </span>
                <span
                  className={cn(
                    "mt-0.5 block text-[11px]",
                    isActive ? "text-paper/50" : "text-ink-muted"
                  )}
                >
                  {l.minutes} {t.common.minRead}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-7">
          <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-accent-ink">
            {t.topic.levelHints[active.level - 1]}
          </p>
          <blockquote className="mt-4 flex gap-3.5">
            <Quote size={18} className="mt-1 shrink-0 text-ink-ghost" aria-hidden />
            <p className="font-display text-[clamp(1.15rem,2.4vw,1.5rem)] font-medium leading-snug tracking-[-0.025em] text-ink text-balance">
              {active.lede}
            </p>
          </blockquote>

          <div className="mt-2 flex items-center gap-4 text-2xs text-ink-muted">
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              {active.minutes} {t.common.minRead}
            </span>
            <span aria-hidden>·</span>
            <span>
              {t.topic.level} {active.level} {t.topic.of} {topic.levels.length}
            </span>
          </div>

          <motion.div
            key={level}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            <LevelContent blocks={active.blocks} />
          </motion.div>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={level === 1}
              onClick={() => setLevel((l) => Math.max(1, l - 1))}
              className="inline-flex h-10 items-center rounded-full border border-line px-4 text-[13px] font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink disabled:opacity-35"
            >
              {t.topic.simpler}
            </button>
            <button
              type="button"
              disabled={level === topic.levels.length}
              onClick={() => setLevel((l) => Math.min(topic.levels.length, l + 1))}
              className="inline-flex h-10 items-center rounded-full bg-ink px-4 text-[13px] font-medium text-paper transition-colors hover:bg-ink-soft disabled:opacity-35"
            >
              {t.topic.goDeeper}
            </button>
          </div>
          <ExhibitAssistant
            topicSlug={topic.slug}
            level={level}
            suggestions={questions}
          />
        </div>

        {challenges.length > 0 ? (
          <section id="challenge" className="mt-12 scroll-mt-28">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-[clamp(1.3rem,3vw,1.7rem)] font-bold tracking-[-0.03em]">
                {t.topic.checkUnderstanding}
              </h2>
              <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                {challenges.length} {t.challenge.library.toLowerCase()}
              </span>
            </div>
            <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-ink-muted">
              {t.topic.checkLead}
            </p>
            <div className="mt-6 space-y-4">
              {challenges.map((c) => (
                <ChallengeEngine key={c.id} challenge={c} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <aside className="lg:sticky lg:top-28 lg:h-fit">
        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-paper p-5">
            <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              {t.topic.yourProgress}
            </p>
            <p className="mt-3 font-display text-3xl font-bold tracking-[-0.04em] tnum">
              {progress}
              <span className="text-lg text-ink-muted">%</span>
            </p>
            <Progress
              value={progress}
              className="mt-3"
              label={read.length + "/" + topic.levels.length}
            />
            {!user ? (
              <p className="mt-3 text-2xs leading-relaxed text-ink-muted">
                {t.auth.signInRequiredLead}
              </p>
            ) : (
              <p className="mt-3 text-2xs leading-relaxed text-ink-muted">
                {t.challenge.xpEarned}: {user.xp} {t.common.xp}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-line bg-paper p-5">
            <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              {t.topic.atAGlance}
            </p>
            <dl className="mt-3 space-y-3">
              {[
                { k: t.common.levels, v: String(topic.levels.length) },
                {
                  k: t.topic.simulationSteps,
                  v: String(topic.sim2d.steps.length),
                },
                { k: t.topic.hotspots3d, v: String(topic.model3d.hotspots.length) },
                {
                  k: t.topic.explorers,
                  v:
                    explorers === null
                      ? "…"
                      : explorers.toLocaleString(),
                },
              ].map((row) => (
                <div
                  key={row.k}
                  className="flex items-baseline justify-between gap-3 border-b border-line pb-2.5 last:border-0 last:pb-0"
                >
                  <dt className="text-[12.5px] text-ink-muted">{row.k}</dt>
                  <dd className="tnum text-[13px] font-medium">{row.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-5">
            <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              {t.topic.conceptsCovered}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {topic.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-line bg-paper-alt px-2.5 py-1 text-2xs text-ink-soft"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
