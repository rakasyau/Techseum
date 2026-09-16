"use client";

import { useLanguage } from "@/components/language-provider";

/*
 * Shared page header. Keeps the server pages free of client code while still
 * letting the heading text come from the language dictionary.
 */
export function PageHeading({
  titleKey,
  leadKey,
}: {
  titleKey: "exploreTitle" | "challengeTitle" | "labTitle" | "leaderboardTitle";
  leadKey: "exploreLead" | "challengeLead" | "labLead" | "leaderboardLead";
}) {
  const { t } = useLanguage();
  const pages = t.pages as unknown as Record<string, string>;

  return (
    <header className="max-w-[70ch]">
      <h1 className="font-display text-[clamp(2rem,5.4vw,3.4rem)] font-bold leading-[1.02] tracking-[-0.042em] text-balance">
        {pages[titleKey]}
      </h1>
      <p className="mt-4 text-[16px] leading-relaxed text-ink-muted text-pretty">
        {pages[leadKey]}
      </p>
    </header>
  );
}
