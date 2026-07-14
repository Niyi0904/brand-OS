import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1",
    "px-2 py-0.5",
    "rounded-[var(--radius-full)]",
    "text-[0.6875rem] font-semibold leading-none",
    "tracking-[0.01em]",
    "border",
    "select-none whitespace-nowrap",
  ].join(" "),
  {
    variants: {
      variant: {
        // Amber-gold — brand accent
        accent: [
          "bg-[var(--accent-subtle)]",
          "border-[var(--accent-border)]",
          "text-[var(--accent-strong)]",
        ].join(" "),

        // Neutral — default
        default: [
          "bg-[rgba(255,255,255,0.06)]",
          "border-[var(--border)]",
          "text-[var(--text-secondary)]",
        ].join(" "),

        // Positive / success
        positive: [
          "bg-[var(--positive-muted)]",
          "border-[var(--positive-border)]",
          "text-[var(--positive)]",
        ].join(" "),

        // Warning
        warning: [
          "bg-[var(--warning-muted)]",
          "border-[var(--warning-border)]",
          "text-[var(--warning)]",
        ].join(" "),

        // Danger
        danger: [
          "bg-[var(--danger-muted)]",
          "border-[var(--danger-border)]",
          "text-[var(--danger)]",
        ].join(" "),

        // AI action
        ai: [
          "bg-[var(--ai-muted)]",
          "border-[var(--ai-border)]",
          "text-[var(--ai-action)]",
        ].join(" "),

        // Subtle / coming soon
        muted: [
          "bg-transparent",
          "border-[var(--border)]",
          "text-[var(--text-tertiary)]",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className="inline-block h-[5px] w-[5px] rounded-full bg-current opacity-80 shrink-0"
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
