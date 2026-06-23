import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function OnboardingRoot() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingStep: true, onboardingCompleted: true },
  });

  if (user?.onboardingCompleted) {
    redirect("/dashboard");
  }

  const step = user?.onboardingStep ?? "brand";

  const stepRoutes: Record<string, string> = {
    brand: "/onboarding/brand",
    voice: "/onboarding/voice",
    audience: "/onboarding/audience",
    products: "/onboarding/products",
    competitor: "/onboarding/competitor",
    chat: "/onboarding/chat",
    complete: "/dashboard",
  };

  redirect(stepRoutes[step] ?? "/onboarding/brand");
}
