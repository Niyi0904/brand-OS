import type { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { OnboardingTopBar } from "@/components/onboarding/OnboardingTopBar";

type OnboardingLayoutProps = {
  children: ReactNode;
};

export default async function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingStep: true },
  });

  const step = user?.onboardingStep ?? "brand";

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <OnboardingTopBar onboardingStep={step} />
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-[560px] py-10 animate-phase-enter">
          {children}
        </div>
      </main>
    </div>
  );
}
