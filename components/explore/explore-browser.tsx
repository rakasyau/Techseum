"use client";

import * as React from "react";
import {
  LayoutGrid,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { Difficulty, Topic } from "@/lib/types";
import { DIFFICULTY_LABEL } from "@/lib/types";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/data/categories";
import { TopicCard } from "@/components/topic-card";
import { cn } from "@/lib/utils";

type SortKey = "popular" | "difficulty" | "title";

export function ExploreBrowser({
  topics,
  initialCategory,
}: {
  topics: Topic[];
  initialCategory?: string;
}) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<string>(
    initialCategory && CATEGORY_MAP[initialCategory as keyof typeof CATEGORY_MAP]
      ? initialCategory
      : "all"
  );
  const [levels, setLevels] = React.useState<Difficulty[]>([]);
  const [sort, setSort] = React.useState<SortKey>("popular");

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = topics.filter((t) => {
      if (category !== "all" && t.category !== category) return false;
      if (levels.length && !levels.includes(t.difficultyDefault)) return false;
      if (!q) return true;
      return [t.title, t.summary, t.category, ...t.tags]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
    return [...out].sort((a, b) => {
      if (sort === "popular") return b.explorerCount - a.explorerCount;
      if (sort === "difficulty")
        return a.difficultyDefault - b.difficultyDefault;
      return a.title.localeCompare(b.title);
    });
  }, [topics, query, category, levels, sort]);

  const activeFilters =
    (category !== "all" ? 1 : 0) + levels.length + (query ? 1 : 0);

  const clearAll = () => {
    setQuery("");
    setCategory("all");
    setLevels([]);
  };

  const toggleLevel = (l: Difficulty) =>
    setLevels((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
    );

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-5 border-b border-line bg-paper/90 px-5 py-4 backdrop-blur-xl lg:top-[72px] lg:mx-0 lg:rounded-2xl lg:border lg:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-2.5 rounded-full border border-line bg-paper-alt px-4 py-2.5 transition-colors focus-within:border-ink">
            <Search size={16} className="shrink-0 text-ink-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search exhibits, concepts, tags…"
              aria-label="Search exhibits"
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink-faint"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="shrink-0 text-ink-faint transition-colors hover:text-ink"
              >
                <X size={15} />
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 rounded-full border border-line px-3.5 py-2.5">
              <span className="text-2xs font-medium uppercase tracking-[0.1em] text-ink-muted">
                Sort
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="cursor-pointer bg-transparent text-[13px] font-medium outline-none"
              >
                <option value="popular">Most explored</option>
                <option value="difficulty">Easiest first</option>
                <option value="title">A to Z</option>
              </select>
            </label>
            <span className="hidden rounded-full border border-line px-3.5 py-2.5 text-[13px] font-medium text-ink-soft sm:block">
              <span className="tnum">{results.length}</span> exhibits
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-2xs font-medium uppercase tracking-[0.1em] text-ink-muted">
            <LayoutGrid size={12} />
            Wing
          </span>
          <FilterPill
            active={category === "all"}
            onClick={() => setCategory("all")}
          >
            All
          </FilterPill>
          {CATEGORIES.map((c) => (
            <FilterPill
              key={c.id}
              active={category === c.id}
              onClick={() => setCategory(c.id)}
            >
              {c.label}
            </FilterPill>
          ))}

          <span className="hidden h-5 w-px bg-line sm:block" />

          <span className="hidden items-center gap-1.5 text-2xs font-medium uppercase tracking-[0.1em] text-ink-muted sm:flex">
            <SlidersHorizontal size={12} />
            Level
          </span>
          {([1, 2, 3, 4] as Difficulty[]).map((l) => (
            <FilterPill
              key={l}
              active={levels.includes(l)}
              onClick={() => toggleLevel(l)}
              className="hidden sm:inline-flex"
            >
              {DIFFICULTY_LABEL[l]}
            </FilterPill>
          ))}

          {activeFilters > 0 ? (
            <button
              type="button"
              onClick={clearAll}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-2xs font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
            >
              <X size={12} />
              Clear {activeFilters} filter{activeFilters > 1 ? "s" : ""}
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-7">
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong py-24 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full border border-line bg-paper-alt text-ink-muted">
              <Search size={21} />
            </span>
            <p className="mt-5 font-display text-lg font-semibold">
              Nothing matches those filters
            </p>
            <p className="mt-2 max-w-[42ch] text-sm text-ink-muted">
              Try a broader search, or clear the level filter — the technical
              exhibits sit at levels 3 and 4.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-soft"
            >
              <X size={13} />
              Clear everything
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((topic) => (
              <TopicCard key={topic.slug} topic={topic} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full border px-3 py-1.5 text-2xs font-medium transition-colors duration-200",
        active
          ? "border-ink bg-ink text-paper"
          : "border-line text-ink-muted hover:border-line-strong hover:text-ink",
        className
      )}
    >
      {children}
    </button>
  );
}
