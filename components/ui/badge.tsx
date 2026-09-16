import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-medium leading-none",
  {
    variants: {
      variant: {
        neutral: "border-line bg-paper-alt text-ink-soft",
        outline: "border-line-strong bg-transparent text-ink-soft",
        accent: "border-accent/20 bg-accent-soft text-accent-ink",
        signal: "border-signal/25 bg-signal-soft text-signal",
        success: "border-success/25 bg-success-soft text-success",
        danger: "border-danger/25 bg-danger-soft text-danger",
        warn: "border-warn/25 bg-warn-soft text-warn",
        solid: "border-transparent bg-ink text-paper",
      },
      size: {
        sm: "px-2 py-0.5 text-2xs",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-[13px]",
      },
    },
    defaultVariants: { variant: "neutral", size: "md" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { badgeVariants };
