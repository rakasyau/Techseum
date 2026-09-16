"use client";

import * as React from "react";
import Link from "next/link";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Sparkline } from "@/components/ui/sparkline";
import { CATEGORY_MAP } from "@/lib/data/categories";
import { cn, formatNumber } from "@/lib/utils";
import type { Learner, Topic } from "@/lib/types";

/* Adapted from the reference's "Top Sellers" board: a ranked list with a
   number, an identity, a figure and a trend. Two variants share one anatomy —
   most-explored exhibits, and top learners by XP. */

export function RankBoard({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-paper">
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <div>
          <h3 className="font-display text-[15px] font-semibold tracking-[-0.02em]">
            {title}
          </h3>
          <p className="mt-0.5 text-2xs text-ink-muted">{subtitle}</p>
        </div>
        {action}
      </div>
      <ol className="divide-y divide-line">{children}</ol>
    </div>
  );
}

export function TopicRankRow({
  rank,
  topic,
  percent,
}: {
  rank: number;
  topic: Topic;
  percent: number;
}) {
  const cat = CATEGORY_MAP[topic.category];
  return (
    <li>
      <Link
        href={`/explore/${topic.slug}`}
        className="group flex items-center gap-3.5 px-5 py-3.5 transition-colors hover:bg-paper-alt"
      >
        <span
          className={cn(
            "tnum w-5 shrink-0 text-center font-display text-sm font-semibold",
            rank <= 3 ? "text-accent" : "text-ink-faint"
          )}
        >
          {rank}
        </span>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-paper-alt font-mono text-[10px] uppercase text-ink-muted">
          {topic.glyph.slice(0, 3)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13.5px] font-medium text-ink">
            {topic.title}
          </span>
          <span className="mt-0.5 block text-2xs text-ink-muted">
            {cat?.label} · {formatNumber(topic.explorerCount)} explorers
          </span>
        </span>
        {/* activity as a thin measured rule, not a decorative bar */}
        <span className="hidden w-16 shrink-0 sm:block" aria-hidden>
          <span className="block h-[3px] overflow-hidden rounded-full bg-paper-sink">
            <span
              className="block h-full rounded-full bg-accent transition-[width] duration-700 ease-out"
              style={{ width: `${percent}%` }}
            />
          </span>
        </span>
        <span className="tnum w-12 shrink-0 text-right text-xs font-medium text-ink-soft">
          {percent}%
        </span>
      </Link>
    </li>
  );
}

export function LearnerRankRow({
  rank,
  learner,
  isYou = false,
}: {
  rank: number;
  learner: Learner;
  isYou?: boolean;
}) {
  const cat = CATEGORY_MAP[learner.favorite];
  const Trend =
    learner.trend > 0 ? TrendingUp : learner.trend < 0 ? TrendingDown : Minus;
  const trendColor =
    learner.trend > 0
      ? "text-success"
      : learner.trend < 0
        ? "text-danger"
        : "text-ink-faint";

  return (
    <li>
      <Link
        href={`/profile/${learner.username}`}
        className={cn(
          "group flex items-center gap-3.5 px-5 py-3.5 transition-colors hover:bg-paper-alt",
          isYou && "bg-accent-soft/60"
        )}
      >
        <span
          className={cn(
            "tnum w-5 shrink-0 text-center font-display text-sm font-semibold",
            rank <= 3 ? "text-accent" : "text-ink-faint"
          )}
        >
          {rank}
        </span>
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-semibold"
          style={{
            background: avatarBg(learner.avatarSeed),
            color: "white",
          }}
          aria-hidden
        >
          {learner.avatarSeed}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="truncate text-[13.5px] font-medium text-ink">
              {learner.displayName}
            </span>
            {isYou ? (
              <span className="shrink-0 rounded-full bg-ink px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-paper">
                you
              </span>
            ) : null}
          </span>
          <span className="mt-0.5 block truncate text-2xs text-ink-muted">
            {cat?.label} · {learner.streak}-day streak
          </span>
        </span>
        <span className="hidden shrink-0 sm:block" aria-hidden>
          <Sparkline
            data={learner.sparkline}
            width={70}
            height={24}
            tone={learner.trend >= 0 ? "accent" : "danger"}
          />
        </span>
        <span className="flex w-16 shrink-0 items-center justify-end gap-1">
          <Trend size={12} className={trendColor} aria-hidden />
          <span className="tnum text-xs font-medium text-ink-soft">
            {formatNumber(learner.xp)}
          </span>
        </span>
      </Link>
    </li>
  );
}

/* Deterministic tonal avatars from the palette. No stock photography, no
   invented faces — a lettered chip on a considered colour. */
const AVATAR_TONES = [
  "linear-gradient(135deg, rgb(var(--accent)), rgb(var(--signal)))",
  "linear-gradient(135deg, rgb(var(--accent-deep)), rgb(var(--accent)))",
  "linear-gradient(135deg, rgb(var(--signal)), rgb(var(--warn)))",
  "linear-gradient(135deg, rgb(var(--ink)), rgb(var(--ink-muted)))",
  "linear-gradient(135deg, rgb(var(--success)), rgb(var(--signal)))",
  "linear-gradient(135deg, rgb(var(--warn)), rgb(var(--danger)))",
];

export function avatarBg(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_TONES[h % AVATAR_TONES.length];
}

export function Avatar({
  seed,
  size = 36,
  className,
}: {
  seed: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-semibold text-white",
        className
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.32,
        background: avatarBg(seed),
      }}
      aria-hidden
    >
      {seed}
    </span>
  );
}
