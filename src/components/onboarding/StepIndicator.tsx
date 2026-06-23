import { Sparkles } from "lucide-react";

const STEPS = [
  { key: "brand", label: "Brand" },
  { key: "brain", label: "Brain" },
  { key: "chat", label: "First response" },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

function getCurrentStepKey(onboardingStep: string): StepKey {
  if (onboardingStep === "brand") return "brand";
  if (["voice", "audience", "products", "competitor"].includes(onboardingStep)) return "brain";
  if (onboardingStep === "chat") return "chat";
  return "brand";
}

type StepIndicatorProps = {
  onboardingStep: string;
};

export function StepIndicator({ onboardingStep }: StepIndicatorProps) {
  const currentKey = getCurrentStepKey(onboardingStep);
  const currentIdx = STEPS.findIndex((s) => s.key === currentKey);

  return (
    <div className="flex items-center gap-3" aria-label={`Onboarding progress: step ${currentIdx + 1} of 3`}>
      {STEPS.map((step, idx) => {
        const isFilled = idx <= currentIdx;
        const isCurrent = idx === currentIdx;

        return (
          <div key={step.key} className="flex flex-col items-center gap-1.5">
            <div
              className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                isFilled ? "bg-[var(--brand-accent)]" : "border border-[var(--color-border-hover)] bg-transparent"
              }`}
              aria-current={isCurrent ? "step" : undefined}
            />
            <span className="text-[0.6875rem] text-[var(--color-text-tertiary)] hidden sm:block">
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
