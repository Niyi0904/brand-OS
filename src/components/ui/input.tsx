import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, error, ...props }, ref) => {
    return (
      <div className="relative">
        {startIcon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] [&_svg]:h-4 [&_svg]:w-4">
            {startIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "mos-input flex h-10 w-full rounded-lg px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--color-text-primary)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            startIcon && "pl-10",
            error && "border-[var(--color-red)] focus-visible:border-[var(--color-red)] focus-visible:shadow-none",
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-[var(--color-red)]" role="alert">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
