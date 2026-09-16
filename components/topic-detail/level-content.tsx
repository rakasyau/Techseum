import type { ContentBlock } from "@/lib/types";
import { ArrowRight, Lightbulb, ListChecks, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/* Renders the seeded MDX-ish blocks. Content always leads with prose; the
   supporting devices are earned by the material, not decorative. */
export function LevelContent({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-7">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "p":
      return (
        <p className="max-w-measure text-[15.5px] leading-[1.75] text-ink-soft text-pretty">
          {block.text}
        </p>
      );

    case "h":
      return (
        <h3 className="pt-2 font-display text-[19px] font-semibold tracking-[-0.025em] text-ink">
          {block.text}
        </h3>
      );

    case "list":
      return (
        <ul className="space-y-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-[14.5px] leading-relaxed text-ink-soft">
              <span
                aria-hidden
                className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-[2px] bg-accent"
              />
              <span className="max-w-measure">{item}</span>
            </li>
          ))}
        </ul>
      );

    case "steps":
      return (
        <ol className="overflow-hidden rounded-2xl border border-line bg-paper">
          {block.items.map((item, i) => (
            <li
              key={i}
              className={cn(
                "flex gap-4 p-5",
                i !== 0 && "border-t border-line"
              )}
            >
              <span className="tnum grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line bg-paper-alt font-mono text-[11px] font-semibold text-ink-soft">
                {i + 1}
              </span>
              <div>
                <p className="font-display text-[14.5px] font-semibold tracking-[-0.01em]">
                  {item.title}
                </p>
                <p className="mt-1 max-w-measure text-[13.5px] leading-relaxed text-ink-muted">
                  {item.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      );

    case "callout": {
      const tones = {
        info: {
          border: "border-line",
          bg: "bg-paper-alt",
          icon: "text-accent",
          Icon: ListChecks,
        },
        tip: {
          border: "border-success/25",
          bg: "bg-success-soft",
          icon: "text-success",
          Icon: Lightbulb,
        },
        warn: {
          border: "border-warn/30",
          bg: "bg-warn-soft",
          icon: "text-warn",
          Icon: TriangleAlert,
        },
      } as const;
      const t = tones[block.tone];
      return (
        <aside
          className={cn(
            "flex gap-3.5 rounded-2xl border p-5",
            t.border,
            t.bg
          )}
        >
          <span className={cn("mt-0.5 shrink-0", t.icon)} aria-hidden>
            <t.Icon size={17} />
          </span>
          <div>
            <p className="font-display text-[14.5px] font-semibold tracking-[-0.01em]">
              {block.title}
            </p>
            <p className="mt-1.5 max-w-measure text-[13.5px] leading-relaxed text-ink-soft">
              {block.text}
            </p>
          </div>
        </aside>
      );
    }

    case "stats":
      return (
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {block.items.map((s, i) => (
            <div key={i} className="bg-paper p-5">
              <p className="font-display text-[clamp(1.25rem,2.6vw,1.6rem)] font-bold leading-none tracking-[-0.03em] tnum">
                {s.value}
              </p>
              <p className="mt-2 text-[12.5px] font-medium text-ink-soft">
                {s.label}
              </p>
              {s.note ? (
                <p className="mt-0.5 text-2xs text-ink-muted">{s.note}</p>
              ) : null}
            </div>
          ))}
        </div>
      );

    case "compare":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { ...block.left, tone: "danger" as const },
            { ...block.right, tone: "success" as const },
          ].map((side) => (
            <div
              key={side.title}
              className={cn(
                "rounded-2xl border p-5",
                side.tone === "danger"
                  ? "border-danger/20 bg-danger-soft/60"
                  : "border-success/20 bg-success-soft/60"
              )}
            >
              <p className="font-display text-[14.5px] font-semibold tracking-[-0.01em]">
                {side.title}
              </p>
              <ul className="mt-3 space-y-2">
                {side.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 text-[13.5px] leading-relaxed text-ink-soft"
                  >
                    <ArrowRight
                      size={13}
                      className={cn(
                        "mt-1 shrink-0",
                        side.tone === "danger" ? "text-danger" : "text-success"
                      )}
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}
