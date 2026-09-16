"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* Scroll reveal. Defaults to a short, exponential ease-out rise and only runs
   once per element. Motion is removed entirely under reduced-motion. */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    const Plain = as as "div";
    return <Plain className={className}>{children}</Plain>;
  }

  const Comp = motion[as] as typeof motion.div;

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Comp>
  );
}

/* Staggered group used for grids and lists. */
export function RevealGroup({
  children,
  className,
  stagger = 0.06,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-70px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/* The dashed orbit + sparkle marks that recur around hero elements, taken
   straight from the brief's reference. Purely decorative. */
export function OrbitMarks({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "accent" | "signal";
}) {
  const colors = {
    ink: "rgb(var(--line-dash))",
    accent: "rgb(var(--accent) / 0.55)",
    signal: "rgb(var(--signal) / 0.55)",
  } as const;

  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("pointer-events-none absolute", className)}
      aria-hidden
    >
      <circle
        cx="100"
        cy="100"
        r="88"
        fill="none"
        stroke={colors[tone]}
        strokeWidth="1.1"
        strokeDasharray="4 7"
      />
      <path
        d="M100 12 l3.4 8.6 8.6 3.4 -8.6 3.4 -3.4 8.6 -3.4 -8.6 -8.6 -3.4 8.6 -3.4z"
        fill={colors[tone]}
      />
    </svg>
  );
}

export function Sparkle({
  size = 16,
  className,
  tone = "accent",
}: {
  size?: number;
  className?: string;
  tone?: "accent" | "signal" | "ink" | "warn";
}) {
  const colors = {
    accent: "rgb(var(--accent))",
    signal: "rgb(var(--signal))",
    ink: "rgb(var(--ink-ghost))",
    warn: "rgb(var(--warn))",
  } as const;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("pointer-events-none", className)}
      aria-hidden
    >
      <path
        d="M12 2.5l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"
        fill={colors[tone]}
      />
    </svg>
  );
}

/* A dashed connector rule used between sections and inside diagrams. */
export function DashRule({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-px w-full", className)}
      preserveAspectRatio="none"
      viewBox="0 0 100 1"
      aria-hidden
    >
      <line
        x1="0"
        y1="0.5"
        x2="100"
        y2="0.5"
        stroke="rgb(var(--line-dash))"
        strokeWidth="1"
        strokeDasharray="3 4"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
