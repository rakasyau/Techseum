"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Award,
  Bookmark,
  Clock,
  Flame,
  History,
  Settings2,
  Trophy,
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/components/auth-provider";
import { formatNumber, levelProgress } from "@/lib/utils";
import { Ring } from "@/components/ui/progress";
import { Avatar } from "@/components/rank-board";
import { cn } from "@/lib/utils";
import {
  ProgressTab,
  BadgesTab,
  BookmarksTab,
  HistoryTab,
} from "./profile-tabs";
import { SettingsTab } from "./profile-settings";

type Tab = "progress" | "badges" | "bookmarks" | "history" | "settings";

/*
 * The signed-in user's own profile. Everything shown is read from the session
 * user, which the server loads from MongoDB; nothing here is seeded.
 */
export function ProfileView() {
  const { t, locale } = useLanguage();
  const { user, loading } = useAuth();
  const reduce = useReducedMotion();
  const [tab, setTab] = React.useState<Tab>("progress");

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "progress", label: t.profile.progress, icon: Trophy },
    { id: "badges", label: t.profile.badges, icon: Award },
    { id: "bookmarks", label: t.profile.bookmarks, icon: Bookmark },
    { id: "history", label: t.profile.history, icon: History },
    { id: "settings", label: t.profile.preferences, icon: Settings2 },
  ];

  if (loading) {
    return (
      <div className="mx-auto max-w-[1320px] px-5 py-16 lg:px-8">
        <div className="h-40 animate-pulse rounded-3xl bg-paper-sink" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-[1320px] px-5 py-20 lg:px-8">
        <div className="mx-auto flex max-w-[520px] flex-col items-center rounded-3xl border border-line bg-paper p-10 text-center shadow-card">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent-ink">
            <Trophy size={24} />
          </span>
          <h1 className="mt-5 font-display text-[clamp(1.5rem,3.6vw,2rem)] font-bold tracking-[-0.035em]">
            {t.auth.signInTitle}
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
            {t.auth.signInRequiredLead}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
            >
              {t.auth.signInAction}
            </Link>
            <Link
              href="/register"
              className="inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-sm font-medium transition-colors hover:border-ink"
            >
              {t.auth.registerAction}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const level = levelProgress(user.xp);
  const earnedCount = user.badges.length;
  const joined = new Date(user.createdAt).toLocaleDateString(
    locale === "id" ? "id-ID" : "en-GB",
    { month: "long", year: "numeric" }
  );

  return (
    <div className="mx-auto max-w-[1320px] px-5 pb-24 pt-10 lg:px-8 lg:pt-14">
      <header className="flex flex-col gap-6 rounded-3xl border border-line bg-paper p-6 lg:flex-row lg:items-center lg:gap-8 lg:p-8">
        <Avatar seed={user.avatarSeed} size={88} className="text-2xl" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-[clamp(1.6rem,4vw,2.4rem)] font-bold tracking-[-0.038em]">
              {user.displayName}
            </h1>
            <span className="rounded-full bg-ink px-2.5 py-1 text-2xs font-semibold uppercase tracking-wider text-paper">
              {t.profile.you}
            </span>
          </div>
          <p className="mt-1 text-[13px] text-ink-muted">@{user.username}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-2xs text-ink-muted">
            <span className="flex items-center gap-1.5">
              <Flame size={13} className="text-warn" aria-hidden />
              <span className="tnum font-medium text-ink-soft">
                {user.streak.current}
              </span>
              {t.common.days} {t.common.streak}
            </span>
            <span className="flex items-center gap-1.5">
              <Trophy size={13} aria-hidden />
              <span className="tnum font-medium text-ink-soft">
                {formatNumber(user.xp)}
              </span>
              {t.common.xp}
            </span>
            <span className="flex items-center gap-1.5">
              <Award size={13} aria-hidden />
              <span className="tnum font-medium text-ink-soft">
                {earnedCount}
              </span>
              {t.common.badges}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} aria-hidden />
              {t.profile.joined} {joined}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 lg:flex-col lg:items-end">
          <Ring value={level.pct} size={92} stroke={6}>
            <span className="text-center">
              <span className="block font-display text-lg font-bold leading-none tnum">
                {level.level}
              </span>
              <span className="mt-0.5 block text-[9px] uppercase tracking-wider text-ink-muted">
                {t.common.level}
              </span>
            </span>
          </Ring>
          <p className="text-2xs text-ink-muted lg:text-right">
            <span className="tnum font-medium text-ink-soft">
              {formatNumber(level.toNext)}
            </span>
            <br />
            {t.common.xp} {t.leaderboard.toNext} {level.level + 1}
          </p>
        </div>
      </header>

      <div
        className="no-scrollbar mt-8 flex gap-2 overflow-x-auto border-b border-line pb-px"
        role="tablist"
        aria-label={t.nav.profile}
      >
        {TABS.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.id)}
              className={cn(
                "relative flex shrink-0 items-center gap-2 rounded-t-xl px-4 py-3 text-[13px] font-medium transition-colors",
                active ? "text-ink" : "text-ink-muted hover:text-ink"
              )}
            >
              <item.icon size={14} />
              {item.label}
              {active ? (
                <motion.span
                  layoutId="profile-tab"
                  className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-ink"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
          >
            {tab === "progress" ? <ProgressTab /> : null}
            {tab === "badges" ? <BadgesTab /> : null}
            {tab === "bookmarks" ? <BookmarksTab /> : null}
            {tab === "history" ? <HistoryTab /> : null}
            {tab === "settings" ? <SettingsTab /> : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
