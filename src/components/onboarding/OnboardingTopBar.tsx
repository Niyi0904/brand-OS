"use client";

import Image from "next/image";
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
      <Link href="/dashboard" className="flex items-center shrink-0">
        <Image
          src="/logo.png"
          alt="MarketingOS"
          width={47}
          height={24}
          priority
          className="h-6 w-auto"
        />
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
