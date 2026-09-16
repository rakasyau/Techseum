import { cn } from "@/lib/utils";
import type { Model3DKind } from "@/lib/types";
import { DiagramGround } from "./diagram-ground";

/* The exhibit preview. Every topic card carries one of these: a drawn
   schematic on a light technical ground with dashed measurement rules,
   annotation ticks and a faint blueprint grid. No raster assets, no
   generic gradient tiles — the diagram IS the thumbnail. */

const INK = "rgb(var(--ink))";
const MUTED = "rgb(var(--ink-faint))";
const ACCENT = "rgb(var(--accent))";
const ACCENT_SOFT = "rgb(var(--accent-soft))";

export function SchematicThumb({
  kind,
  className,
  label,
}: {
  kind: Model3DKind;
  className?: string;
  label?: boolean;
}) {
  return (
    <div className={cn("relative isolate overflow-hidden bg-paper-alt", className)}>
      <DiagramGround cell={22} opacity={0.6} />
      <svg
        viewBox="0 0 320 200"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <g
          fill="none"
          stroke={INK}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {drawing(kind)}
        </g>
        <g
          stroke={MUTED}
          strokeWidth="1"
          strokeDasharray="2 3"
          fill="none"
        >
          <line x1="18" y1="182" x2="302" y2="182" />
          <line x1="18" y1="18" x2="18" y2="182" />
        </g>
        <g fill={MUTED}>
          <circle cx="18" cy="182" r="1.6" />
          <circle cx="302" cy="182" r="1.6" />
          <circle cx="18" cy="18" r="1.6" />
        </g>
      </svg>
      {label !== false ? (
        <span className="absolute bottom-2.5 right-3.5 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-faint">
          {kind}
        </span>
      ) : null}
    </div>
  );
}

