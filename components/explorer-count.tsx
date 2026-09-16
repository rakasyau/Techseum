"use client";

import { Compass } from "lucide-react";
import { useExplorerCount } from "@/lib/use-stats";
import { formatCount } from "@/lib/utils";
import { useLanguage } from "./language-provider";

/*
 * The real number of learners who have opened this exhibit, read from the
 * shared stats store. While it is unknown it renders a quiet placeholder
 * rather than a fabricated figure, so the static exhibit page can stay
 * prerendered.
 */
export function ExplorerCount({ slug }: { slug: string }) {
  const count = useExplorerCount(slug);
  const { t } = useLanguage();

  return (
    <span className="flex items-center gap-1.5 text-2xs text-ink-muted">
      <Compass size={11} aria-hidden />
      {count === null ? (
        <span
          className="inline-block h-3 w-8 animate-pulse rounded bg-paper-sink"
          aria-hidden
        />
      ) : (
        <>
          <span className="tnum">{formatCount(count)}</span>
          {t.card.explorers}
        </>
      )}
    </span>
  );
}
