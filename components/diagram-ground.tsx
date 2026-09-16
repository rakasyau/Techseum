import { cn } from "@/lib/utils";

/* The technical ground every diagram, bench and exhibit preview sits on.
   A single shared implementation keeps the cell size, weight and fade
   identical everywhere, so diagrams read as one drawing system rather than
   five separate treatments. Legitimate here: these are measurement surfaces,
   not decorative page backgrounds. */
export function DiagramGround({
  className,
  cell = 26,
  opacity = 0.7,
  mask,
}: {
  className?: string;
  cell?: number;
  opacity?: number;
  mask?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        opacity,
        backgroundImage:
          "linear-gradient(rgb(var(--line)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--line)) 1px, transparent 1px)",
        backgroundSize: `${cell}px ${cell}px`,
        ...(mask
          ? {
              maskImage: mask,
              WebkitMaskImage: mask,
            }
          : {}),
      }}
    />
  );
}
