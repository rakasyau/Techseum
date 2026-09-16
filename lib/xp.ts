/*
 * Gamification rules, in one place.
 *
 * These amounts are the contract between the UI copy and the server. The
 * server is the only place that awards XP; the client never sends a number.
 */

export const XP_RULES = {
  levelRead: 10,
  challengeCorrect: 25,
  topicCompleteBonus: 50,
  dailyChallenge: 30,
} as const;

export const BADGE_RULES = {
  firstExplorer: "first-explorer",
  deepDiver: "deep-diver",
  sevenDayStreak: "seven-day-streak",
  cpuMaster: "cpu-master",
  challengeChaser: "challenge-chaser",
  labRat: "lab-rat",
} as const;

/*
 * One champion badge per wing, derived from the category id rather than
 * hard-coded, so adding a wing automatically gets a badge. The category list
 * itself lives in lib/data/categories.ts and is the single source of truth.
 */
export function championBadge(categoryId: string): string {
  return "category-champion-" + categoryId;
}

// level = floor(sqrt(xp / 100)); kept identical to the value shown in the UI.
export function xpToLevel(xp: number): number {
  return Math.floor(Math.sqrt(Math.max(0, xp) / 100));
}

export function levelFloor(level: number): number {
  return level * level * 100;
}

export function levelProgress(xp: number) {
  const level = xpToLevel(xp);
  const floor = levelFloor(level);
  const ceiling = levelFloor(level + 1);
  const span = ceiling - floor || 1;
  return {
    level,
    pct: Math.min(100, Math.round(((xp - floor) / span) * 100)),
    toNext: Math.max(0, ceiling - xp),
    floor,
    ceiling,
  };
}

export function dedupeKey(kind: string, a?: string, b?: string | number) {
  return [kind, a, b].filter((v) => v !== undefined).join(":");
}

/*
 * Streak is computed from the stored lastActiveDate rather than a counter, so
 * it stays correct across timezones and gaps.
 *   same day      → unchanged
 *   previous day  → +1
 *   older / none  → reset to 1
 */
export function nextStreak(
  current: { current: number; longest: number; lastActiveDate: Date | null },
  now = new Date()
): { current: number; longest: number; lastActiveDate: Date } {
  const dayMs = 24 * 60 * 60 * 1000;
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

  if (!current.lastActiveDate) {
    return { current: 1, longest: Math.max(1, current.longest), lastActiveDate: now };
  }

  const gapDays = Math.round(
    (startOfDay(now) - startOfDay(new Date(current.lastActiveDate))) / dayMs
  );

  if (gapDays <= 0) {
    return { ...current, lastActiveDate: current.lastActiveDate };
  }
  if (gapDays === 1) {
    const next = current.current + 1;
    return {
      current: next,
      longest: Math.max(next, current.longest),
      lastActiveDate: now,
    };
  }
  return { current: 1, longest: Math.max(current.longest, 1), lastActiveDate: now };
}
