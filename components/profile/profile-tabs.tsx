"use client";

import * as React from "react";
import { Award, BookmarkX, Check } from "lucide-react";
import type { Badge as BadgeType } from "@/lib/types";
import { BADGES } from "@/lib/data/community";
import { getTopic } from "@/lib/data/topics";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/data/categories";
import { cn, formatNumber } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { TopicCard } from "@/components/topic-card";
import { SchematicThumb } from "@/components/schematic-thumb";
import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/components/auth-provider";
/*
 * Profile tabs, all reading from the signed-in session rather than seeded
 * data. Badge definitions are static (the rules live in lib/xp.ts); which ones
 * a user has earned comes from their account.
 */
export function ProgressTab() {
  const { t } = useLanguage();
  const { user } = useAuth();
  if (!user) return <SignedOutNotice />;

  const completed = user.progress.filter((p) => p.status === "completed");
  const inProgress = user.progress.filter((p) => p.status === "in-progress");

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
      <div>
        <h2 className="font-display text-[clamp(1.3rem,3vw,1.7rem)] font-bold tracking-[-0.03em]">
          {t.profile.progressByWing}
        </h2>
        <div className="mt-6 space-y-4">
          {CATEGORIES.map((cat) => {
            const total = 3;
            const done = completed.filter((p) => {
              const topic = getTopic(p.topicSlug);
              return topic?.category === cat.id;
            }).length;
            const pct = Math.round((done / total) * 100);
            return (
              <div
                key={cat.id}
                className="rounded-2xl border border-line bg-paper p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-paper-alt font-mono text-[10px] uppercase text-ink-muted">
                      {cat.id.slice(0, 3)}
                    </span>
                    <div>
                      <p className="text-[14px] font-medium">{cat.label}</p>
                      <p className="text-2xs text-ink-muted">
                        {done} / {total} {t.profile.exhibitsFinished}
                      </p>
                    </div>
                  </div>
                  <span className="tnum text-sm font-semibold">{pct}%</span>
                </div>
                <Progress
                  value={pct}
                  className="mt-4"
                  tone={pct === 100 ? "success" : "accent"}
                />
              </div>
            );
          })}
        </div>

        {inProgress.length > 0 ? (
          <>
            <h2 className="mt-12 font-display text-[clamp(1.3rem,3vw,1.7rem)] font-bold tracking-[-0.03em]">
              {t.profile.keepGoing}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {inProgress
                .map((p) => getTopic(p.topicSlug))
                .filter((topic): topic is NonNullable<typeof topic> =>
                  Boolean(topic)
                )
                .map((topic) => (
                  <TopicCard key={topic.slug} topic={topic} />
                ))}
            </div>
          </>
        ) : null}
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-line bg-paper p-5">
          <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
            {t.profile.completed}
          </p>
          <p className="mt-3 font-display text-3xl font-bold tracking-[-0.04em] tnum">
            {completed.length}
          </p>
          <ul className="mt-4 space-y-2.5">
            {completed.map((p) => {
              const topic = getTopic(p.topicSlug);
              if (!topic) return null;
              return (
                <li key={p.topicSlug}>
                  <a
                    href={"/explore/" + p.topicSlug}
                    className="flex items-center gap-3 rounded-xl border border-line p-2.5 transition-colors hover:border-line-strong"
                  >
                    <SchematicThumb
                      kind={topic.glyph}
                      label={false}
                      className="h-10 w-14 shrink-0 rounded-lg border border-line"
                    />
                    <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                      {topic.title}
                    </span>
                    <Check size={14} className="shrink-0 text-success" />
                  </a>
                </li>
              );
            })}
            {completed.length === 0 ? (
              <li className="text-[12.5px] text-ink-muted">{t.challenge.noData}</li>
            ) : null}
          </ul>
        </div>

        <div className="rounded-2xl border border-line bg-paper-alt p-5">
          <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
            {t.profile.streakRecord}
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold tracking-[-0.04em] tnum">
              {user.streak.longest}
            </span>
            <span className="text-2xs text-ink-muted">{t.profile.longest}</span>
          </div>
          <p className="mt-3 text-[12.5px] leading-relaxed text-ink-muted">
            {t.profile.streakLead}
          </p>
        </div>
      </aside>
    </div>
  );
}

