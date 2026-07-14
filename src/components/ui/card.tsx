import * as React from "react";

import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   Card — MOS design system
   
   Variants:
   - Card         : default elevated card (static)
   - CardHover    : card with hover lift animation
   - CardHeader   : card header container
   - CardTitle    : card headline
   - CardDescription : card subtext
   - CardContent  : main body area
   - CardFooter   : footer row
────────────────────────────────────────────────────────────────────────────── */

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Warm elevated surface
      "relative overflow-hidden",
      "bg-[var(--surface-2)]",
      "border border-[var(--border)]",
      "rounded-[var(--radius-lg)]",
      "shadow-[var(--shadow-sm)]",
      "text-[var(--text-primary)]",
      // Subtle top-edge highlight for elevation feel
      "before:absolute before:inset-0 before:rounded-[inherit]",
      "before:bg-gradient-to-b before:from-white/[0.032] before:to-transparent before:pointer-events-none",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHover = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative overflow-hidden",
      "bg-[var(--surface-2)]",
      "border border-[var(--border)]",
      "rounded-[var(--radius-lg)]",
      "shadow-[var(--shadow-sm)]",
      "text-[var(--text-primary)]",
      "before:absolute before:inset-0 before:rounded-[inherit]",
      "before:bg-gradient-to-b before:from-white/[0.032] before:to-transparent before:pointer-events-none",
      // Hover lift
      "transition-all duration-[200ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
      "will-change-transform",
      "hover:border-[var(--border-strong)]",
      "hover:-translate-y-px",
      "hover:shadow-[var(--shadow-md)]",
      className
    )}
    {...props}
  />
));
CardHover.displayName = "CardHover";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1 p-5", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-[var(--text-md,0.9375rem)] font-semibold leading-snug",
      "tracking-[-0.015em]",
      "text-[var(--text-primary)]",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-[var(--text-xs,0.75rem)] leading-[1.5]",
      "text-[var(--text-secondary)]",
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-5 pb-5", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center px-5 pb-5",
      "border-t border-[var(--border)] pt-4 mt-1",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHover,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
