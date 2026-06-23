"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { exitOnboardingAction } from "@/app/onboarding/actions";

type OnboardingTopBarProps = {
  onboardingStep: string;
};

export function OnboardingTopBar({ onboardingStep }: OnboardingTopBarProps) {
  const showExit = onboardingStep !== "brand";

  return (
    <header className="flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-transparent px-4 sm:px-6">
      <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
        <div className="mos-icon-tile flex h-8 w-8 items-center justify-center rounded-lg">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold tracking-wide hidden sm:block">MarketingOS</span>
      </Link>

      <div className="hidden sm:flex">
        <StepIndicator onboardingStep={onboardingStep} />
      </div>

      <div className="flex items-center gap-2">
        {showExit && (
          <form action={exitOnboardingAction}>
            <button
              type="submit"
              className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Exit and finish later
            </button>
          </form>
        )}
      </div>
    </header>
  );
}
