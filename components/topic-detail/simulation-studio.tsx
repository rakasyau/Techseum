"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Boxes, Grid2x2, Info, Layers } from "lucide-react";
import type { Topic } from "@/lib/types";
import { Simulation2D } from "@/components/simulations-2d/simulation-2d";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

/* three.js is only ever downloaded by someone who actually chooses the 3D
   mode, so the WebGL bundle sits behind a dynamic import and the topic page
   ships without it. */
const Simulation3D = dynamic(
  () =>
    import("@/components/simulations-3d/simulation-3d").then(
      (m) => m.Simulation3D
    ),
  { ssr: false, loading: () => <ModelSkeleton /> }
);

type Mode = "2d" | "3d";

/* The simulation switcher. 3D is lazy-mounted on first selection so the
   WebGL bundle never loads for someone who only reads the diagram — the perf
   guardrail the brief calls for. */
export function SimulationStudio({ topic }: { topic: Topic }) {
  const { t } = useLanguage();
  const [mode, setMode] = React.useState<Mode>("2d");
  const [hasMounted3D, setHasMounted3D] = React.useState(false);
  const [webglOk, setWebglOk] = React.useState(true);
  const reduce = useReducedMotion();

  React.useEffect(() => {
    if (mode === "3d") setHasMounted3D(true);
  }, [mode]);

  React.useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const ok =
        !!window.WebGLRenderingContext &&
        !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
      setWebglOk(ok);
    } catch {
      setWebglOk(false);
    }
  }, []);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-full border border-line bg-paper-alt p-0.5">
          <ModeButton
            active={mode === "2d"}
            onClick={() => setMode("2d")}
            icon={<Grid2x2 size={14} />}
          >
            {t.topic.mode2d}
          </ModeButton>
          <ModeButton
            active={mode === "3d"}
            onClick={() => setMode("3d")}
            icon={<Boxes size={14} />}
          >
            {t.topic.mode3d}
          </ModeButton>
        </div>
        <p className="text-2xs text-ink-muted">
          {mode === "2d" ? t.topic.mode2dHint : t.topic.mode3dHint}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {mode === "2d" ? (
          <motion.div
            key="2d"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            <Simulation2D config={topic.sim2d} title={topic.title} />
          </motion.div>
        ) : (
          <motion.div
            key="3d"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            {!webglOk ? (
              <FallbackNotice />
            ) : hasMounted3D ? (
              <Simulation3D config={topic.model3d} title={topic.title} />
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModelSkeleton() {
  const { t } = useLanguage();
  return (
    <div className="grid h-[380px] place-items-center rounded-2xl border border-line bg-paper-alt sm:h-[440px]">
      <div className="flex flex-col items-center gap-3">
        <Layers size={22} className="animate-pulse text-ink-faint" />
        <p className="text-2xs text-ink-muted">{t.topic.loading3d}</p>
      </div>
    </div>
  );
}

function FallbackNotice() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-paper-alt px-6 py-16 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full border border-line bg-paper text-ink-muted">
        <Info size={19} />
      </span>
      <p className="mt-4 font-display text-base font-semibold">
        {t.topic.noWebgl}
      </p>
      <p className="mt-2 max-w-[42ch] text-sm text-ink-muted">
        {t.topic.noWebglLead}
      </p>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200",
        active ? "bg-ink text-paper shadow-card" : "text-ink-muted hover:text-ink"
      )}
    >
      {icon}
      {children}
    </button>
  );
}
