"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DICTIONARIES, type Dict } from "@/lib/i18n";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/config";

/*
 * Language state lives on the client and is mirrored to a cookie so the
 * server can render the right language on the next request, and to the user's
 * account when they are signed in.
 *
 * `interpolate` supports {name} placeholders so sentences can be reordered
 * per language without splitting them into fragments.
 */

interface LanguageContextValue {
  locale: Locale;
  t: Dict;
  setLocale: (next: Locale) => void;
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

const COOKIE = "techseum_lang";

function readCookie(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(COOKIE + "="));
  const value = match?.split("=")[1];
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function interpolate(
  template: string,
  vars?: Record<string, string | number>
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : "{" + key + "}"
  );
}

export function LanguageProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = React.useState<Locale>(initialLocale);
  const router = useRouter();

  // Adopt the cookie value once on mount; the server had no way to know it
  // when it rendered the initial payload.
  React.useEffect(() => {
    const stored = readCookie();
    if (stored !== locale) setLocaleState(stored);
    document.documentElement.lang = stored;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = React.useCallback(
    (next: Locale) => {
      setLocaleState(next);
      document.cookie =
        COOKIE + "=" + next + "; path=/; max-age=" + 60 * 60 * 24 * 365;
      document.documentElement.lang = next;

      // Persist to the account when signed in, so the preference follows the
      // user. Failure is non-fatal: the cookie already applied it locally.
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "preferences", language: next }),
      }).catch(() => {});

      router.refresh();
    },
    [router]
  );

  const value = React.useMemo<LanguageContextValue>(
    () => ({ locale, t: DICTIONARIES[locale], setLocale }),
    [locale, setLocale]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}

// Convenience hook for components that only need the dictionary.
export function useT(): Dict {
  return useLanguage().t;
}
