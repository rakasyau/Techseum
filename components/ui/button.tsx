import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.985]",
  {
    variants: {
      variant: {
        solid:
          "bg-ink text-paper hover:bg-ink-soft shadow-card hover:shadow-lift",
        accent:
          "bg-accent text-white hover:bg-accent-deep shadow-card hover:shadow-lift",
        outline:
          "border border-line-strong bg-paper text-ink hover:border-ink hover:bg-paper-alt",
        ghost: "text-ink-soft hover:bg-paper-alt hover:text-ink",
        soft: "bg-accent-soft text-accent-ink hover:bg-accent hover:text-white",
        danger: "bg-danger text-white hover:brightness-95",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        md: "h-11 px-5 text-sm",
        lg: "h-[52px] px-7 text-[15px]",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
