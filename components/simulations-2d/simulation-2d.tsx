"use client";

import * as React from "react";
import {
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  Info,
  X,
} from "lucide-react";
import type { Simulation2DConfig } from "@/lib/types";
import { useReducedMotion } from "framer-motion";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

/* A generic stepped-diagram engine. The config supplies nodes, edges and an
   ordered list of steps; the engine owns playback, speed, manual stepping and
   hotspot selection. Every diagram in the museum runs on this one machine. */

const TONES = {
  default: {
    fill: "rgb(var(--paper))",
    stroke: "rgb(var(--line-strong))",
    text: "rgb(var(--ink))",
    sub: "rgb(var(--ink-muted))",
  },
  accent: {
    fill: "rgb(var(--accent-soft))",
    stroke: "rgb(var(--accent))",
    text: "rgb(var(--accent-ink))",
    sub: "rgb(var(--accent))",
  },
  signal: {
    fill: "rgb(var(--signal-soft))",
    stroke: "rgb(var(--signal))",
    text: "rgb(var(--ink))",
    sub: "rgb(var(--signal))",
  },
  muted: {
    fill: "rgb(var(--paper-sink))",
    stroke: "rgb(var(--line))",
    text: "rgb(var(--ink-muted))",
    sub: "rgb(var(--ink-faint))",
  },
} as const;

