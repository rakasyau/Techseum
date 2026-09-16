"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { TOPICS } from "@/lib/data/topics";
import { TopicCard } from "@/components/topic-card";

export default function NotFound() {
  const { t } = useLanguage();
  const suggestions = TOPICS.slice(0, 4);

  return (
    <div className="mx-auto max-w-[1320px] px-5 py-20 lg:px-8 lg:py-28">
      <div className="max-w-[62ch]">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-ink">
          404
        </span>
        <h1 className="mt-5 font-display text-[clamp(2rem,5.4vw,3.4rem)] font-bold leading-[1.03] tracking-[-0.042em] text-balance">
          {t.notFound.title}
        </h1>
        <p className="mt-5 text-[16px] leading-relaxed text-ink-muted">
          {t.notFound.lead}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/explore"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
          >
            {t.notFound.browse}
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-sm font-medium transition-colors hover:border-ink"
          >
            {t.notFound.home}
          </Link>
        </div>
      </div>

      <h2 className="mt-16 font-display text-[15px] font-semibold tracking-[-0.02em]">
        {t.notFound.popular}
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {suggestions.map((topic) => (
          <TopicCard key={topic.slug} topic={topic} />
        ))}
      </div>
    </div>
  );
}
