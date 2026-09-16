import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  description,
  href,
  linkLabel = "View all",
  className,
  children,
}: {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-x-8 gap-y-4",
        className
      )}
    >
      <div className="max-w-[60ch]">
        <h2 className="font-display text-[clamp(1.5rem,3.4vw,2.1rem)] font-bold leading-tight tracking-[-0.035em] text-balance">
          {title}
        </h2>
        {description ? (
          <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
            {description}
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-4">
        {children}
        {href ? (
          <Link
            href={href}
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-4 py-2 text-[13px] font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
          >
            {linkLabel}
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
