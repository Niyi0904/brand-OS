import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { OnboardingChat } from "@/components/onboarding/OnboardingChat";

export default async function OnboardingChatPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingSkippedCards: true, onboardingStep: true },
  });

  if (!user) redirect("/onboarding/brand");

  // Get the onboarding brand (first/only brand)
  const brand = await prisma.brand.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { brandBrain: true },
  });

  if (!brand) redirect("/onboarding/brand");

  // Get the Content Director employee
  const employee = await prisma.aIEmployee.findUnique({
    where: { slug: "content-director" },
    select: {
      id: true,
      name: true,
      slug: true,
      title: true,
      icon: true,
      accentColor: true,
      description: true,
    },
  });

  if (!employee) notFound();

  // Determine if standard or sparse path
  const isSparse = user.onboardingSkippedCards.length >= 3;

  // Build pre-populated prompt server side
  let productName = "our main offering";
  if (brand.brandBrain?.productList) {
    try {
      const products = JSON.parse(brand.brandBrain.productList);
      if (Array.isArray(products) && products.length > 0 && products[0]?.name) {
        productName = products[0].name;
      }
    } catch {}
  }

  const standardPrompt = `Write three social media captions for ${brand.name} introducing ${productName}.`;
  const sparsePrompt = `Write a short introduction for ${brand.name}. Keep it simple — I'll give you more to work with soon.`;

  const initialPrompt = isSparse ? sparsePrompt : standardPrompt;

  return (
    <div className="w-full max-w-full h-full">
      <OnboardingChat
        employee={{
          id: employee.id,
          name: employee.name,
          slug: employee.slug,
          title: employee.title,
          icon: employee.icon,
          accentColor: employee.accentColor,
          description: employee.description,
        }}
        brand={{
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
        }}
        initialPrompt={initialPrompt}
        isSparse={isSparse}
        brandSlug={brand.slug}
      />
    </div>
  );
}
