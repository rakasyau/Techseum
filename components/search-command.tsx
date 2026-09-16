"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { TOPICS } from "@/lib/data/topics";
import { CATEGORY_MAP } from "@/lib/data/categories";
import { ModelGlyph } from "./glyphs";
import { cn } from "@/lib/utils";
import { useLanguage, interpolate } from "./language-provider";

export function SearchCommand({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const [query, setQuery] = React.useState("");
  const [cursor, setCursor] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TOPICS.slice(0, 6);
    return TOPICS.filter((t) =>
      [t.title, t.summary, t.category, ...t.tags]
        .join(" ")
        .toLowerCase()
        .includes(q)
    ).slice(0, 8);
  }, [query]);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      const id = window.setTimeout(() => inputRef.current?.focus(), 40);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  React.useEffect(() => setCursor(0), [query]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => Math.min(c + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      }
      if (e.key === "Enter" && results[cursor]) {
        router.push(`/explore/${results[cursor].slug}`);
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, cursor, router, onOpenChange]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[70] flex items-start justify-center bg-ink/25 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.search}
            className="w-full max-w-[620px] overflow-hidden rounded-2xl border border-line bg-paper shadow-pop"
          >
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <Search size={17} className="text-ink-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.search.placeholder}
                className="w-full bg-transparent text-[15px] outline-none placeholder:text-ink-faint"
              />
              <kbd className="rounded border border-line bg-paper-alt px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">
                ESC
              </kbd>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <p className="text-sm font-medium">
                    {interpolate(t.search.emptyTitle, { query })}
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">
                    {t.search.emptyLead}
                  </p>
                </div>
              ) : (
                results.map((topic, i) => {
                  const cat = CATEGORY_MAP[topic.category as keyof typeof CATEGORY_MAP];
                  return (
                    <button
                      key={topic.slug}
                      type="button"
                      onMouseEnter={() => setCursor(i)}
                      onClick={() => {
                        router.push(`/explore/${topic.slug}`);
                        onOpenChange(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3.5 rounded-xl px-3 py-3 text-left transition-colors",
                        cursor === i ? "bg-paper-alt" : "hover:bg-paper-alt"
                      )}
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line text-ink-soft">
                        <ModelGlyph kind={topic.glyph} size={19} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {topic.title}
                        </span>
                        <span className="block truncate text-xs text-ink-muted">
                          {cat?.label} · {topic.levels.length} {t.common.levels} ·{" "}
                          {topic.levels[0].minutes} {t.search.min}
                        </span>
                      </span>
                      <span className="text-ink-ghost">↵</span>
                    </button>
                  );
                })
              )}
            </div>

            <div className="flex items-center gap-4 border-t border-line px-5 py-3 text-2xs text-ink-muted">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-line bg-paper-alt px-1 py-0.5 font-mono">↑↓</kbd>
                {t.search.navigate}
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-line bg-paper-alt px-1 py-0.5 font-mono">↵</kbd>
                {t.common.open}
              </span>
              <span className="ml-auto">
                {interpolate(t.search.results, { count: results.length })}
              </span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
