"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Boxes, FlaskConical, Layers } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import { SectionHeading } from "@/components/section-heading";
import { useLanguage } from "@/components/language-provider";
import { CATEGORIES } from "@/lib/data/categories";

export function AboutContent() {
  const { t } = useLanguage();

  const METHOD = [
    {
      icon: BookOpen,
      title: t.about.method1Title,
      body: t.about.method1Body,
    },
    {
      icon: Layers,
      title: t.about.method2Title,
      body: t.about.method2Body,
    },
    {
      icon: Boxes,
      title: t.about.method3Title,
      body: t.about.method3Body,
    },
    {
      icon: FlaskConical,
      title: t.about.method4Title,
      body: t.about.method4Body,
    },
  ];

  const PRINCIPLES = [
    {
      n: "01",
      title: t.about.principle1Title,
      body: t.about.principle1Body,
    },
    {
      n: "02",
      title: t.about.principle2Title,
      body: t.about.principle2Body,
    },
    {
      n: "03",
      title: t.about.principle3Title,
      body: t.about.principle3Body,
    },
    {
      n: "04",
      title: t.about.principle4Title,
      body: t.about.principle4Body,
    },
    {
      n: "05",
      title: t.about.principle5Title,
      body: t.about.principle5Body,
    },
  ];

  const REAL = [
    { k: t.about.running, v: t.about.runningLead },
    { k: t.about.generated, v: t.about.generatedLead },
    { k: t.about.notIncluded, v: t.about.notIncludedLead },
  ];

  return (
    <div>
      <section className="border-b border-line bg-paper-alt">
        <div className="mx-auto max-w-[1320px] px-5 py-16 lg:px-8 lg:py-24">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-ink">
            {t.about.eyebrow}
          </span>
          <h1 className="mt-5 max-w-[24ch] font-display text-[clamp(2.1rem,5.8vw,4rem)] font-bold leading-[1.02] tracking-[-0.042em] text-balance">
            {t.about.title}
          </h1>
          <p className="mt-7 max-w-[62ch] text-[17px] leading-relaxed text-ink-muted text-pretty">
            {t.about.lead}
          </p>
        </div>
      </section>

      <section id="method" className="mx-auto max-w-[1320px] scroll-mt-24 px-5 py-16 lg:px-8 lg:py-24">
        <Reveal>
          <SectionHeading
            title={t.about.methodTitle}
            description={t.about.methodLead}
          />
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
          {METHOD.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.05} className="bg-paper">
              <div className="flex h-full gap-5 p-6 lg:p-8">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-paper-alt text-accent">
                  <m.icon size={20} />
                </span>
                <div>
                  <h2 className="font-display text-[17px] font-semibold tracking-[-0.02em]">
                    {m.title}
                  </h2>
                  <p className="mt-2 max-w-[46ch] text-[13.5px] leading-relaxed text-ink-muted">
                    {m.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-paper-alt">
        <div className="mx-auto max-w-[1320px] px-5 py-16 lg:px-8 lg:py-24">
          <Reveal>
            <SectionHeading
              title={t.about.wingsTitle}
              description={t.about.wingsLead}
              href="/explore"
              linkLabel={t.about.browseAll}
            />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.04}>
                <Link
                  href={`/explore?category=${c.id}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-lift"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-ghost">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-4 font-display text-[17px] font-semibold tracking-[-0.02em]">
                    {c.label}
                  </span>
                  <span className="mt-2 flex-1 text-[13px] leading-relaxed text-ink-muted">
                    {c.blurb}
                  </span>
                  <span className="mt-5 flex items-center gap-1.5 text-2xs font-medium text-ink-soft transition-colors group-hover:text-accent">
                    {t.about.openWing}
                    <ArrowRight
                      size={12}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 py-16 lg:px-8 lg:py-24">
        <Reveal>
          <SectionHeading
            title={t.about.principlesTitle}
            description={t.about.principlesLead}
          />
        </Reveal>
        <ol className="mt-10 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
          {PRINCIPLES.map((p, i) => (
            <Reveal as="li" key={p.n} delay={i * 0.04}>
              <div className="flex flex-col gap-3 p-6 sm:flex-row sm:items-baseline sm:gap-8 lg:p-8">
                <span className="tnum font-mono text-[11px] tracking-[0.18em] text-accent-ink">
                  {p.n}
                </span>
                <div className="grid flex-1 gap-2 sm:grid-cols-[minmax(0,260px)_minmax(0,1fr)] sm:gap-8">
                  <h3 className="font-display text-[17px] font-semibold tracking-[-0.02em]">
                    {p.title}
                  </h3>
                  <p className="max-w-[62ch] text-[13.5px] leading-relaxed text-ink-muted">
                    {p.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 pb-24 lg:px-8">
        <div className="grid gap-10 rounded-3xl border border-line bg-paper p-8 lg:grid-cols-2 lg:gap-16 lg:p-12">
          <div>
            <h2 className="font-display text-[clamp(1.5rem,3.4vw,2.1rem)] font-bold tracking-[-0.035em]">
              {t.about.realTitle}
            </h2>
            <p className="mt-4 max-w-[52ch] text-[14px] leading-relaxed text-ink-muted">
              {t.about.realLead}
            </p>
          </div>
          <dl className="space-y-5">
            {REAL.map((row) => (
              <div
                key={row.k}
                className="border-b border-line pb-5 last:border-0 last:pb-0"
              >
                <dt className="text-[13px] font-semibold">{row.k}</dt>
                <dd className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">
                  {row.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
