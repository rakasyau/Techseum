import * as React from "react";
import { cn } from "@/lib/utils";

type GlyphProps = React.SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 24, className, ...props }: GlyphProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: cn("shrink-0", className),
    "aria-hidden": true,
    ...props,
  };
}

/* ---------- category glyphs: drawn, technical, one stroke family ---------- */

export function GlyphCpu(p: GlyphProps) {
  return (
    <svg {...base(p)}>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <rect x="10.5" y="10.5" width="3" height="3" rx="0.5" />
      <path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3" />
    </svg>
  );
}

export function GlyphRadio(p: GlyphProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="15" r="1.6" />
      <path d="M8.5 11.5a5 5 0 0 0 0 7M15.5 11.5a5 5 0 0 1 0 7" />
      <path d="M5.5 8.5a9 9 0 0 0 0 13M18.5 8.5a9 9 0 0 1 0 13" />
      <path d="M12 15V3" />
    </svg>
  );
}

export function GlyphCircuit(p: GlyphProps) {
  return (
    <svg {...base(p)}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 9h4M16 15h4M9 4v4M15 16v4" />
      <circle cx="9" cy="9" r="1.4" />
      <circle cx="15" cy="15" r="1.4" />
      <path d="M9 10.4V15h4.6" />
    </svg>
  );
}

export function GlyphPhone(p: GlyphProps) {
  return (
    <svg {...base(p)}>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M10.5 5h3" />
      <circle cx="12" cy="18.3" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function GlyphSparkles(p: GlyphProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 3.5l1.6 4.4L18 9.5l-4.4 1.6L12 15.5l-1.6-4.4L6 9.5l4.4-1.6z" />
      <path d="M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
    </svg>
  );
}

/* ---------- model glyphs used by topic thumbnails ---------- */

export function GlyphRam(p: GlyphProps) {
  return (
    <svg {...base(p)}>
      <rect x="2.5" y="7" width="19" height="10" rx="1.5" />
      <path d="M6 7v3M9.5 7v3M13 7v3M16.5 7v3M20 7v3" />
      <path d="M6 17v2.5M12 17v2.5M18 17v2.5" />
    </svg>
  );
}

export function GlyphSsd(p: GlyphProps) {
  return (
    <svg {...base(p)}>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <rect x="5.5" y="9" width="5" height="6" rx="0.8" />
      <rect x="12.5" y="9" width="3" height="2.6" rx="0.4" />
      <rect x="12.5" y="12.4" width="3" height="2.6" rx="0.4" />
      <path d="M18 9v6" />
    </svg>
  );
}

export function GlyphGpu(p: GlyphProps) {
  return (
    <svg {...base(p)}>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="9" cy="12" r="3.2" />
      <path d="M9 9.4v5.2M6.4 12h5.2" />
      <path d="M15 9.5h4M15 12h4M15 14.5h2.5" />
      <path d="M5 18v2.5M19 18v2.5" />
    </svg>
  );
}

export function GlyphCamera(p: GlyphProps) {
  return (
    <svg {...base(p)}>
      <rect x="2.5" y="7" width="19" height="12" rx="2.5" />
      <circle cx="12" cy="13" r="3.6" />
      <circle cx="12" cy="13" r="1.3" />
      <path d="M8 7l1.4-2.2h5.2L16 7" />
      <path d="M18.5 10h.01" />
    </svg>
  );
}

export function GlyphRouter(p: GlyphProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="13" width="18" height="7" rx="2" />
      <path d="M7 16.5h2M11 16.5h2M15 16.5h2" />
      <path d="M8.5 9.5l3-3 3 3" />
      <path d="M12 6.5V3.5" />
    </svg>
  );
}

export function GlyphBattery(p: GlyphProps) {
  return (
    <svg {...base(p)}>
      <rect x="2.5" y="7" width="16" height="10" rx="2.5" />
      <path d="M21 10.5v3" />
      <path d="M6 10v4M9 10v4M12 10v4" />
    </svg>
  );
}

export function GlyphModule(p: GlyphProps) {
  return (
    <svg {...base(p)}>
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="0.8" />
      <path d="M9 5V2.5M15 5V2.5M9 21.5V19M15 21.5V19M5 9H2.5M5 15H2.5M21.5 9H19M21.5 15H19" />
    </svg>
  );
}

export function GlyphCloud(p: GlyphProps) {
  return (
    <svg {...base(p)}>
      <path d="M7 18.5h10.2a3.3 3.3 0 0 0 .3-6.6 5.2 5.2 0 0 0-9.9-1.3A3.8 3.8 0 0 0 7 18.5z" />
      <path d="M9 21.5h6" />
    </svg>
  );
}

export function GlyphCache(p: GlyphProps) {
  return (
    <svg {...base(p)}>
      <rect x="8" y="15" width="8" height="4" rx="1" />
      <rect x="6.5" y="10.5" width="11" height="4.5" rx="1" />
      <rect x="5" y="6" width="14" height="4.5" rx="1" />
      <rect x="3.5" y="1.5" width="17" height="4.5" rx="1" />
    </svg>
  );
}

export const GLYPH_MAP = {
  cpu: GlyphCpu,
  gpu: GlyphGpu,
  ram: GlyphRam,
  ssd: GlyphSsd,
  cache: GlyphCache,
  camera: GlyphCamera,
  router: GlyphRouter,
  battery: GlyphBattery,
  phone: GlyphPhone,
  module: GlyphModule,
  cloud: GlyphCloud,
} as const;

export function ModelGlyph({
  kind,
  ...rest
}: GlyphProps & { kind: keyof typeof GLYPH_MAP }) {
  const Cmp = GLYPH_MAP[kind] ?? GlyphModule;
  return <Cmp {...rest} />;
}

export const CATEGORY_GLYPH_MAP = {
  computing: GlyphCpu,
  networking: GlyphRadio,
  electronics: GlyphCircuit,
  everyday: GlyphPhone,
  modern: GlyphSparkles,
} as const;

export function CategoryGlyph({
  id,
  ...rest
}: GlyphProps & { id: string }) {
  const Cmp =
    CATEGORY_GLYPH_MAP[id as keyof typeof CATEGORY_GLYPH_MAP] ?? GlyphCircuit;
  return <Cmp {...rest} />;
}
