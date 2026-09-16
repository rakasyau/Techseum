"use client";

import { CATEGORIES } from "@/lib/data/categories";
import { CategoryGlyph } from "@/components/glyphs";
import { Reveal } from "@/components/motion-primitives";
import { useLanguage } from "@/components/language-provider";

const STACK = [
  "Next.js",
  "React Three Fiber",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "MongoDB",
  "Three.js",
];

export function StackStrip() {
  const { t } = useLanguage();
  return (
    <section
      aria-label={t.home.builtWith}
      className="border-y border-line bg-paper-alt py-7"
    >
      <div className="mx-auto flex max-w-[1320px] flex-col gap-5 px-5 lg:flex-row lg:items-center lg:gap-12 lg:px-8">
        <span className="shrink-0 text-2xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
          {t.home.builtWith}
        </span>
        <div className="mask-fade-x relative min-w-0 flex-1 overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-10 lg:gap-14">
            {[...STACK, ...STACK].map((name, i) => (
              <span
                key={name + "-" + i}
                className="flex shrink-0 items-center gap-2.5 text-[15px] font-medium tracking-[-0.01em] text-ink-faint transition-colors duration-300 hover:text-ink"
              >
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rotate-45 rounded-[1px] border border-current"
                />
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CategoryRail() {
  const { t, locale } = useLanguage();

  // Wing blurbs are authored per language inline; keys stay stable.
  const BLURBS: Record<string, { en: string; id: string }> = {
    computing: {
      en: "The silicon that turns electricity into thought.",
      id: "Silikon yang mengubah listrik menjadi pemikiran.",
    },
    networking: {
      en: "How invisible signals find their way between machines.",
      id: "Bagaimana sinyal tak terlihat menemukan jalannya antar mesin.",
    },
    electronics: {
      en: "Circuits, sensors and the physics underneath them.",
      id: "Rangkaian, sensor, dan fisika di baliknya.",
    },
    everyday: {
      en: "The objects in your pocket and on your desk.",
      id: "Benda di kantongmu dan di atas mejamu.",
    },
    modern: {
      en: "Machine learning, the cloud, and what comes next.",
      id: "Pembelajaran mesin, cloud, dan apa yang berikutnya.",
    },
  };

  const lang = locale;

  return (
    <section className="mx-auto max-w-[1320px] px-5 pt-16 lg:px-8 lg:pt-24">
      <Reveal>
        <div>
          <h2 className="font-display text-[clamp(1.5rem,3.4vw,2rem)] font-bold tracking-[-0.035em]">
            {t.home.browse}
          </h2>
          <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-ink-muted">
            {t.home.browseLead}
          </p>
        </div>
      </Reveal>

      <div className="no-scrollbar -mx-5 mt-7 flex gap-3 overflow-x-auto px-5 pb-2 lg:mx-0 lg:px-0">
        {CATEGORIES.map((cat, i) => (
          <Reveal key={cat.id} delay={i * 0.04}>
            <a
              href={"/explore?category=" + cat.id}
              className="group flex w-[262px] shrink-0 flex-col rounded-2xl border border-line bg-paper p-5 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-lift"
            >
              <span className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-line bg-paper-alt text-ink transition-colors duration-300 group-hover:border-accent/40 group-hover:bg-accent-soft group-hover:text-accent-ink">
                  <CategoryGlyph id={cat.id} size={20} />
                </span>
                <span className="tnum font-mono text-[10px] text-ink-ghost">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <span className="mt-5 font-display text-[17px] font-semibold tracking-[-0.02em]">
                {cat.label}
              </span>
              <span className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">
                {BLURBS[cat.id]?.[lang] ?? cat.blurb}
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