export function BadgesTab() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const earnedCodes = user?.badges ?? [];

  const toneMap = {
    bronze: "border-warn/30 bg-warn-soft text-warn",
    silver: "border-line-strong bg-paper-sink text-ink-soft",
    gold: "border-warn/40 bg-warn-soft text-warn",
    accent: "border-accent/30 bg-accent-soft text-accent-ink",
  } as const;

  return (
    <div>
      <h2 className="font-display text-[clamp(1.3rem,3vw,1.7rem)] font-bold tracking-[-0.03em]">
        {t.profile.badges}
      </h2>
      <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-ink-muted">
        {t.profile.badgesLead}
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BADGES.map((badge: BadgeType) => {
          const earned = earnedCodes.includes(badge.code);
          return (
            <div
              key={badge.code}
              className={cn(
                "rounded-2xl border p-5 transition-all duration-300",
                earned
                  ? "border-line bg-paper hover:border-line-strong hover:shadow-card"
                  : "border-dashed border-line-strong bg-paper-alt"
              )}
            >
              <div className="flex items-start justify-between">
                <span
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-xl border",
                    earned ? toneMap[badge.tier] : "border-line text-ink-ghost"
                  )}
                >
                  <Award size={19} />
                </span>
                {earned ? (
                  <span className="flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-success">
                    <Check size={10} />
                    {t.profile.earned}
                  </span>
                ) : (
                  <span className="rounded-full border border-line px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-ink-faint">
                    {t.profile.locked}
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-display text-[15px] font-semibold tracking-[-0.015em]">
                {badge.name}
              </h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-muted">
                {badge.description}
              </p>
              {!earned ? (
                <p className="mt-3 text-2xs text-ink-faint">{badge.criteria}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BookmarksTab() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [removed, setRemoved] = React.useState<string[]>([]);

  if (!user) return <SignedOutNotice />;

  const bookmarks = user.bookmarks.filter((slug) => !removed.includes(slug));

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong py-20 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full border border-line bg-paper-alt text-ink-muted">
          <BookmarkX size={19} />
        </span>
        <p className="mt-4 font-display text-base font-semibold">
          {t.profile.noBookmarks}
        </p>
        <p className="mt-1.5 max-w-[40ch] text-sm text-ink-muted">
          {t.profile.noBookmarksLead}
        </p>
        <a
          href="/explore"
          className="mt-5 inline-flex rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper"
        >
          {t.profile.browseExhibits}
        </a>
      </div>
    );
  }

  const remove = async (slug: string) => {
    setRemoved((prev) => [...prev, slug]);
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "bookmark",
        topicSlug: slug,
        bookmarked: false,
      }),
    });
  };

  return (
    <div>
      <h2 className="font-display text-[clamp(1.3rem,3vw,1.7rem)] font-bold tracking-[-0.03em]">
        {t.profile.savedExhibits}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        {bookmarks.length} {t.profile.savedLead}
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {bookmarks.map((slug) => {
          const topic = getTopic(slug);
          if (!topic) return null;
          return (
            <div key={slug} className="relative">
              <TopicCard topic={topic} bookmarked />
              <button
                type="button"
                onClick={() => void remove(slug)}
                aria-label={t.common.bookmark}
                className="absolute -right-1.5 -top-1.5 z-10 grid h-7 w-7 place-items-center rounded-full border border-line bg-paper text-ink-muted shadow-card transition-colors hover:border-danger hover:text-danger"
              >
                <BookmarkX size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function HistoryTab() {
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  if (!user) return <SignedOutNotice />;

  const events = user.events ?? [];
  const totalXp = events.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div>
      <h2 className="font-display text-[clamp(1.3rem,3vw,1.7rem)] font-bold tracking-[-0.03em]">
        {t.profile.recentActivity}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        {events.length} {t.profile.entries},{" "}
        {formatNumber(totalXp)} {t.common.xp}
      </p>
      {events.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-line-strong bg-paper-alt p-8 text-center text-[13px] text-ink-muted">
          {t.challenge.noData}
        </p>
      ) : (
        <ol className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
          {events.map((event, i) => {
            const topic = event.topicSlug ? getTopic(event.topicSlug) : null;
            const when = new Date(event.createdAt).toLocaleDateString(
              locale === "id" ? "id-ID" : "en-GB",
              { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }
            );
            return (
              <li
                key={i}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-paper-alt"
              >
                <SchematicThumb
                  kind={topic?.glyph ?? "module"}
                  label={false}
                  className="h-11 w-14 shrink-0 rounded-lg border border-line"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium">
                    {event.label ?? event.kind}
                  </p>
                  {topic ? (
                    <a
                      href={"/explore/" + topic.slug}
                      className="mt-0.5 block truncate text-2xs text-ink-muted underline-offset-4 hover:text-ink hover:underline"
                    >
                      {topic.title}
                    </a>
                  ) : null}
                </div>
                <span className="shrink-0 text-2xs text-ink-muted">{when}</span>
                <span className="tnum w-12 shrink-0 text-right text-[13px] font-medium text-success">
                  +{event.amount}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function SignedOutNotice() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong py-20 text-center">
      <p className="font-display text-base font-semibold">
        {t.auth.signInRequired}
      </p>
      <p className="mt-1.5 max-w-[44ch] text-sm leading-relaxed text-ink-muted">
        {t.auth.signInRequiredLead}
      </p>
      <a
        href="/login"
        className="mt-5 inline-flex rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-soft"
      >
        {t.auth.signInToSave}
      </a>
    </div>
  );
}
