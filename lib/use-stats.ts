"use client";

import * as React from "react";
import type { CategoryId, Model3DKind } from "@/lib/types";

export interface TrendingTopic {
  slug: string;
  title: string;
  category: CategoryId;
  glyph: Model3DKind;
  explorers: number;
}

export interface SiteStats {
  learners: number | null;
  xpAwarded: number | null;
  topics: TrendingTopic[];
  maxExplorers: number;
  /** Real explore count per exhibit slug. Missing slug means no one yet. */
  explorerCounts: Record<string, number>;
  error?: string;
}

/*
 * Real site statistics, shared across every caller.
 *
 * A module-level store is used instead of one fetch per component: the
 * homepage, exhibit cards and the exhibit page all read the same numbers, and
 * dozens of cards mounting at once must not each hit the API.
 *
 * `null` means "not known" — still loading, or the request failed. The UI must
 * say so rather than show a fabricated zero or a hard-coded marketing number,
 * which is what this store exists to prevent.
 */
let cachedStats: SiteStats | null = null;
let inFlight: Promise<void> | null = null;
const subscribers = new Set<() => void>();

function notify() {
  for (const fn of subscribers) fn();
}

function loadStats(): Promise<void> {
  if (inFlight) return inFlight;
  inFlight = (async () => {
    try {
      const response = await fetch("/api/stats", { cache: "no-store" });
      const data = (await response.json()) as SiteStats;
      cachedStats = {
        learners: data.learners,
        xpAwarded: data.xpAwarded,
        topics: data.topics ?? [],
        maxExplorers: data.maxExplorers ?? 0,
        explorerCounts: data.explorerCounts ?? {},
      };
    } catch {
      cachedStats = {
        learners: null,
        xpAwarded: null,
        topics: [],
        maxExplorers: 0,
        explorerCounts: {},
      };
    } finally {
      inFlight = null;
      notify();
    }
  })();
  return inFlight;
}

export function useSiteStats() {
  const [, force] = React.useReducer((n: number) => n + 1, 0);

  React.useEffect(() => {
    const fn = () => force();
    subscribers.add(fn);
    if (cachedStats === null) void loadStats();
    return () => {
      subscribers.delete(fn);
    };
  }, []);

  return cachedStats;
}

/*
 * How many distinct learners have opened a single exhibit.
 *
 * `null` means the count is not known yet — still loading, or the request
 * failed. Callers render a neutral placeholder rather than a fabricated
 * number, which is what this hook exists to guarantee.
 */
export function useExplorerCount(slug: string): number | null {
  const stats = useSiteStats();
  if (stats === null) return null;
  return stats.explorerCounts[slug] ?? 0;
}

export interface LeaderboardEntry {
  username: string;
  displayName: string;
  avatarSeed: string;
  value: number;
  streak: number;
  badges: number;
}

export function useLeaderboard(range: "all" | "weekly") {
  const [entries, setEntries] = React.useState<LeaderboardEntry[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);

    (async () => {
      try {
        const response = await fetch("/api/leaderboard?range=" + range, {
          cache: "no-store",
        });
        const data = (await response.json()) as {
          entries?: LeaderboardEntry[];
        };
        if (cancelled) return;
        if (!response.ok) {
          setFailed(true);
          setEntries([]);
        } else {
          setEntries(data.entries ?? []);
        }
      } catch {
        if (!cancelled) {
          setFailed(true);
          setEntries([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [range]);

  return { entries, loading, failed };
}