export function Simulation2D({
  config,
  title,
}: {
  config: Simulation2DConfig;
  title: string;
}) {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const [step, setStep] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [speed, setSpeed] = React.useState(1);
  const [selected, setSelected] = React.useState<string | null>(null);

  const steps = config.steps;
  const current = steps[step];

  React.useEffect(() => {
    if (!playing) return;
    if (reduce) {
      setPlaying(false);
      return;
    }
    const dwell = 3600 / speed;
    const id = window.setTimeout(() => {
      setStep((s) => {
        if (s >= steps.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, dwell);
    return () => window.clearTimeout(id);
  }, [playing, step, speed, steps.length, reduce]);

  const nodeById = React.useMemo(
    () => Object.fromEntries(config.nodes.map((n) => [n.id, n])),
    [config.nodes]
  );

  const selectedNode = selected ? nodeById[selected] : null;

  const activeSet = React.useMemo(
    () => new Set(current?.active ?? []),
    [current]
  );

  const [, , vw, vh] = config.viewBox;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper">
      {/* control bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line bg-paper-alt px-3 py-2.5">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? t.topic.pause : t.topic.play}
          className="grid h-9 w-9 place-items-center rounded-full bg-ink text-paper transition-colors hover:bg-ink-soft"
        >
          {playing ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false);
            setStep(0);
          }}
          aria-label={t.topic.restart}
          className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink hover:text-ink"
        >
          <RotateCcw size={15} />
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false);
            setStep((s) => Math.min(s + 1, steps.length - 1));
          }}
          disabled={step >= steps.length - 1}
          aria-label={t.topic.nextStep}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-[13px] font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink disabled:opacity-40"
        >
          <SkipForward size={14} />
          {t.topic.nextStep}
        </button>

        <div className="ml-auto flex items-center gap-1 rounded-full border border-line p-0.5">
          {[1, 2, 4].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              aria-label={`Set speed to ${s}x`}
              aria-pressed={speed === s}
              className={cn(
                "tnum h-7 rounded-full px-2.5 text-2xs font-semibold transition-colors",
                speed === s
                  ? "bg-ink text-paper"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      {/* stage */}
      <div className="relative">
        <div className="no-scrollbar overflow-x-auto">
          <svg
            viewBox={config.viewBox.join(" ")}
            className="block w-full min-w-[560px]"
            role="img"
            aria-label={`${title} ${t.topic.mode2d}, ${t.topic.step} ${
              step + 1
            } ${t.topic.of} ${steps.length}: ${current?.title}`}
          >
          <defs>
            <marker
              id="sim-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0 0L10 5L0 10z" fill="rgb(var(--ink-faint))" />
            </marker>
            <marker
              id="sim-arrow-accent"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0 0L10 5L0 10z" fill="rgb(var(--accent))" />
            </marker>
          </defs>

          {/* faint grid ground */}
          <g opacity="0.45">
            <defs>
              <pattern
                id="sim-grid"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M32 0H0V32"
                  fill="none"
                  stroke="rgb(var(--line))"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width={vw} height={vh} fill="url(#sim-grid)" />
          </g>

          {/* edges */}
          <g>
            {config.edges.map((edge, i) => {
              const a = nodeById[edge.from];
              const b = nodeById[edge.to];
              if (!a || !b) return null;
              const active =
                activeSet.has(edge.from) && activeSet.has(edge.to);
              const tone =
                edge.tone === "accent" || (active && !edge.tone)
                  ? "rgb(var(--accent))"
                  : edge.tone === "signal"
                    ? "rgb(var(--signal))"
                    : "rgb(var(--line-strong))";

              const path = edgePath(a, b, edge.bend);
              const midpoint = pathMidpoint(a, b, edge.bend);

              return (
                <g key={`${edge.from}-${edge.to}-${i}`}>
                  <path
                    d={path}
                    fill="none"
                    stroke={tone}
                    strokeWidth={active ? 2 : 1.35}
                    strokeDasharray={
                      edge.dashed || !active ? "5 5" : undefined
                    }
                    markerEnd={
                      active
                        ? "url(#sim-arrow-accent)"
                        : "url(#sim-arrow)"
                    }
                    className={cn(
                      "transition-all duration-500",
                      edge.dashed && "animate-dash"
                    )}
                    opacity={active ? 1 : 0.6}
                  />
                  {edge.label ? (
                    <g transform={`translate(${midpoint.x}, ${midpoint.y})`}>
                      <rect
                        x={-(edge.label.length * 3.4 + 6)}
                        y="-9"
                        width={edge.label.length * 6.8 + 12}
                        height="18"
                        rx="9"
                        fill="rgb(var(--paper))"
                        stroke="rgb(var(--line))"
                        strokeWidth="1"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="middle"
                        y="0"
                        fontSize="10.5"
                        fill={active ? tone : "rgb(var(--ink-faint))"}
                        fontWeight={active ? 600 : 500}
                      >
                        {edge.label}
                      </text>
                    </g>
                  ) : null}
                </g>
              );
            })}
          </g>

          {/* flow pulses for the current step */}
          {(current?.pulses ?? []).map((p, i) => {
            const a = nodeById[p.from];
            const b = nodeById[p.to];
            if (!a || !b) return null;
            return (
              <circle key={i} r="4.5" fill="rgb(var(--accent))" opacity="0.9">
                <animateMotion
                  dur={`${1.5 / speed}s`}
                  repeatCount="indefinite"
                  path={edgePath(a, b, undefined, 8)}
                />
              </circle>
            );
          })}

          {/* nodes */}
          {config.nodes.map((node) => {
            const active = activeSet.has(node.id);
            const isSel = selected === node.id;
            const tone = TONES[node.tone ?? "default"];
            const isCircle = node.shape === "circle";
            const isPill = node.shape === "pill";

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelected(isSel ? null : node.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(isSel ? null : node.id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`${node.label}. ${node.desc}`}
                className="cursor-pointer outline-none"
              >
                <rect
                  x="0"
                  y="0"
                  width={node.w}
                  height={node.h}
                  rx={isCircle ? node.w / 2 : isPill ? node.h / 2 : 14}
                  fill={tone.fill}
                  stroke={isSel ? "rgb(var(--accent))" : tone.stroke}
                  strokeWidth={isSel ? 2.2 : active ? 1.9 : 1.3}
                  className="transition-all duration-400"
                />
                {active ? (
                  <rect
                    x="-4"
                    y="-4"
                    width={node.w + 8}
                    height={node.h + 8}
                    rx={isCircle ? (node.w + 8) / 2 : isPill ? (node.h + 8) / 2 : 18}
                    fill="none"
                    stroke="rgb(var(--accent))"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.85"
                    className="animate-dash"
                  />
                ) : null}

                <text
                  x={node.w / 2}
                  y={node.sub ? node.h / 2 - 4 : node.h / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="13.5"
                  fontWeight="600"
                  fill={tone.text}
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {node.label}
                </text>
                {node.sub ? (
                  <text
                    x={node.w / 2}
                    y={node.h / 2 + 15}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10.5"
                    fill={tone.sub}
                    fontWeight="500"
                  >
                    {node.sub}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
        </div>

        {/* step readout */}
        <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5">
          <span className="pointer-events-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-line bg-paper/95 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted backdrop-blur-sm">
            {t.topic.step} {step + 1}/{steps.length}
          </span>
          {current?.value ? (
            <span className="pointer-events-auto w-fit rounded-full border border-accent/25 bg-accent-soft px-2.5 py-1 font-mono text-[10px] text-accent-ink">
              {current.value}
            </span>
          ) : null}
        </div>
      </div>

      {/* narration + hotspots */}
      <div className="grid gap-0 border-t border-line md:grid-cols-[1.6fr_1fr]">
        <div className="p-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-[11px] font-semibold text-white">
              {step + 1}
            </span>
            <h4 className="font-display text-[15px] font-semibold tracking-[-0.02em]">
              {current?.title}
            </h4>
          </div>
          <p className="mt-3 max-w-[62ch] text-[13.5px] leading-relaxed text-ink-soft">
            {current?.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {steps.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setPlaying(false);
                  setStep(i);
                }}
                aria-label={`${t.topic.step} ${i + 1}: ${s.short}`}
                aria-current={i === step}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-2xs font-medium transition-colors",
                  i === step
                    ? "border-ink bg-ink text-paper"
                    : i < step
                      ? "border-accent/30 bg-accent-soft text-accent-ink"
                      : "border-line text-ink-muted hover:border-line-strong hover:text-ink"
                )}
              >
                {s.short}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-line bg-paper-alt p-5 md:border-l md:border-t-0">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              <Info size={12} />
              {t.topic.partInspector}
            </span>
            {selectedNode ? (
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label={t.common.close}
                className="text-ink-faint transition-colors hover:text-ink"
              >
                <X size={14} />
              </button>
            ) : null}
          </div>

          {selectedNode ? (
            <div className="mt-3">
              <p className="font-display text-sm font-semibold tracking-[-0.01em]">
                {selectedNode.label}
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-muted">
                {selectedNode.desc}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-[12.5px] leading-relaxed text-ink-muted">
              {t.topic.inspectorHint}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function edgePath(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
  bend?: "h" | "v",
  inset = 0
): string {
  const ac = { x: a.x + a.w / 2, y: a.y + a.h / 2 };
  const bc = { x: b.x + b.w / 2, y: b.y + b.h / 2 };

  const dx = bc.x - ac.x;
  const dy = bc.y - ac.y;

  // Anchor on the facing sides so the line reads as a signal path.
  let p1: { x: number; y: number };
  let p2: { x: number; y: number };

  if (Math.abs(dx) >= Math.abs(dy)) {
    p1 = { x: ac.x + (dx > 0 ? a.w / 2 : -a.w / 2), y: ac.y };
    p2 = { x: bc.x + (dx > 0 ? -b.w / 2 : b.w / 2), y: bc.y };
  } else {
    p1 = { x: ac.x, y: ac.y + (dy > 0 ? a.h / 2 : -a.h / 2) };
    p2 = { x: bc.x, y: bc.y + (dy > 0 ? -b.h / 2 : b.h / 2) };
  }

  if (inset) {
    const len = Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1;
    p1 = {
      x: p1.x + ((p2.x - p1.x) / len) * inset,
      y: p1.y + ((p2.y - p1.y) / len) * inset,
    };
  }

  if (bend === "h") {
    const mx = (p1.x + p2.x) / 2;
    return `M${p1.x},${p1.y} L${mx},${p1.y} L${mx},${p2.y} L${p2.x},${p2.y}`;
  }
  if (bend === "v") {
    const my = (p1.y + p2.y) / 2;
    return `M${p1.x},${p1.y} L${p1.x},${my} L${p2.x},${my} L${p2.x},${p2.y}`;
  }
  return `M${p1.x},${p1.y} L${p2.x},${p2.y}`;
}

function pathMidpoint(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
  bend?: "h" | "v"
) {
  return {
    x: a.x + a.w / 2 + (b.x + b.w / 2 - (a.x + a.w / 2)) / 2,
    y: a.y + a.h / 2 + (b.y + b.h / 2 - (a.y + a.h / 2)) / 2,
  };
}
