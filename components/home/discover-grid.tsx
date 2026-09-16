"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import type { CategoryId, Topic } from "@/lib/types";
import { CATEGORIES } from "@/lib/data/categories";
import { TopicCard } from "@/components/topic-card";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

type Filter = "all" | CategoryId;

/* Adapted from the reference's "Discover" tab strip: pill filters over a
   card grid, with the grid animating between states rather than re-mounting. */
export function DiscoverGrid({
  topics,
  initial = "all",
}: {
  topics: Topic[];
  initial?: Filter;
}) {
  const [filter, setFilter] = React.useState<Filter>(initial);
  const { t } = useLanguage();
  const reduce = useReducedMotion();

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: t.explore.allExhibits, count: topics.length },
    ...CATEGORIES.map((c) => ({
      id: c.id as Filter,
      label: t.wings[c.id].label,
      count: topics.filter((t) => t.category === c.id).length,
    })),
  ];

  const visible =
    filter === "all" ? topics : topics.filter((t) => t.category === filter);

  return (
    <div>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:px-0">
        {filters.map((f) => {
          const active = f.id === filter;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={active}
              className={cn(
                "relative shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors duration-200",
                active
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink-muted hover:border-line-strong hover:text-ink"
              )}
            >
              {f.label}
              <span
                className={cn(
                  "tnum ml-2 text-2xs",
                  active ? "text-paper/60" : "text-ink-ghost"
                )}
              >
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong py-20 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full border border-line bg-paper-alt text-ink-muted">
              <SlidersHorizontal size={19} />
            </span>
            <p className="mt-4 font-display text-base font-semibold">
              {t.explore.noExhibitsWing}
            </p>
            <p className="mt-1.5 max-w-[38ch] text-sm text-ink-muted">
              {t.explore.noExhibitsWingLead}
            </p>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-[13px] font-medium transition-colors hover:border-ink"
            >
              <X size={13} />
              {t.explore.clearFilter}
            </button>
          </div>
        ) : (
          <motion.div
            layout={!reduce}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {visible.map((topic) => (
                <motion.div
                  key={topic.slug}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <TopicCard topic={topic} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
