"use client";

import * as React from "react";
import Link from "next/link";
import { Bookmark, Compass, ArrowUpRight } from "lucide-react";
import type { Topic } from "@/lib/types";
import { SchematicThumb } from "./schematic-thumb";
import { cn, formatCount } from "@/lib/utils";
import { useExplorerCount } from "@/lib/use-stats";
import { useLanguage, interpolate } from "./language-provider";
import { useTopic } from "@/lib/i18n/content/use-content";

/* The exhibit card. Thumbnail-led so the diagram does the selling; metadata
   sits in one quiet row beneath it. Hover tilts the preview toward the
   cursor the way the brief's hero cards are angled. */
export function TopicCard({
  topic,
  bookmarked: initialBookmarked = false,
  className,
  size = "md",
}: {
  topic: Topic;
  bookmarked?: boolean;
  className?: string;
  size?: "md" | "lg";
}) {
  const [bookmarked, setBookmarked] = React.useState(initialBookmarked);
  const ref = React.useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const localTopic = useTopic(topic);
  const cat = t.wings[topic.category];
  const explorers = useExplorerCount(localTopic.slug);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--tilt-x", `${(-py * 5).toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${(px * 7).toFixed(2)}deg`);
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <article className={cn("group relative", className)}>
      <Link
        href={`/explore/${topic.slug}`}
        className="block rounded-2xl outline-offset-4"
      >
        <div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={reset}
          className="relative overflow-hidden rounded-2xl border border-line bg-paper shadow-card transition-[box-shadow,border-color,transform] duration-500 ease-out group-hover:border-line-strong group-hover:shadow-lift"
          style={{
            transform:
              "perspective(1100px) rotateX(var(--tilt-x,0deg)) rotateY(var(--tilt-y,0deg))",
            transitionProperty:
              "transform, box-shadow, border-color, background-color",
          }}
        >
          <div className="relative">
            <SchematicThumb
              kind={localTopic.glyph}
              className={cn(
                "w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]",
                size === "lg" ? "aspect-[16/10]" : "aspect-[16/11]"
              )}
            />

            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-paper/95 px-2.5 py-1 text-2xs font-medium text-ink-soft backdrop-blur-sm">
              <DifficultyDots level={localTopic.difficultyDefault} />
              {t.difficulty[localTopic.difficultyDefault - 1]}
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setBookmarked((v) => !v);
              }}
              aria-label={interpolate(
                bookmarked ? t.card.bookmarkRemove : t.card.bookmarkAdd,
                { title: localTopic.title }
              )}
              aria-pressed={bookmarked}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-line bg-paper/95 text-ink-soft backdrop-blur-sm transition-all duration-200 hover:border-ink hover:text-ink"
            >
              <Bookmark
                size={14}
                className={cn(
                  "transition-colors",
                  bookmarked && "fill-accent text-accent"
                )}
              />
            </button>
          </div>

          <div className="p-4 lg:p-5">
            <div className="flex items-center gap-2 text-2xs font-medium uppercase tracking-[0.12em] text-ink-muted">
              <span>{cat?.label}</span>
              <span aria-hidden className="text-ink-ghost">
                /
              </span>
              <span>
                {localTopic.levels.length} {t.card.levels}
              </span>
            </div>

            <h3
              className={cn(
                "mt-2 font-display font-semibold leading-snug tracking-[-0.025em] text-ink",
                size === "lg" ? "text-xl" : "text-[17px]"
              )}
            >
              {localTopic.title}
            </h3>

            <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-ink-muted">
              {localTopic.summary}
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-line pt-3.5">
              <span className="flex items-center gap-1.5 text-2xs text-ink-muted">
                <Compass size={12} />
                {explorers === null ? (
                  <span
                    className="inline-block h-3 w-6 animate-pulse rounded bg-paper-sink"
                    aria-hidden
                  />
                ) : (
                  <>
                    <span className="tnum">{formatCount(explorers)}</span>
                    {t.card.explorers}
                  </>
                )}
              </span>
              <span className="flex items-center gap-1 text-2xs font-medium text-ink-muted transition-colors group-hover:text-accent">
                {t.card.explore}
                <ArrowUpRight
                  size={13}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function DifficultyDots({ level }: { level: number }) {
  return (
    <span className="flex items-center gap-[3px]" aria-hidden>
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={cn(
            "h-[5px] w-[5px] rounded-full",
            i <= level ? "bg-accent" : "bg-ink-ghost"
          )}
        />
      ))}
    </span>
  );
}

/* Compact list row used in search results and related-topics rails. */
export function TopicRow({ topic: source }: { topic: Topic }) {
  const { t } = useLanguage();
  const topic = useTopic(source);
  const cat = t.wings[topic.category];
  return (
    <Link
      href={`/explore/${topic.slug}`}
      className="group flex items-center gap-4 rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-line hover:bg-paper-alt"
    >
      <SchematicThumb
        kind={topic.glyph}
        label={false}
        className="h-12 w-16 shrink-0 rounded-lg border border-line"
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-ink">
          {topic.title}
        </span>
        <span className="mt-0.5 flex items-center gap-2 text-2xs text-ink-muted">
          {cat?.label}
          <span aria-hidden>·</span>
          {t.difficulty[topic.difficultyDefault - 1]}
        </span>
      </span>
      <ArrowUpRight
        size={15}
        className="shrink-0 text-ink-ghost transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
      />
    </Link>
  );
}
