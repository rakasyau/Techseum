"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  Aperture,
  BookOpen,
  Cpu,
  Fingerprint,
  Focus,
  Keyboard,
  Layout,
  Monitor,
  Plug,
  Power,
  Radio,
  RefreshCw,
  Route,
  Save,
  Server,
  Sun,
  type LucideIcon,
} from "lucide-react";
import type { ScenarioStep } from "@/lib/types";
import { useLanguage } from "@/components/language-provider";

const ICONS: Record<string, LucideIcon> = {
  Aperture,
  BookOpen,
  Cpu,
  Fingerprint,
  Focus,
  Keyboard,
  Layout,
  Monitor,
  Plug,
  Power,
  Radio,
  RefreshCw,
  Route,
  Save,
  Server,
  Sun,
};

/* Scroll-driven vertical timeline. Each step reveals as it enters the
   viewport and the progress rule scrubs with the reader. Under reduced motion
   every step is simply present and the rule stays static. */
export function ScenarioTimeline({ steps }: { steps: ScenarioStep[] }) {
  const reduce = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 85%"],
  });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative">
      <div
        aria-hidden
        className="absolute bottom-2 left-[19px] top-2 w-px bg-line md:left-[27px]"
      >
        {!reduce ? (
          <motion.div
            style={{ height }}
            className="w-full origin-top bg-accent"
          />
        ) : null}
      </div>

      <ol className="space-y-5 md:space-y-7">
        {steps.map((step, i) => (
          <ScenarioRow key={step.order} step={step} index={i} />
        ))}
      </ol>
    </div>
  );
}

function ScenarioRow({ step, index }: { step: ScenarioStep; index: number }) {
  const reduce = useReducedMotion();
  const { t } = useLanguage();
  const Icon = ICONS[step.icon] ?? Cpu;

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex gap-4 md:gap-8"
    >
      <div className="relative z-10 shrink-0">
        <span className="grid h-10 w-10 place-items-center rounded-full border border-line bg-paper text-ink md:h-14 md:w-14">
          <Icon size={21} />
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col rounded-2xl border border-line bg-paper p-5 transition-all duration-300 hover:border-line-strong hover:shadow-card md:flex-row md:gap-6 md:p-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-ink">
              {t.topic.step} {String(step.order).padStart(2, "0")}
            </span>
            {step.latency ? (
              <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-ink-muted">
                {step.latency}
              </span>
            ) : null}
          </div>
          <h3 className="mt-2.5 font-display text-[clamp(1.05rem,2.2vw,1.35rem)] font-semibold tracking-[-0.025em]">
            {step.label}
          </h3>
          <p className="mt-2 max-w-measure text-[13.5px] leading-relaxed text-ink-muted">
            {step.description}
          </p>
        </div>

        <div className="mt-4 border-t border-line pt-4 md:mt-0 md:w-[42%] md:shrink-0 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <p className="max-w-measure text-[13px] leading-relaxed text-ink-soft">
            {step.detail}
          </p>
        </div>
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute -left-1 top-10 font-mono text-[9px] text-ink-ghost"
      >
        {index + 1}
      </span>
    </motion.li>
  );
}
