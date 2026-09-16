"use client";

import Link from "next/link";
import { ArrowRight, MousePointerClick, Move3d, Puzzle, Layers } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import { useLanguage } from "@/components/language-provider";

export function MethodSection() {
  const { t } = useLanguage();

  const STEPS = [
    { icon: Layers, title: t.method.step1Title, body: t.method.step1Body },
    { icon: Move3d, title: t.method.step2Title, body: t.method.step2Body },
    {
      icon: MousePointerClick,
      title: t.method.step3Title,
      body: t.method.step3Body,
    },
    { icon: Puzzle, title: t.method.step4Title, body: t.method.step4Body },
  ];

  return (
    <section className="border-y border-line bg-paper-alt">
      <div className="mx-auto max-w-[1320px] px-5 py-16 lg:px-8 lg:py-24">
        <Reveal className="max-w-[64ch]">
          <h2 className="font-display text-[clamp(1.6rem,3.8vw,2.4rem)] font-bold leading-tight tracking-[-0.038em] text-balance">
            {t.home.methodTitle}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
            {t.home.methodLead}
          </p>
        </Reveal>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.06} className="bg-paper">
              <div className="flex h-full flex-col p-6 lg:p-7">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-paper-alt text-accent">
                    <s.icon size={20} />
                  </span>
                  <span className="tnum font-mono text-[10px] tracking-[0.18em] text-ink-ghost">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-[17px] font-semibold tracking-[-0.02em]">
                  {s.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-10" delay={0.1}>
          <Link
            href="/explore/cpu"
            className="group inline-flex items-center gap-2 font-display text-[15px] font-semibold tracking-[-0.01em] text-ink"
          >
            {t.method.cta}
            <span className="grid h-7 w-7 place-items-center rounded-full border border-line-strong transition-all duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
              <ArrowRight size={13} />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