function drawing(kind: Model3DKind) {
  switch (kind) {
    case "cpu":
      return (
        <>
          <rect x="104" y="42" width="112" height="112" rx="8" />
          <rect
            x="132"
            y="70"
            width="56"
            height="56"
            rx="4"
            stroke={MUTED}
          />
          <rect
            x="146"
            y="84"
            width="28"
            height="28"
            rx="2"
            stroke={ACCENT}
            fill={ACCENT_SOFT}
          />
          <g stroke={MUTED}>
            <path d="M120 42V22M144 42V22M168 42V22M192 42V22M120 154v20M144 154v20M168 154v20M192 154v20" />
            <path d="M104 58H84M104 82H84M104 106H84M104 130H84M216 58h20M216 82h20M216 106h20M216 130h20" />
          </g>
        </>
      );
    case "gpu":
      return (
        <>
          <rect x="94" y="52" width="150" height="96" rx="8" />
          <circle cx="140" cy="100" r="27" />
          <circle cx="140" cy="100" r="10" stroke={ACCENT} />
          <g stroke={MUTED}>
            <path d="M140 73v54M113 100h54" />
          </g>
          <g stroke={MUTED} strokeDasharray="3 3">
            <path d="M186 74h40M186 92h40M186 110h24" />
          </g>
          <rect x="94" y="104" width="150" height="8" rx="2" stroke={MUTED} />
        </>
      );
    case "ram":
      return (
        <>
          <rect x="68" y="72" width="184" height="60" rx="6" />
          <g stroke={MUTED}>
            <rect x="86" y="86" width="32" height="22" rx="2" />
            <rect x="166" y="86" width="32" height="22" rx="2" />
            <rect x="206" y="86" width="26" height="22" rx="2" />
          </g>
          <rect
            x="126"
            y="86"
            width="32"
            height="22"
            rx="2"
            stroke={ACCENT}
            fill={ACCENT_SOFT}
          />
          <g stroke={MUTED}>
            <path d="M84 132v14M104 132v14M124 132v14M144 132v14M164 132v14M184 132v14M204 132v14M224 132v14" />
          </g>
        </>
      );
    case "ssd":
      return (
        <>
          <rect x="72" y="76" width="176" height="52" rx="6" />
          <rect
            x="90"
            y="88"
            width="34"
            height="28"
            rx="2"
            stroke={ACCENT}
            fill={ACCENT_SOFT}
          />
          <g stroke={MUTED}>
            <rect x="136" y="88" width="24" height="12" rx="1.5" />
            <rect x="136" y="104" width="24" height="12" rx="1.5" />
            <rect x="170" y="88" width="24" height="12" rx="1.5" />
            <rect x="170" y="104" width="24" height="12" rx="1.5" />
            <path d="M210 88v28" />
          </g>
          <circle cx="86" cy="102" r="2.4" fill={MUTED} stroke="none" />
        </>
      );
    case "camera":
      return (
        <>
          <rect x="76" y="66" width="168" height="72" rx="10" />
          <circle cx="160" cy="102" r="30" />
          <circle cx="160" cy="102" r="17" stroke={MUTED} />
          <circle cx="160" cy="102" r="7" stroke={ACCENT} fill={ACCENT_SOFT} />
          <path d="M112 66l9-13h30l9 13" stroke={MUTED} />
          <circle cx="214" cy="82" r="3" fill={MUTED} stroke="none" />
        </>
      );
    case "router":
      return (
        <>
          <rect x="76" y="106" width="168" height="44" rx="8" />
          <g stroke={MUTED}>
            <circle cx="98" cy="128" r="3" />
            <circle cx="116" cy="128" r="3" />
            <circle cx="134" cy="128" r="3" />
          </g>
          <g stroke={ACCENT}>
            <path d="M130 96l30-30 30 30" />
            <path d="M160 66V46" />
          </g>
          <g stroke={MUTED} strokeDasharray="2 3">
            <path d="M118 40a56 56 0 0 1 84 0" />
            <path d="M132 56a36 36 0 0 1 56 0" />
          </g>
        </>
      );
    case "battery":
      return (
        <>
          <rect x="58" y="76" width="180" height="56" rx="10" />
          <path d="M242 92v24" strokeWidth="2.6" />
          <g stroke={MUTED}>
            <path d="M88 88v32M112 88v32M136 88v32M160 88v32" />
          </g>
          <rect
            x="184"
            y="88"
            width="40"
            height="32"
            rx="4"
            stroke={ACCENT}
            fill={ACCENT_SOFT}
          />
          <path
            d="M204 96l-12 14h10l-4 12 14-16h-10z"
            fill={ACCENT}
            stroke="none"
          />
        </>
      );
    case "phone":
      return (
        <>
          <rect x="122" y="26" width="76" height="148" rx="12" />
          <rect
            x="130"
            y="40"
            width="60"
            height="110"
            rx="4"
            stroke={ACCENT}
            fill={ACCENT_SOFT}
          />
          <path d="M150 31h20" stroke={MUTED} />
          <circle cx="160" cy="160" r="4" stroke={MUTED} />
        </>
      );
    case "module":
      return (
        <>
          <rect x="100" y="50" width="120" height="100" rx="8" />
          <rect
            x="138"
            y="88"
            width="44"
            height="44"
            rx="4"
            stroke={ACCENT}
            fill={ACCENT_SOFT}
          />
          <g stroke={MUTED}>
            <path d="M124 50v-22M160 50v-22M196 50v-22M124 150v22M160 150v22M196 150v22" />
            <path d="M100 70H78M100 100H78M100 130H78M220 70h22M220 100h22M220 130h22" />
          </g>
        </>
      );
    case "cloud":
      return (
        <>
          <path d="M104 132h112a30 30 0 0 0 3-60 46 46 0 0 0-88-11 34 34 0 0 0-27 71z" />
          <g stroke={ACCENT}>
            <path d="M132 108h56M132 96h40" />
          </g>
          <g stroke={MUTED} strokeDasharray="3 4">
            <path d="M120 152v14M160 152v20M200 152v14" />
          </g>
        </>
      );
    default:
      return <rect x="100" y="60" width="120" height="80" rx="8" />;
  }
}
