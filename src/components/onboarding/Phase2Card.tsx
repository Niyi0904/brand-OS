import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

type Phase2CardProps = {
  icon: ReactNode;
  heading: string;
  subtext: string;
  children: ReactNode;
  isSubmitting?: boolean;
  continueFormAction?: (formData: FormData) => void;
  onSkip?: () => void;
  skipLabel?: string;
};

export function Phase2Card({
  icon,
  heading,
  subtext,
  children,
  isSubmitting = false,
  continueFormAction,
  onSkip,
  skipLabel,
}: Phase2CardProps) {
  return (
    <div className="w-full max-w-[560px] mx-auto">
      <div
        className="bg-[var(--color-surface-1)] border border-[var(--color-border-hover)] p-10 animate-card-enter"
        style={{ borderRadius: "16px", boxShadow: "0 16px 48px rgba(0,0,0,0.3)" }}
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full mb-4"
            style={{ background: "rgba(124, 156, 255, 0.12)", color: "var(--brand-accent)" }}
            aria-hidden="true"
          >
            {icon}
          </div>

          <h1 className="text-[1.125rem] font-semibold text-[var(--color-text-primary)] mb-1.5">
            {heading}
          </h1>
          <p className="text-[0.9rem] text-[var(--color-text-secondary)] max-w-md">
            {subtext}
          </p>
        </div>

        <form action={continueFormAction}>
          {children}

          <div className="mt-8 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 h-11 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: "var(--brand-accent)",
                color: "var(--color-bg)",
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
              aria-disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Continue
            </button>

            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="w-full text-center text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] py-2 transition-colors"
                aria-label={skipLabel}
              >
                Skip for now
              </button>
            )}

            <p className="text-center text-[0.8125rem] text-[var(--color-text-tertiary)]">
              Skipping this means the AI will have less context to work with.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
