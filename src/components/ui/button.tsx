import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base
  [
    "inline-flex items-center justify-center gap-1.5",
    "whitespace-nowrap font-medium",
    "font-[family-name:var(--font-geist-sans,Geist,system-ui)]",
    "tracking-[-0.01em]",
    "transition-all duration-[120ms]",
    "ease-[cubic-bezier(0.4,0,0.2,1)]",
    "focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-0",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.97]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        // Amber-gold primary — the flagship action
        default: [
          "bg-[var(--accent)] text-[var(--text-inverse)]",
          "shadow-[0_1px_2px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.14)]",
          "hover:bg-[var(--accent-strong)]",
          "hover:shadow-[0_2px_4px_rgba(0,0,0,0.4)]",
        ].join(" "),

        // Solid secondary — secondary actions
        secondary: [
          "bg-[var(--surface-3)] text-[var(--text-primary)]",
          "border border-[var(--border)]",
          "hover:bg-[var(--surface-4)] hover:border-[var(--border-strong)]",
        ].join(" "),

        // Outlined
        outline: [
          "bg-transparent text-[var(--text-primary)]",
          "border border-[var(--border)]",
          "hover:bg-[var(--surface-3)] hover:border-[var(--border-strong)]",
        ].join(" "),

        // Ghost — lowest emphasis
        ghost: [
          "bg-transparent text-[var(--text-secondary)]",
          "hover:bg-[var(--surface-3)] hover:text-[var(--text-primary)]",
        ].join(" "),

        // Destructive — danger actions
        destructive: [
          "bg-[var(--danger-muted)] text-[var(--danger)]",
          "border border-[var(--danger-border)]",
          "hover:bg-[rgba(224,112,112,0.20)]",
        ].join(" "),

        // Link — minimal text-only
        link: [
          "bg-transparent text-[var(--accent-strong)]",
          "underline underline-offset-[3px] decoration-[var(--accent-border)]",
          "hover:text-[var(--accent-strong)] hover:decoration-[var(--accent)]",
        ].join(" "),

        // AI-action — for AI-powered buttons
        ai: [
          "bg-[var(--ai-muted)] text-[var(--ai-action)]",
          "border border-[var(--ai-border)]",
          "hover:bg-[rgba(139,145,232,0.18)]",
        ].join(" "),
      },

      size: {
        xs:      "h-7 px-2.5 text-[0.75rem] rounded-[var(--radius-sm)] [&_svg]:size-3",
        sm:      "h-8 px-3 text-[0.8125rem] rounded-[var(--radius-md)] [&_svg]:size-3.5",
        default: "h-9 px-4 text-[0.875rem] rounded-[var(--radius-md)] [&_svg]:size-4",
        lg:      "h-11 px-5 text-[0.9375rem] rounded-[var(--radius-lg)] [&_svg]:size-4",
        xl:      "h-13 px-7 text-[1rem] rounded-[var(--radius-lg)] [&_svg]:size-5",
        icon:    "h-9 w-9 rounded-[var(--radius-md)] [&_svg]:size-4",
        "icon-sm": "h-8 w-8 rounded-[var(--radius-sm)] [&_svg]:size-3.5",
        "icon-lg": "h-11 w-11 rounded-[var(--radius-lg)] [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          disabled={disabled || loading}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader2
            className="animate-spin"
            style={{ width: "0.875em", height: "0.875em" }}
          />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
