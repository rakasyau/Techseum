"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SchematicThumb } from "@/components/schematic-thumb";
import { DiagramGround } from "@/components/diagram-ground";
import { Sparkle } from "@/components/motion-primitives";
import { useLanguage } from "@/components/language-provider";
import { useSiteStats } from "@/lib/use-stats";
import { TOPICS } from "@/lib/data/topics";
import { formatNumber } from "@/lib/utils";

export function Hero() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();
  const stats = useSiteStats();
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yA = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const yB = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const yC = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Every figure is counted, not asserted. Topics and simulation steps come
  // from the catalogue; the learner count comes from the database and is
  // hidden entirely until it is known.
  const totalSimSteps = TOPICS.reduce(
    (sum, topic) => sum + topic.sim2d.steps.length,
    0
  );

  const statCells = [
    { value: String(TOPICS.length), label: t.home.statExhibits },
    { value: String(totalSimSteps), label: t.home.statSimSteps },
    stats?.learners === null || stats?.learners === undefined
      ? null
      : { value: formatNumber(stats.learners), label: t.home.statLearners },
  ].filter((cell): cell is { value: string; label: string } => cell !== null);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <DiagramGround
        cell={48}
        opacity={1}
        mask="radial-gradient(ellipse 90% 70% at 65% 30%, black, transparent 72%)"
      />

      <div className="relative mx-auto grid max-w-[1320px] items-center gap-14 px-5 pb-16 pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="relative z-10 max-w-[640px]">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-line bg-paper-alt px-3 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-accent" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span className="text-2xs font-medium tracking-[0.02em] text-ink-soft">
              {t.home.heroFeatured}:{" "}
              <span className="text-ink">{t.home.heroCpuTitle}</span>
            </span>
          </div>

          <h1 className="mt-7 font-display text-[clamp(2.6rem,7.2vw,5.1rem)] font-bold leading-[0.95] tracking-[-0.04em] text-ink text-balance">
            {t.home.heroTitle1}
            <br />
            {t.home.heroTitle2}
            <br />
            <span className="relative inline-block">
              {t.home.heroTitle3}
              <svg
                aria-hidden
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
                className="absolute -bottom-1 left-0 h-[10px] w-full text-accent"
              >
                <path
                  d="M2 8.5C60 3.5 130 2.5 298 5.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-8 max-w-[46ch] text-[17px] leading-relaxed text-ink-muted text-pretty">
            {t.home.heroLead}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" variant="solid">
              <Link href="/explore">
                {t.common.startExploring}
                <ArrowRight size={17} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/scenarios/open-a-website">
                <Play size={15} className="fill-current" />
                {t.home.watchDemo}
              </Link>
            </Button>
          </div>

          <dl
            className="mt-12 grid max-w-[520px] gap-px overflow-hidden rounded-2xl border border-line bg-line"
            style={{ gridTemplateColumns: "repeat(" + statCells.length + ", 1fr)" }}
          >
            {statCells.map((s) => (
              <div key={s.label} className="bg-paper px-4 py-4 sm:px-5">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="flex items-baseline font-display text-[clamp(1.6rem,3.6vw,2.15rem)] font-bold leading-none tracking-[-0.04em] tnum">
                    {s.value}
                  </span>
                  <span className="mt-1.5 block text-2xs leading-tight text-ink-muted">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative z-10 h-[380px] sm:h-[440px] lg:h-[560px]">
          <svg
            aria-hidden
            viewBox="0 0 520 520"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[126%] w-[126%] -translate-x-1/2 -translate-y-1/2 text-line-dash"
          >
            <circle
              cx="260"
              cy="260"
              r="238"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3 8"
            />
            <circle
              cx="260"
              cy="260"
              r="186"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3 8"
              opacity="0.55"
            />
          </svg>

          <Sparkle
            size={22}
            tone="accent"
            className="absolute left-[6%] top-[14%] animate-float"
          />
          <Sparkle
            size={14}
            tone="signal"
            className="absolute right-[10%] top-[6%] animate-float [animation-delay:1.2s]"
          />
          <Sparkle
            size={17}
            tone="warn"
            className="absolute bottom-[16%] left-[12%] animate-float [animation-delay:2.1s]"
          />

          <motion.div
            style={reduce ? undefined : { y: yC }}
            className="absolute right-[4%] top-[3%] w-[52%] max-w-[300px] sm:w-[58%]"
          >
            <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-lift sm:rotate-[7deg]">
              <SchematicThumb kind="router" className="aspect-[16/11] w-full" />
            </div>
          </motion.div>

          <motion.div
            style={reduce ? undefined : { y: yB }}
            className="absolute bottom-[6%] left-[2%] w-[50%] max-w-[290px] sm:w-[56%]"
          >
            <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-lift sm:rotate-[-8deg]">
              <SchematicThumb kind="ssd" className="aspect-[16/11] w-full" />
            </div>
          </motion.div>

          <motion.div
            style={reduce ? undefined : { y: yA }}
            className="absolute bottom-[16%] right-[8%] w-[58%] max-w-[330px] sm:w-[62%]"
          >
            <Link
              href="/explore/cpu"
              className="block overflow-hidden rounded-2xl border border-line bg-paper shadow-pop transition-transform duration-300 hover:-translate-y-1 sm:rotate-[-2.5deg]"
            >
              <SchematicThumb kind="cpu" className="aspect-[16/11] w-full" />
              <div className="flex items-center justify-between border-t border-line px-4 py-3">
                <div>
                  <p className="font-display text-[15px] font-semibold tracking-[-0.02em]">
                    {t.home.heroCpuTitle}
                  </p>
                  <p className="mt-0.5 text-2xs text-ink-muted">
                    {t.home.heroCpuMeta}
                  </p>
                </div>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-paper">
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </motion.div>

          {stats && stats.learners !== null && stats.learners > 0 ? (
            <div className="absolute right-[2%] top-[46%] hidden items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 shadow-card sm:flex">
              <span className="flex items-end gap-[2px]" aria-hidden>
                {[7, 12, 9, 15, 11].map((h, i) => (
                  <span
                    key={i}
                    className="w-[3px] rounded-sm bg-accent"
                    style={{ height: h, opacity: 0.5 + i * 0.1 }}
                  />
                ))}
              </span>
              <span className="tnum text-2xs font-medium text-ink-soft">
                {formatNumber(stats.learners)} {t.home.liveActivity}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
