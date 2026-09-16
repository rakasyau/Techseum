"use client";

import * as React from "react";
import Link from "next/link";
import { Flame, Trophy } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useLeaderboard, useSiteStats } from "@/lib/use-stats";
import { Avatar } from "@/components/rank-board";
import { Progress } from "@/components/ui/progress";
import { useTopics } from "@/lib/i18n/content/use-content";
import { TOPICS } from "@/lib/data/topics";
import { cn, formatNumber } from "@/lib/utils";

/*
 * The homepage boards, entirely from real data.
 *
 * Both panels have three honest states: loading, unavailable, and empty. An
 * empty board explains how to appear on it rather than inventing entries.
 */
export function HomeBoards() {
  const { t } = useLanguage();
  const stats = useSiteStats();
  const { entries, loading, failed } = useLeaderboard("all");

  const localized = useTopics(TOPICS);
  const localizedBySlug = React.useMemo(
    () => new Map(localized.map((topic) => [topic.slug, topic])),
    [localized]
  );
  const topics = stats?.topics ?? [];
  const maxExplorers = stats?.maxExplorers ?? 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Most explored, from real progress records */}
      <Board
        title={t.home.mostExplored}
        subtitle={t.home.mostExploredLead}
        badge="all time"
      >
        {stats === null ? (
          <SkeletonRows count={4} />
        ) : topics.length === 0 ? (
          <EmptyRow
            message={t.leaderboard.empty}
            hint={t.leaderboard.emptyLead}
            href="/explore"
            action={t.leaderboard.browse}
          />
        ) : (
          topics.slice(0, 6).map((topic, i) => {
            const percent =
              maxExplorers > 0
                ? Math.round((topic.explorers / maxExplorers) * 100)
                : 0;
            return (
              <li key={topic.slug}>
                <Link
                  href={"/explore/" + topic.slug}
                  className="flex items-center gap-3.5 px-5 py-3.5 transition-colors hover:bg-paper-alt"
                >
                  <span
                    className={cn(
                      "tnum w-5 shrink-0 text-center font-display text-sm font-semibold",
                      i < 3 ? "text-accent" : "text-ink-faint"
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-paper-alt font-mono text-[10px] uppercase text-ink-muted">
                    {topic.glyph.slice(0, 3)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium text-ink">
                      {localizedBySlug.get(topic.slug)?.title ?? topic.title}
                    </span>
                    <span className="mt-0.5 block text-2xs text-ink-muted">
                      {t.wings[topic.category as keyof typeof t.wings].label} ·{" "}
                      <span className="tnum">{topic.explorers}</span>{" "}
                      {t.topic.explorers}
                    </span>
                  </span>
                  <span className="hidden w-16 shrink-0 sm:block" aria-hidden>
                    <span className="block h-[3px] overflow-hidden rounded-full bg-paper-sink">
                      <span
                        className="block h-full rounded-full bg-accent"
                        style={{ width: percent + "%" }}
                      />
                    </span>
                  </span>
                  <span className="tnum w-10 shrink-0 text-right text-xs font-medium text-ink-soft">
                    {percent}%
                  </span>
                </Link>
              </li>
            );
          })
        )}
      </Board>

      {/* Top learners, from real accounts */}
      <Board
        title={t.home.topLearners}
        subtitle={t.home.topLearnersLead}
        badge="all time"
      >
        {loading ? (
          <SkeletonRows count={4} />
        ) : failed ? (
          <EmptyRow
            message={t.leaderboard.unavailable}
            hint={t.errors.network}
            href="/leaderboard"
            action={t.leaderboard.title}
          />
        ) : !entries || entries.length === 0 ? (
          <EmptyRow
            message={t.leaderboard.empty}
            hint={t.leaderboard.emptyLead}
            href="/register"
            action={t.nav.register}
          />
        ) : (
          entries.slice(0, 6).map((entry, i) => (
            <li key={entry.username}>
              <Link
                href={"/profile/" + entry.username}
                className="flex items-center gap-3.5 px-5 py-3.5 transition-colors hover:bg-paper-alt"
              >
                <span
                  className={cn(
                    "tnum w-5 shrink-0 text-center font-display text-sm font-semibold",
                    i < 3 ? "text-accent" : "text-ink-faint"
                  )}
                >
                  {i + 1}
                </span>
                <Avatar seed={entry.avatarSeed} size={36} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-medium text-ink">
                    {entry.displayName}
                  </span>
                  <span className="mt-0.5 block truncate text-2xs text-ink-muted">
                    @{entry.username}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1.5 text-2xs text-ink-muted">
                  <Flame size={12} className="text-warn" aria-hidden />
                  <span className="tnum">{entry.streak}</span>
                </span>
                <span className="tnum w-16 shrink-0 text-right text-xs font-medium text-ink-soft">
                  {formatNumber(entry.value)}
                </span>
              </Link>
            </li>
          ))
        )}
      </Board>
    </div>
  );
}

function Board({
  title,
  subtitle,
  badge,
  children,
}: {
  title: string;
  subtitle: string;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-paper">
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line bg-paper-alt text-accent">
            <Trophy size={15} />
          </span>
          <div>
            <h3 className="font-display text-[15px] font-semibold tracking-[-0.02em]">
              {title}
            </h3>
            <p className="mt-0.5 text-2xs text-ink-muted">{subtitle}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
          {badge}
        </span>
      </div>
      <ol className="divide-y divide-line">{children}</ol>
    </div>
  );
}

function SkeletonRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="flex items-center gap-3.5 px-5 py-3.5">
          <span className="h-4 w-5 animate-pulse rounded bg-paper-sink" />
          <span className="h-9 w-9 animate-pulse rounded-lg bg-paper-sink" />
          <span className="min-w-0 flex-1">
            <span className="block h-3.5 w-2/3 animate-pulse rounded bg-paper-sink" />
            <span className="mt-1.5 block h-2.5 w-1/3 animate-pulse rounded bg-paper-sink" />
          </span>
        </li>
      ))}
    </>
  );
}

function EmptyRow({
  message,
  hint,
  href,
  action,
}: {
  message: string;
  hint: string;
  href: string;
  action: string;
}) {
  return (
    <li className="px-5 py-8 text-center">
      <p className="text-[13.5px] font-medium text-ink">{message}</p>
      <p className="mx-auto mt-1.5 max-w-[42ch] text-[12.5px] leading-relaxed text-ink-muted">
        {hint}
      </p>
      <Link
        href={href}
        className="mt-4 inline-flex rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-paper transition-colors hover:bg-ink-soft"
      >
        {action}
      </Link>
    </li>
  );
}
