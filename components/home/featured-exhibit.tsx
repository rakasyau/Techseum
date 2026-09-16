"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { Clock, GitBranch, Layers } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";
import { TopicCard } from "@/components/topic-card";
import { getTopic } from "@/lib/data/topics";
import { cn } from "@/lib/utils";

/* A featured exhibit is art-directed rather than left as a grid cell: one
   schematic, its anatomy measured out, and a live step preview running
   underneath. The diagram is the hero, not a decorative illustration. */
export function FeaturedExhibit({
  slug,
  flip = false,
  index,
}: {
  slug: string;
  flip?: boolean;
  index: number;
}) {
  const topic = getTopic(slug);
  const reduce = useReducedMotion();
  const [step, setStep] = React.useState(0);

  const stepCount = topic?.sim2d.steps.length ?? 4;

  React.useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setStep((s) => (s + 1) % stepCount),
      3200
    );
    return () => window.clearInterval(id);
  }, [reduce, stepCount]);

  if (!topic) return null;

  const current = topic.sim2d.steps[step];
  const activeNodes = new Set(current?.active ?? []);

  return (
    <Reveal className="grid items-center gap-8 rounded-3xl border border-line bg-paper p-4 shadow-card sm:p-6 lg:grid-cols-2 lg:gap-12 lg:p-8">
      <div className={cn("order-1", flip && "lg:order-2")}>
        <div className="relative overflow-hidden rounded-2xl border border-line bg-paper-alt">
          <div
            aria-hidden
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "linear-gradient(rgb(var(--line)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--line)) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />

          <svg viewBox="0 0 520 300" className="relative block w-full" aria-hidden>
            {/* the exhibit's own node graph, reduced to a hero view */}
            <g transform="translate(30, 96)">
              <rect
                width="112"
                height="104"
                rx="14"
                fill="rgb(var(--paper))"
                stroke={
                  activeNodes.size
                    ? "rgb(var(--accent))"
                    : "rgb(var(--line-strong))"
                }
                strokeWidth="1.6"
              />
              <rect
                x="26"
                y="26"
                width="60"
                height="52"
                rx="8"
                fill="rgb(var(--accent-soft))"
                stroke="rgb(var(--accent))"
                strokeWidth="1.4"
              />
            </g>

            <path
              d="M142 148 H236"
              fill="none"
              stroke="rgb(var(--accent))"
              strokeWidth="1.6"
              strokeDasharray="5 5"
              className="animate-dash"
            />
            <circle r="4.5" fill="rgb(var(--accent))">
              <animateMotion dur="2.4s" repeatCount="indefinite" path="M142 148 H236" />
            </circle>

            <g transform="translate(238, 108)">
              <rect
                width="122"
                height="80"
                rx="14"
                fill="rgb(var(--accent-soft))"
                stroke="rgb(var(--accent))"
                strokeWidth="1.6"
              />
              <text
                x="61"
                y="34"
                textAnchor="middle"
                fontSize="14"
                fontWeight="600"
                fill="rgb(var(--accent-ink))"
              >
                {current?.short}
              </text>
              <text
                x="61"
                y="54"
                textAnchor="middle"
                fontSize="9.5"
                fontFamily="ui-monospace, monospace"
                fill="rgb(var(--accent))"
              >
                {current?.value}
              </text>
            </g>

            <path
              d="M360 148 H424"
              fill="none"
              stroke="rgb(var(--signal))"
              strokeWidth="1.6"
              strokeDasharray="5 5"
              className="animate-dash"
            />
            <circle r="4.5" fill="rgb(var(--signal))">
              <animateMotion dur="2.4s" repeatCount="indefinite" path="M360 148 H424" />
            </circle>

            <g stroke="rgb(var(--ink-faint))" strokeWidth="1" fill="none">
              <line x1="30" y1="230" x2="490" y2="230" strokeDasharray="3 5" />
              <line x1="30" y1="230" x2="30" y2="72" strokeDasharray="3 5" />
            </g>

            {/* step rail */}
            <g transform="translate(30, 252)">
              {topic.sim2d.steps.map((s: { id: string }, i: number) => (
                <g key={s.id} transform={`translate(${i * 26}, 0)`}>
                  <circle
                    cx="4"
                    cy="4"
                    r="4"
                    fill={
                      i === step
                        ? "rgb(var(--accent))"
                        : i < step
                          ? "rgb(var(--accent) / 0.4)"
                          : "rgb(var(--ink-ghost))"
                    }
                  />
                  {i < topic.sim2d.steps.length - 1 ? (
                    <line
                      x1="10"
                      y1="4"
                      x2="24"
                      y2="4"
                      stroke="rgb(var(--ink-ghost))"
                      strokeWidth="1"
                    />
                  ) : null}
                </g>
              ))}
              <text x="120" y="8" fontSize="10" fill="rgb(var(--ink-muted))">
                {step + 1} / {topic.sim2d.steps.length}
              </text>
            </g>
          </svg>
        </div>
      </div>

      <div className={cn("order-2", flip && "lg:order-1")}>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-ink">
          Featured exhibit {String(index).padStart(2, "0")}
        </span>
        <h3 className="mt-4 font-display text-[clamp(1.5rem,3.4vw,2.2rem)] font-bold leading-[1.08] tracking-[-0.038em] text-balance">
          {topic.title}
        </h3>
        <p className="mt-3.5 max-w-[48ch] text-[15px] leading-relaxed text-ink-muted text-pretty">
          {topic.summary}
        </p>

        <dl className="mt-7 flex flex-wrap gap-x-9 gap-y-4">
          <div className="flex items-center gap-2.5">
            <Layers size={16} className="text-ink-faint" aria-hidden />
            <div>
              <dt className="text-2xs text-ink-muted">Depth levels</dt>
              <dd className="tnum text-sm font-semibold">{topic.levels.length}</dd>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock size={16} className="text-ink-faint" aria-hidden />
            <div>
              <dt className="text-2xs text-ink-muted">Quickest read</dt>
              <dd className="tnum text-sm font-semibold">
                {topic.levels[0].minutes} min
              </dd>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <GitBranch size={16} className="text-ink-faint" aria-hidden />
            <div>
              <dt className="text-2xs text-ink-muted">Simulation steps</dt>
              <dd className="tnum text-sm font-semibold">
                {topic.sim2d.steps.length}
              </dd>
            </div>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <a href={`/explore/${topic.slug}`}>Open exhibit</a>
          </Button>
          <Button asChild variant="outline">
            <a href={`/explore/${topic.slug}#challenge`}>Take the challenge</a>
          </Button>
        </div>
      </div>
    </Reveal>
  );
}

export function FeaturedRail({ slugs }: { slugs: string[] }) {
  const [first, second, ...rest] = slugs;
  return (
    <div className="space-y-6">
      <FeaturedExhibit slug={first} index={1} />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <FeaturedExhibit slug={second} index={2} flip />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {rest.slice(0, 3).map((slug) => {
            const t = getTopic(slug);
            if (!t) return null;
            return <TopicCard key={slug} topic={t} />;
          })}
        </div>
      </div>
    </div>
  );
}
