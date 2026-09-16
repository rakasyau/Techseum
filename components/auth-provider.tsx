"use client";

import * as React from "react";
import type { PublicUser } from "@/lib/models/user";

/*
 * Client-side session store.
 *
 * The server remains the source of truth; this holds the last known user so
 * the header and profile can render without a round trip, and exposes the
 * progress actions the UI needs. Every write goes through the API and the
 * returned user replaces local state, so XP shown is always server-computed.
 */

interface AuthContextValue {
  user: PublicUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
  signIn: (identifier: string, password: string) => Promise<void>;
  register: (input: {
    email: string;
    username: string;
    displayName: string;
    password: string;
  }) => Promise<void>;
  updatePreferences: (patch: Record<string, unknown>) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

async function readError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error ?? "Something went wrong.";
  } catch {
    return "Something went wrong.";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<PublicUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  const refresh = React.useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      if (!response.ok) {
        setUser(null);
        return;
      }
      const data = (await response.json()) as { user: PublicUser | null };
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const signIn = React.useCallback(
    async (identifier: string, password: string) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      if (!response.ok) throw new Error(await readError(response));
      await refresh();
    },
    [refresh]
  );

  const register = React.useCallback(
    async (input: {
      email: string;
      username: string;
      displayName: string;
      password: string;
    }) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error(await readError(response));
      await refresh();
    },
    [refresh]
  );

  const signOut = React.useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const updatePreferences = React.useCallback(
    async (patch: Record<string, unknown>) => {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "preferences", ...patch }),
      });
      if (!response.ok) return;
      const data = (await response.json()) as { user: PublicUser };
      setUser(data.user);
    },
    []
  );

  const value = React.useMemo<AuthContextValue>(
    () => ({ user, loading, refresh, signOut, signIn, register, updatePreferences }),
    [user, loading, refresh, signOut, signIn, register, updatePreferences]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
