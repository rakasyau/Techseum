"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
  completedTopics: string[];
  bookmarks: string[];
  badges: Badge[];
}

interface UserProgressContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  xp: number;
  level: number;
  streak: number;
  completedTopics: string[];
  bookmarks: string[];
  badges: Badge[];
  addXP: (amount: number) => void;
  markTopicCompleted: (topicId: string) => void;
  toggleBookmark: (topicId: string) => void;
  unlockBadge: (badge: Badge) => void;
  login: (userData: UserProfile) => void;
  logout: () => Promise<void>;
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

export function UserProgressProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback guest state if unauthenticated
  const [guestState, setGuestState] = useState({
    xp: 0,
    level: 1,
    streak: 1,
    completedTopics: [] as string[],
    bookmarks: [] as string[],
    badges: [] as Badge[],
  });

  // Check auth session on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  const syncProgressToCloud = async (payload: {
    xpDelta?: number;
    completedTopicId?: string;
    bookmarkTopicId?: string;
    newBadge?: Badge;
  }) => {
    if (!user) return;
    try {
      const res = await fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error("Failed to sync progress to cloud:", err);
    }
  };

  const addXP = (amount: number) => {
    if (user) {
      const newXp = user.xp + amount;
      const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;
      setUser({ ...user, xp: newXp, level: newLevel });
      syncProgressToCloud({ xpDelta: amount });
    } else {
      setGuestState((prev) => {
        const nextXp = prev.xp + amount;
        return {
          ...prev,
          xp: nextXp,
          level: Math.floor(Math.sqrt(nextXp / 100)) + 1,
        };
      });
    }
  };

  const markTopicCompleted = (topicId: string) => {
    if (user) {
      if (!user.completedTopics.includes(topicId)) {
        const newCompleted = [...user.completedTopics, topicId];
        const newXp = user.xp + 50;
        const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;
        setUser({
          ...user,
          completedTopics: newCompleted,
          xp: newXp,
          level: newLevel,
        });
        syncProgressToCloud({ completedTopicId: topicId, xpDelta: 50 });
      }
    } else {
      setGuestState((prev) => {
        if (prev.completedTopics.includes(topicId)) return prev;
        const nextXp = prev.xp + 50;
        return {
          ...prev,
          completedTopics: [...prev.completedTopics, topicId],
          xp: nextXp,
          level: Math.floor(Math.sqrt(nextXp / 100)) + 1,
        };
      });
    }
  };

  const toggleBookmark = (topicId: string) => {
    if (user) {
      const isBookmarked = user.bookmarks.includes(topicId);
      const newBookmarks = isBookmarked
        ? user.bookmarks.filter((id) => id !== topicId)
        : [...user.bookmarks, topicId];
      setUser({ ...user, bookmarks: newBookmarks });
      syncProgressToCloud({ bookmarkTopicId: topicId });
    } else {
      setGuestState((prev) => {
        const isBookmarked = prev.bookmarks.includes(topicId);
        return {
          ...prev,
          bookmarks: isBookmarked
            ? prev.bookmarks.filter((id) => id !== topicId)
            : [...prev.bookmarks, topicId],
        };
      });
    }
  };

  const unlockBadge = (badge: Badge) => {
    if (user) {
      if (!user.badges.some((b) => b.id === badge.id)) {
        setUser({ ...user, badges: [...user.badges, badge] });
        syncProgressToCloud({ newBadge: badge });
      }
    } else {
      setGuestState((prev) => {
        if (prev.badges.some((b) => b.id === badge.id)) return prev;
        return { ...prev, badges: [...prev.badges, badge] };
      });
    }
  };

  const login = (userData: UserProfile) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const xp = user ? user.xp : guestState.xp;
  const level = user ? user.level : guestState.level;
  const streak = user ? user.streak : guestState.streak;
  const completedTopics = user ? user.completedTopics : guestState.completedTopics;
  const bookmarks = user ? user.bookmarks : guestState.bookmarks;
  const badges = user ? user.badges : guestState.badges;

  return (
    <UserProgressContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        xp,
        level,
        streak,
        completedTopics,
        bookmarks,
        badges,
        addXP,
        markTopicCompleted,
        toggleBookmark,
        unlockBadge,
        login,
        logout,
      }}
    >
      {children}
    </UserProgressContext.Provider>
  );
}

export function useUserProgress() {
  const context = useContext(UserProgressContext);
  if (!context) {
    throw new Error("useUserProgress must be used within a UserProgressProvider");
  }
  return context;
}
