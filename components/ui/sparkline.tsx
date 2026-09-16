"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* A measured sparkline. Data is real per-user activity, drawn as a thin rule
   with a filled area — the same stroke family as the diagrams. */
export function Sparkline({
  data,
  width = 84,
  height = 26,
  tone = "accent",
  className,
  showEnd = true,
}: {
  data: number[];
  width?: number;
  height?: number;
  tone?: "accent" | "signal" | "success" | "danger" | "ink";
  className?: string;
  showEnd?: boolean;
}) {
  const colors = {
    accent: "rgb(var(--accent))",
    signal: "rgb(var(--signal))",
    success: "rgb(var(--success))",
    danger: "rgb(var(--danger))",
    ink: "rgb(var(--ink-muted))",
  } as const;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pad = 3;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - pad * 2) + pad;
    const y = height - pad - ((d - min) / span) * (height - pad * 2);
    return [x, y] as const;
  });

  const line = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${(width - pad).toFixed(1)},${height - pad} L${pad},${height - pad} Z`;
  const last = points[points.length - 1];
  const id = React.useId();

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors[tone]} stopOpacity="0.22" />
          <stop offset="100%" stopColor={colors[tone]} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${id})`} />
      <path
        d={line}
        fill="none"
        stroke={colors[tone]}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showEnd ? (
        <circle cx={last[0]} cy={last[1]} r="2.2" fill={colors[tone]} />
      ) : null}
    </svg>
  );
}

/* A horizontal bar strip used for distribution-style stats. */
export function BarStrip({
  data,
  tone = "accent",
  className,
}: {
  data: number[];
  tone?: "accent" | "signal" | "success";
  className?: string;
}) {
  const max = Math.max(...data) || 1;
  const tones = {
    accent: "bg-accent",
    signal: "bg-signal",
    success: "bg-success",
  } as const;

  return (
    <div className={cn("flex h-6 items-end gap-[3px]", className)} aria-hidden>
      {data.map((d, i) => (
        <span
          key={i}
          className={cn("w-1 rounded-sm", tones[tone])}
          style={{
            height: `${Math.max(12, (d / max) * 100)}%`,
            opacity: 0.35 + (i / data.length) * 0.65,
          }}
        />
      ))}
    </div>
  );
}
