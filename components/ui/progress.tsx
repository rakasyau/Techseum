"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  tone = "accent",
  label,
}: {
  value: number;
  className?: string;
  tone?: "accent" | "signal" | "success" | "ink";
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const tones = {
    accent: "bg-accent",
    signal: "bg-signal",
    success: "bg-success",
    ink: "bg-ink",
  } as const;

  return (
    <div
      className={cn("flex items-center gap-3", className)}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-sink">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-700 ease-out",
            tones[tone]
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {label ? (
        <span className="tnum shrink-0 text-xs text-ink-muted">{label}</span>
      ) : null}
    </div>
  );
}

export function Ring({
  value,
  size = 64,
  stroke = 5,
  tone = "accent",
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  tone?: "accent" | "signal" | "success";
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const colors = {
    accent: "rgb(var(--accent))",
    signal: "rgb(var(--signal))",
    success: "rgb(var(--success))",
  } as const;

  return (
    <div
      className="relative inline-grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgb(var(--line))"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={colors[tone]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (clamped / 100) * c}
          style={{
            transition: "stroke-dashoffset 0.9s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}
