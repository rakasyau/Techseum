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
  error?: string;
}

/*
 * Real site statistics.
 *
 * `null` means "not known" — still loading, or the request failed. The UI
 * must say so rather than show a fabricated zero or a hard-coded marketing
 * number, which is what this hook exists to prevent.
 */
export function useSiteStats() {
  const [stats, setStats] = React.useState<SiteStats | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/stats", { cache: "no-store" });
        const data = (await response.json()) as SiteStats;
        if (!cancelled) {
          setStats({
            learners: data.learners,
            xpAwarded: data.xpAwarded,
            topics: data.topics ?? [],
            maxExplorers: data.maxExplorers ?? 0,
          });
        }
      } catch {
        if (!cancelled) {
          setStats({
            learners: null,
            xpAwarded: null,
            topics: [],
            maxExplorers: 0,
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
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
