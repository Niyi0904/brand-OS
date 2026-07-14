import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {startIcon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] [&_svg]:h-4 [&_svg]:w-4">
            {startIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            // Base styles
            "mos-input flex h-9 w-full rounded-[var(--radius-md)] px-3 py-2",
            "text-[var(--text-sm,0.8125rem)]",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--text-primary)]",
            "focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-40",
            "transition-[border-color,box-shadow,background] duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
            // Padding adjustments for icons
            startIcon && "pl-9",
            endIcon && "pr-9",
            // Error state
            error && [
              "border-[var(--danger)] !important",
              "focus-visible:border-[var(--danger)]",
              "focus-visible:shadow-[0_0_0_3px_var(--danger-muted)]",
            ],
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          {...props}
        />
        {endIcon && (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] [&_svg]:h-4 [&_svg]:w-4">
            {endIcon}
          </div>
        )}
        {error && (
          <p
            className="mt-1.5 text-[var(--text-2xs,0.6875rem)] font-medium text-[var(--danger)]"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
