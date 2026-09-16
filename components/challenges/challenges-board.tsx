"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Flame, Target, Trophy } from "lucide-react";
import { CHALLENGES, dailyChallenges } from "@/lib/data/challenges";
import { getTopic } from "@/lib/data/topics";
import { DIFFICULTY_LABEL } from "@/lib/types";
import { ChallengeEngine } from "@/components/topic-detail/challenge-engine";
import { SchematicThumb } from "@/components/schematic-thumb";
import { Progress, Ring } from "@/components/ui/progress";
import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/utils";

export function ChallengesBoard() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();
  const { user } = useAuth();
  const daily = dailyChallenges();
  const topicChallenges = CHALLENGES.filter((c) => c.bucket === "topic");
  const totalXp = CHALLENGES.reduce((sum, c) => sum + c.xpReward, 0);

  const [activeDaily, setActiveDaily] = React.useState(0);
  const [filter, setFilter] = React.useState<string>("all");

  const subjects = React.useMemo(() => {
    const set = new Set(topicChallenges.map((c) => c.topicSlug));
    return ["all", ...Array.from(set)];
  }, [topicChallenges]);

  const visible =
    filter === "all"
      ? topicChallenges
      : topicChallenges.filter((c) => c.topicSlug === filter);

  const results = React.useMemo(() => {
    const map = new Map<string, boolean>();
    user?.progress.forEach((p) => {
      p.challengeResults.forEach((r) => {
        map.set(r.challengeId, (map.get(r.challengeId) ?? false) || r.correct);
      });
    });
    return map;
  }, [user]);

  const isCorrect = (id: string) => results.get(id) === true;

  const doneChallenges = CHALLENGES.filter((c) => isCorrect(c.id));
  const doneCount = doneChallenges.length;
  const earnedXp = doneChallenges.reduce((sum, c) => sum + c.xpReward, 0);
  const completion = Math.round((doneCount / CHALLENGES.length) * 100);

  return (
    <div className="space-y-14">
      {/* daily challenge */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-[clamp(1.4rem,3.2vw,1.9rem)] font-bold tracking-[-0.035em]">
              {t.challenge.daily}
            </h2>
            <p className="mt-2 max-w-[56ch] text-sm leading-relaxed text-ink-muted">
              {t.challenge.dailyLead}
            </p>
          </div>
          {user ? (
            <div className="flex items-center gap-3 rounded-full border border-line bg-paper px-4 py-2">
              <Flame size={15} className="text-warn" aria-hidden />
              <span className="tnum text-[13px] font-semibold">
                {user.streak.current} {t.common.days} {t.common.streak}
              </span>
            </div>
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* daily list */}
          <div className="flex flex-col gap-2">
            {daily.map((c, i) => {
              const topic = getTopic(c.topicSlug);
              const isActive = i === activeDaily;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveDaily(i)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-200",
                    isActive
                      ? "border-ink bg-paper shadow-card"
                      : "border-line bg-paper hover:border-line-strong"
                  )}
                >
                  <SchematicThumb
                    kind={topic?.glyph ?? "module"}
                    label={false}
                    className="h-12 w-16 shrink-0 rounded-lg border border-line"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium">
                      {topic?.title ?? c.topicSlug}
                    </span>
                    <span className="mt-0.5 block text-2xs text-ink-muted">
                      +{c.xpReward} XP
                    </span>
                  </span>
                  {isCorrect(c.id) ? (
                    <Check size={15} className="shrink-0 text-success" />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={daily[activeDaily].id}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.28 }}
              >
                <ChallengeEngine challenge={daily[activeDaily]} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* progress summary */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-paper p-6">
          <div className="flex items-center justify-between">
            <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              {t.challenge.completed}
            </p>
            <Target size={15} className="text-ink-faint" aria-hidden />
          </div>
          <p className="mt-4 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-bold leading-none tracking-[-0.04em] tnum">
            {doneCount}
            <span className="text-lg text-ink-ghost">/{CHALLENGES.length}</span>
          </p>
          <Progress value={completion} className="mt-5" />
        </div>

        <div className="rounded-2xl border border-line bg-paper p-6">
          <div className="flex items-center justify-between">
            <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              {t.challenge.xpEarned}
            </p>
            <Trophy size={15} className="text-ink-faint" aria-hidden />
          </div>
          <p className="mt-4 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-bold leading-none tracking-[-0.04em] tnum">
            {earnedXp}
            <span className="text-lg text-ink-ghost">/{totalXp}</span>
          </p>
          <p className="mt-5 text-2xs text-ink-muted">
            {t.challenge.totalAvailable}
          </p>
        </div>

        <div className="flex items-center gap-5 rounded-2xl border border-line bg-paper p-6">
          <Ring value={completion} size={78} stroke={6}>
            <span className="tnum text-sm font-semibold">{completion}%</span>
          </Ring>
          <div>
            <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              {t.challenge.yourProgress}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
              {completion === 0
                ? t.challenge.noData
                : completion === 100
                  ? t.challenge.allDone
                  : t.challenge.keepGoing}
            </p>
          </div>
        </div>
      </section>

      {/* all challenges */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-[clamp(1.4rem,3.2vw,1.9rem)] font-bold tracking-[-0.035em]">
              {t.challenge.library}
            </h2>
            <p className="mt-2 max-w-[56ch] text-sm leading-relaxed text-ink-muted">
              {t.challenge.libraryLead}
            </p>
          </div>
        </div>

        <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
          {subjects.map((s) => {
            const topic = getTopic(s);
            const active = filter === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setFilter(s)}
                aria-pressed={active}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-2xs font-medium transition-colors",
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-ink-muted hover:border-line-strong hover:text-ink"
                )}
              >
                {s === "all" ? t.challenge.allExhibits : topic?.title ?? s}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {visible.map((c) => {
            const topic = getTopic(c.topicSlug);
            const correct = isCorrect(c.id);
            return (
              <div key={c.id} className="relative">
                <div className="mb-3 flex items-center gap-3">
                  <SchematicThumb
                    kind={topic?.glyph ?? "module"}
                    label={false}
                    className="h-12 w-16 shrink-0 rounded-lg border border-line"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/explore/${c.topicSlug}`}
                      className="block truncate font-display text-[14.5px] font-semibold tracking-[-0.015em] underline-offset-4 hover:underline"
                    >
                      {topic?.title ?? c.topicSlug}
                    </Link>
                    <p className="mt-0.5 text-2xs text-ink-muted">
                      {topic ? DIFFICULTY_LABEL[topic.difficultyDefault] : ""} ·{" "}
                      {c.type.replace("-", " ")}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className={cn(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors",
                      correct
                        ? "border-success bg-success text-white"
                        : "border-line text-ink-ghost"
                    )}
                  >
                    {correct ? <Check size={14} /> : null}
                  </span>
                </div>
                <ChallengeEngine challenge={c} compact />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
