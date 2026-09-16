import { cn } from "@/lib/utils";

export function Logo({
  markOnly = false,
  className,
}: {
  markOnly?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid h-8 w-8 place-items-center" aria-hidden>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <circle
            cx="15"
            cy="15"
            r="13.2"
            stroke="rgb(var(--ink))"
            strokeWidth="1.4"
            strokeDasharray="2.6 3.4"
          />
          <circle cx="15" cy="15" r="6.6" fill="rgb(var(--accent))" />
          <circle cx="15" cy="15" r="2.5" fill="rgb(var(--paper))" />
        </svg>
      </span>
      <span className="font-display text-[19px] font-bold tracking-[-0.045em] text-ink">
        Techseum
      </span>
    </span>
  );
}
