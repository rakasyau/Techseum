"use client";

import * as React from "react";
import { useAuth } from "@/components/auth-provider";
import type { PublicUser } from "@/lib/models/user";
import type { Locale } from "@/lib/i18n/config";

/*
 * One hook for every progress mutation. It posts to /api/progress, which
 * computes XP server-side and returns the authoritative user document. The
 * local session is updated from that response, never from a locally guessed
 * number.
 */

export function useProgress() {
  const { user, refresh } = useAuth();
  const [pending, setPending] = React.useState(false);
  const [lastAward, setLastAward] = React.useState<number | null>(null);

  const post = React.useCallback(
    async (body: Record<string, unknown>, withAward = false) => {
      if (!user) return null;
      setPending(true);
      try {
        const response = await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!response.ok) return null;
        const data = (await response.json()) as {
          user: PublicUser;
          awarded?: number;
        };
        if (withAward && typeof data.awarded === "number") {
          setLastAward(data.awarded > 0 ? data.awarded : null);
        }
        // Pull the authoritative copy into the session store.
        await refresh();
        return data.user;
      } catch {
        return null;
      } finally {
        setPending(false);
      }
    },
    [user, refresh]
  );

  const markLevelRead = React.useCallback(
    (topicSlug: string, level: number) =>
      post({ type: "progress", topicSlug, action: "read-level", level }, true),
    [post]
  );

  const recordChallenge = React.useCallback(
    (challengeId: string, correct: boolean) =>
      post({ type: "challenge", challengeId, correct }, true),
    [post]
  );

  const toggleBookmark = React.useCallback(
    (topicSlug: string, bookmarked: boolean) =>
      post({ type: "bookmark", topicSlug, bookmarked }),
    [post]
  );

  return {
    user,
    pending,
    lastAward,
    clearAward: () => setLastAward(null),
    markLevelRead,
    recordChallenge,
    toggleBookmark,
  };
}

// Reads progress for a single exhibit out of the session user.
export function topicProgress(user: PublicUser | null, topicSlug: string) {
  const entry = user?.progress?.find((p) => p.topicSlug === topicSlug);
  return {
    completedLevels: entry?.completedLevels ?? [],
    status: entry?.status ?? "not-started",
    challengeResults: entry?.challengeResults ?? [],
  };
}

export function isBookmarked(user: PublicUser | null, topicSlug: string) {
  return Boolean(user?.bookmarks?.includes(topicSlug));
}

export async function saveLanguage(locale: Locale) {
  return fetch("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "preferences", language: locale }),
  });
}
