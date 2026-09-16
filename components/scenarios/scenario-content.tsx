"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { Scenario, Topic } from "@/lib/types";
import { useLanguage } from "@/components/language-provider";
import { ScenarioTimeline } from "@/components/scenarios/scenario-timeline";
import { TopicCard } from "@/components/topic-card";
import { Simulation2D } from "@/components/simulations-2d/simulation-2d";

export function ScenarioContent({
  scenario,
  topic,
  others,
}: {
  scenario: Scenario;
  topic: Topic | undefined;
  others: Scenario[];
}) {
  const { t } = useLanguage();

  return (
    <article>
      <header className="border-b border-line bg-paper-alt">
        <div className="mx-auto max-w-[1320px] px-5 py-12 lg:px-8 lg:py-16">
          <div className="max-w-[880px]">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-ink">
              {t.scenarios.label}
            </span>
            <h1 className="mt-4 font-display text-[clamp(2rem,5.4vw,3.5rem)] font-bold leading-[1.03] tracking-[-0.042em] text-balance">
              {scenario.title}
            </h1>
            <p className="mt-5 max-w-[62ch] text-[16.5px] leading-relaxed text-ink-muted text-pretty">
              {scenario.summary}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-2xs text-ink-muted">
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                {scenario.duration}
              </span>
              <span aria-hidden>·</span>
              <span>
                {scenario.steps.length} {t.scenarios.steps}
              </span>
              {topic ? (
                <>
                  <span aria-hidden>·</span>
                  <Link
                    href={`/explore/${topic.slug}`}
                    className="inline-flex items-center gap-1 font-medium text-ink-soft underline-offset-4 hover:text-ink hover:underline"
                  >
                    {t.scenarios.relatedExhibit}: {topic.title}
                    <ArrowRight size={11} />
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1320px] px-5 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
          <div>
            <h2 className="font-display text-[clamp(1.3rem,3vw,1.7rem)] font-bold tracking-[-0.03em]">
              {t.scenarios.follow}
            </h2>
            <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-ink-muted">
              {t.scenarios.followLead}
            </p>
            <div className="mt-9">
              <ScenarioTimeline steps={scenario.steps} />
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:h-fit">
            {topic ? (
              <div>
                <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                  {t.scenarios.mechanism}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {t.scenarios.mechanismLead}
                </p>
                <div className="mt-4">
                  <TopicCard topic={topic} />
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      {topic ? (
        <section className="mx-auto max-w-[1320px] px-5 pb-12 lg:px-8">
          <h2 className="font-display text-[clamp(1.3rem,3vw,1.7rem)] font-bold tracking-[-0.03em]">
            {t.scenarios.driveIt}
          </h2>
          <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-ink-muted">
            {t.scenarios.driveItLead}
          </p>
          <div className="mt-6">
            <Simulation2D config={topic.sim2d} title={topic.title} />
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-[1320px] px-5 pb-24 lg:px-8">
        <div className="rounded-3xl border border-line bg-paper-alt p-6 lg:p-10">
          <h2 className="font-display text-[clamp(1.3rem,3vw,1.7rem)] font-bold tracking-[-0.03em]">
            {t.scenarios.more}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {others.map((s) => (
              <Link
                key={s.slug}
                href={`/scenarios/${s.slug}`}
                className="group rounded-2xl border border-line bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-lift"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                  {s.steps.length} {t.scenarios.steps} · {s.duration}
                </span>
                <h3 className="mt-3 font-display text-[17px] font-semibold tracking-[-0.02em]">
                  {s.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-muted">
                  {s.summary}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-2xs font-medium text-ink-soft transition-colors group-hover:text-accent">
                  {t.scenarios.followSequence}
                  <ArrowRight
                    size={12}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
