"use client";

import * as React from "react";
import { FlaskConical } from "lucide-react";
import { LABS } from "@/lib/data/community";
import { ElectronicsBench } from "@/components/lab/electronics-bench";
import { NetworkBench } from "@/components/lab/network-bench";
import { CameraBench } from "@/components/lab/camera-bench";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

function labCopy(
  slug: string,
  t: ReturnType<typeof useLanguage>["t"]
): { title: string; tagline: string } | null {
  switch (slug) {
    case "electronics":
      return { title: t.labs.electronicsTitle, tagline: t.labs.electronicsTagline };
    case "network":
      return { title: t.labs.networkTitle, tagline: t.labs.networkTagline };
    case "camera":
      return { title: t.labs.cameraTitle, tagline: t.labs.cameraTagline };
    default:
      return null;
  }
}

export function LabWorkbench() {
  const { t } = useLanguage();
  const [active, setActive] = React.useState(LABS[0].slug);
  const lab = LABS.find((l) => l.slug === active) ?? LABS[0];

  return (
    <div>
      <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1 lg:mx-0 lg:px-0">
        {LABS.map((l) => {
          const isActive = l.slug === active;
          const copy = labCopy(l.slug, t);
          return (
            <button
              key={l.slug}
              type="button"
              onClick={() => setActive(l.slug)}
              aria-pressed={isActive}
              className={cn(
                "group shrink-0 rounded-2xl border p-4 text-left transition-all duration-300",
                isActive
                  ? "border-ink bg-ink text-paper shadow-card"
                  : "border-line bg-paper hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card"
              )}
            >
              <span className="flex items-center gap-2">
                <FlaskConical
                  size={14}
                  className={isActive ? "text-paper/70" : "text-accent"}
                />
                <span
                  className={cn(
                    "font-mono text-[9px] uppercase tracking-[0.18em]",
                    isActive ? "text-paper/60" : "text-ink-muted"
                  )}
                >
                  {copy?.tagline ?? l.tagline}
                </span>
              </span>
              <span className="mt-2 block font-display text-[15px] font-semibold tracking-[-0.02em]">
                {copy?.title ?? l.title}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-6 max-w-[70ch] text-[14px] leading-relaxed text-ink-muted">
        {lab.description}
      </p>

      <div className="mt-8">
        {lab.kind === "electronics" ? <ElectronicsBench /> : null}
        {lab.kind === "network" ? <NetworkBench /> : null}
        {lab.kind === "camera" ? <CameraBench /> : null}
      </div>
    </div>
  );
}
