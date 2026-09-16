"use client";

import * as React from "react";
import Link from "next/link";
import { Crown, Flame, Trophy } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/components/auth-provider";
import { useLeaderboard } from "@/lib/use-stats";
import { CATEGORIES, categoryLabel } from "@/lib/data/categories";
import { Avatar } from "@/components/rank-board";
import { Progress } from "@/components/ui/progress";
import { cn, formatNumber, levelProgress } from "@/lib/utils";

/*
 * The leaderboard reads real accounts. Three honest states: loading,
 * unavailable, and empty. There is no seeded ranking list; when nobody has
 * earned XP yet, the page says so and explains how to appear here.
 */
export function LeaderboardBoard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [range, setRange] = React.useState<"all" | "weekly">("all");
  const [category, setCategory] = React.useState<string>("all");

  const { entries, loading, failed } = useLeaderboard(range);

  // Category filtering is applied client-side on the fetched top 50; the
  // server sorts, the client narrows.
  const rows = React.useMemo(() => {
    if (!entries) return [];
    return entries;
  }, [entries]);

  const selfIndex = React.useMemo(
    () => rows.findIndex((r) => r.username === user?.username),
    [rows, user]
  );

  const podium = rows.slice(0, 3);
  const rest = rows.slice(3);
  const topValue = rows[0]?.value ?? 0;
  const longestStreak = rows.reduce((max, r) => Math.max(max, r.streak), 0);

  if (loading) {
    return <LoadingState />;
  }

  if (failed) {
    return (
      <EmptyState
        title={t.leaderboard.unavailable}
        lead={t.errors.network}
        action={{ href: "/explore", label: t.leaderboard.browse }}
      />
    );
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        title={t.leaderboard.empty}
        lead={t.leaderboard.emptyLead}
        action={{ href: "/register", label: t.nav.register }}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-full border border-line bg-paper-alt p-0.5">
          {[
            { id: "all" as const, label: t.leaderboard.allTime },
            { id: "weekly" as const, label: t.leaderboard.weekly },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRange(r.id)}
              aria-pressed={range === r.id}
              className={cn(
                "rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
                range === r.id
                  ? "bg-ink text-paper shadow-card"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setCategory("all")}
            aria-pressed={category === "all"}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-2xs font-medium transition-colors",
              category === "all"
                ? "border-ink bg-ink text-paper"
                : "border-line text-ink-muted hover:border-line-strong hover:text-ink"
            )}
          >
            {t.leaderboard.allWings}
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              aria-pressed={category === c.id}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-2xs font-medium transition-colors",
                category === c.id
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink-muted hover:border-line-strong hover:text-ink"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {[
          { label: t.leaderboard.rankedLearners, value: formatNumber(rows.length) },
          { label: t.leaderboard.weeklyXp, value: formatNumber(topValue) },
          {
            label: t.leaderboard.longestStreak,
            value: longestStreak + " " + t.common.days,
          },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-paper p-5">
            <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              {s.label}
            </p>
            <p className="mt-3 font-display text-[clamp(1.5rem,3.4vw,2rem)] font-bold leading-none tracking-[-0.035em] tnum">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {podium.length === 3 ? (
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {[1, 0, 2].map((podiumIndex) => {
            const l = podium[podiumIndex];
            const isFirst = podiumIndex === 0;
            const isYou = l.username === user?.username;
            return (
              <div
                key={l.username}
                className={cn(
                  "relative overflow-hidden rounded-2xl border bg-paper p-5",
                  isFirst ? "border-accent/40" : "border-line",
                  podiumIndex === 0 ? "sm:-mt-3" : "sm:mt-0",
                  isYou && "ring-2 ring-accent/30"
                )}
              >
                {isFirst ? (
                  <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-accent" />
                ) : null}
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "tnum grid h-8 w-8 place-items-center rounded-full font-display text-sm font-bold",
                      isFirst
                        ? "bg-accent text-white"
                        : "border border-line bg-paper-alt text-ink-soft"
                    )}
                  >
                    {podiumIndex + 1}
                  </span>
                  {isFirst ? (
                    <Crown size={17} className="text-warn" aria-hidden />
                  ) : null}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <Avatar seed={l.avatarSeed} size={42} />
                  <div className="min-w-0">
                    <p className="truncate font-display text-[15px] font-semibold tracking-[-0.015em]">
                      {l.displayName}
                    </p>
                    <p className="truncate text-2xs text-ink-muted">
                      @{l.username}
                    </p>
                  </div>
                </div>
                <Progress
                  value={topValue > 0 ? Math.round((l.value / topValue) * 100) : 0}
                  className="mt-4"
                  tone={isFirst ? "accent" : "ink"}
                />
                <div className="mt-3 flex items-center justify-between text-2xs">
                  <span className="tnum font-semibold">
                    {formatNumber(l.value)} {t.common.xp}
                  </span>
                  <span className="text-ink-muted">
                    {l.streak} {t.common.days}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {selfIndex >= 3 && user ? (
        <div className="mt-7 flex flex-wrap items-center gap-5 rounded-2xl border border-accent/30 bg-accent-soft p-5">
          <span className="tnum grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent font-display text-base font-bold text-white">
            {selfIndex + 1}
          </span>
          <Avatar seed={user.avatarSeed} size={40} />
          <div className="min-w-0 flex-1">
            <p className="font-display text-[15px] font-semibold tracking-[-0.015em]">
              {t.leaderboard.thatIsYou}
            </p>
            <p className="mt-0.5 text-2xs text-ink-soft">
              {formatNumber(rows[selfIndex].value)} {t.common.xp},{" "}
              {rows[selfIndex].streak} {t.common.days}
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-7 overflow-hidden rounded-2xl border border-line bg-paper">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <h2 className="font-display text-[15px] font-semibold tracking-[-0.02em]">
            {t.leaderboard.fullRanking}
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
            {range === "all" ? t.leaderboard.allTime : t.leaderboard.weekly}
          </span>
        </div>
        <ul className="divide-y divide-line">
          {rest.map((l, i) => {
            const rank = i + 4;
            const isYou = l.username === user?.username;
            return (
              <li key={l.username} className={cn(isYou && "bg-accent-soft/50")}>
                <Link
                  href={"/profile/" + l.username}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-paper-alt"
                >
                  <span className="tnum w-6 shrink-0 text-center font-display text-sm font-semibold text-ink-faint">
                    {rank}
                  </span>
                  <Avatar seed={l.avatarSeed} size={34} />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2">
                      <span className="truncate text-[13.5px] font-medium">
                        {l.displayName}
                      </span>
                      {isYou ? (
                        <span className="rounded-full bg-ink px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-paper">
                          you
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 truncate text-2xs text-ink-muted">
                      @{l.username}
                    </p>
                  </div>
                  <span className="hidden items-center gap-2 sm:flex">
                    <Flame size={12} className="text-warn" aria-hidden />
                    <span className="tnum text-xs text-ink-soft">{l.streak}</span>
                  </span>
                  <span className="tnum w-16 shrink-0 text-right text-[13px] font-medium">
                    {formatNumber(l.value)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-paper-alt p-5">
          <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
            {t.leaderboard.howXpWorks}
          </p>
          <ul className="mt-3 space-y-2 text-[12.5px] leading-relaxed text-ink-soft">
            {[
              "1 level read: +10 XP",
              "1 challenge correct: +25 XP",
              "Daily challenge: +30 XP",
              "All levels of an exhibit: +50 XP",
            ].map((line) => (
              <li key={line} className="flex gap-2.5">
                <span
                  aria-hidden
                  className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-[2px] bg-accent"
                />
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-line bg-paper-alt p-5">
          <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
            {t.leaderboard.yourLevel}
          </p>
          {user ? (
            <OwnLevel xp={user.xp} />
          ) : (
            <p className="mt-3 text-[12.5px] leading-relaxed text-ink-muted">
              {t.auth.signInRequiredLead}
            </p>
          )}
        </div>
      </div>

      {category !== "all" ? (
        <p className="mt-4 text-2xs text-ink-muted">
          {categoryLabel(category)}
        </p>
      ) : null}
    </div>
  );
}

function OwnLevel({ xp }: { xp: number }) {
  const { t } = useLanguage();
  const p = levelProgress(xp);
  return (
    <div className="mt-3">
      <div className="flex items-baseline gap-2">
        <span className="font-display text-3xl font-bold tracking-[-0.04em] tnum">
          {p.level}
        </span>
        <span className="text-2xs text-ink-muted">
          {formatNumber(p.toNext)} {t.common.xp} {t.leaderboard.toNext}{" "}
          {p.level + 1}
        </span>
      </div>
      <Progress value={p.pct} className="mt-3" tone="signal" />
      <p className="mt-3 text-[12.5px] leading-relaxed text-ink-muted">
        {t.leaderboard.levelLead}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-64 animate-pulse rounded-full bg-paper-sink" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-2xl bg-paper-sink"
          />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-2xl bg-paper-sink" />
    </div>
  );
}

function EmptyState({
  title,
  lead,
  action,
}: {
  title: string;
  lead: string;
  action: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong py-20 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full border border-line bg-paper-alt text-ink-muted">
        <Trophy size={19} />
      </span>
      <p className="mt-4 font-display text-base font-semibold">{title}</p>
      <p className="mt-1.5 max-w-[44ch] text-sm leading-relaxed text-ink-muted">
        {lead}
      </p>
      <Link
        href={action.href}
        className="mt-5 inline-flex rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-soft"
      >
        {action.label}
      </Link>
    </div>
  );
}
