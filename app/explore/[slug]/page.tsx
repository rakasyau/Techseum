import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { TOPICS, getTopic, relatedTopics } from "@/lib/data/topics";
import { CATEGORY_MAP } from "@/lib/data/categories";
import { DIFFICULTY_LABEL } from "@/lib/types";
import { SimulationStudio } from "@/components/topic-detail/simulation-studio";
import { TopicReader } from "@/components/topic-detail/topic-reader";
import { TopicCard } from "@/components/topic-card";
import { DifficultyDots } from "@/components/topic-card";
import { ExplorerCount } from "@/components/explorer-count";
import { Reveal } from "@/components/motion-primitives";

export function generateStaticParams() {
  return TOPICS.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const topic = getTopic(params.slug);
  if (!topic) return { title: "Exhibit not found" };
  return {
    title: topic.title,
    description: topic.summary,
  };
}

export default function TopicPage({ params }: { params: { slug: string } }) {
  const topic = getTopic(params.slug);
  if (!topic) notFound();

  const cat = CATEGORY_MAP[topic.category];
  const related = relatedTopics(topic);

  return (
    <article>
      {/* breadcrumb */}
      <div className="mx-auto max-w-[1320px] px-5 pt-8 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-2xs text-ink-muted"
        >
          <Link
            href="/explore"
            className="underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Explore
          </Link>
          <ChevronRight size={12} aria-hidden />
          <Link
            href={`/explore?category=${topic.category}`}
            className="underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            {cat?.label}
          </Link>
          <ChevronRight size={12} aria-hidden />
          <span className="truncate text-ink-soft">{topic.title}</span>
        </nav>
      </div>

      {/* hero */}
      <header className="mx-auto max-w-[1320px] px-5 pb-10 pt-7 lg:px-8 lg:pb-14">
        <div className="max-w-[880px]">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-alt px-2.5 py-1 text-2xs font-medium text-ink-soft">
              <DifficultyDots level={topic.difficultyDefault} />
              {DIFFICULTY_LABEL[topic.difficultyDefault]}
            </span>
            <span className="rounded-full border border-line px-2.5 py-1 text-2xs text-ink-muted">
              {cat?.label}
            </span>
            <ExplorerCount slug={topic.slug} />
          </div>

          <h1 className="mt-5 font-display text-[clamp(2.1rem,5.8vw,3.8rem)] font-bold leading-[1.02] tracking-[-0.042em] text-balance">
            {topic.title}
          </h1>
          <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed text-ink-muted text-pretty">
            {topic.summary}
          </p>
        </div>
      </header>

      {/* simulation */}
      <section className="mx-auto max-w-[1320px] px-5 lg:px-8">
        <SimulationStudio topic={topic} />
      </section>

      {/* reading */}
      <section className="mx-auto max-w-[1320px] px-5 pt-14 lg:px-8 lg:pt-20">
        <TopicReader topic={topic} />
      </section>

      {/* related */}
      {related.length > 0 ? (
        <section className="mx-auto max-w-[1320px] px-5 pb-24 pt-16 lg:px-8 lg:pt-20">
          <Reveal>
            <h2 className="font-display text-[clamp(1.4rem,3.2vw,1.9rem)] font-bold tracking-[-0.035em]">
              Continue from here
            </h2>
            <p className="mt-2 max-w-[54ch] text-sm leading-relaxed text-ink-muted">
              These exhibits build directly on what you just read.
            </p>
          </Reveal>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {related.map((t) => (
              <TopicCard key={t.slug} topic={t} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
