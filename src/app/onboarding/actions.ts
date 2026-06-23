"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

const INDUSTRIES = [
  "Fashion & Apparel",
  "Beauty & Skincare",
  "Food & Beverage",
  "Health & Wellness",
  "Technology",
  "Real Estate",
  "Professional Services",
  "E-commerce",
  "Hospitality",
  "Education",
  "Finance",
  "Other",
] as const;

const createBrandSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  description: z.string().min(1, "Description is required"),
  industry: z.enum(INDUSTRIES, { errorMap: () => ({ message: "Please select an industry" }) }),
});

export type CreateBrandState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
};

export async function createBrandAndStartOnboarding(
  prev: CreateBrandState,
  formData: FormData
): Promise<CreateBrandState> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const parsed = createBrandSchema.safeParse({
    brandName: formData.get("brandName"),
    description: formData.get("description"),
    industry: formData.get("industry"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, message: "Please check your input" };
  }

  const { brandName, description, industry } = parsed.data;
  const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);

  const brand = await prisma.brand.create({
    data: {
      name: brandName,
      slug,
      description,
      userId: session.user.id,
      brandBrain: {
        create: { industry },
      },
    },
    select: { id: true },
  });

  const cookieStore = await cookies();
  cookieStore.set("active_brand_id", brand.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingStep: "voice" },
  });

  revalidatePath("/dashboard");
  redirect("/onboarding/voice");
}

const voiceToneSchema = z.object({
  voiceAdjectives: z.string().optional().default(""),
  thingsToAvoid: z.string().optional().default(""),
});

export type Phase2ActionState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
};

export async function saveVoiceToneAction(
  prev: Phase2ActionState,
  formData: FormData
): Promise<Phase2ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { message: "Unauthorised" };

  const parsed = voiceToneSchema.safeParse({
    voiceAdjectives: formData.get("voiceAdjectives"),
    thingsToAvoid: formData.get("thingsToAvoid"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, message: "Please check your input" };
  }

  const brand = await prisma.brand.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  if (!brand) return { message: "No brand found" };

  await prisma.brandBrain.upsert({
    where: { brandId: brand.id },
    create: {
      brandId: brand.id,
      voiceAdjectives: parsed.data.voiceAdjectives,
      thingsToAvoid: parsed.data.thingsToAvoid,
      toneOfVoice: parsed.data.voiceAdjectives,
    },
    update: {
      voiceAdjectives: parsed.data.voiceAdjectives,
      thingsToAvoid: parsed.data.thingsToAvoid,
      toneOfVoice: parsed.data.voiceAdjectives,
    },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingStep: "audience" },
  });

  redirect("/onboarding/audience");
}

const targetAudienceSchema = z.object({
  targetAudience: z.string().optional().default(""),
});

export async function saveTargetAudienceAction(
  prev: Phase2ActionState,
  formData: FormData
): Promise<Phase2ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { message: "Unauthorised" };

  const parsed = targetAudienceSchema.safeParse({
    targetAudience: formData.get("targetAudience"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, message: "Please check your input" };
  }

  const brand = await prisma.brand.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  if (!brand) return { message: "No brand found" };

  await prisma.brandBrain.upsert({
    where: { brandId: brand.id },
    create: {
      brandId: brand.id,
      primaryAudience: parsed.data.targetAudience,
      targetAudience: parsed.data.targetAudience,
    },
    update: {
      primaryAudience: parsed.data.targetAudience,
      targetAudience: parsed.data.targetAudience,
    },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingStep: "products" },
  });

  redirect("/onboarding/products");
}

const productsSchema = z.object({
  productList: z.string().optional().default(""),
});

export async function saveProductsAction(
  prev: Phase2ActionState,
  formData: FormData
): Promise<Phase2ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { message: "Unauthorised" };

  const parsed = productsSchema.safeParse({
    productList: formData.get("productList"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, message: "Please check your input" };
  }

  const brand = await prisma.brand.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  if (!brand) return { message: "No brand found" };

  const productList = parsed.data.productList;

  await prisma.brandBrain.upsert({
    where: { brandId: brand.id },
    create: {
      brandId: brand.id,
      productList,
      products: productList,
    },
    update: {
      productList,
      products: productList,
    },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingStep: "competitor" },
  });

  redirect("/onboarding/competitor");
}

const competitorSchema = z.object({
  competitorName: z.string().optional().default(""),
  differentiation: z.string().optional().default(""),
});

export async function saveCompetitorAction(
  prev: Phase2ActionState,
  formData: FormData
): Promise<Phase2ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { message: "Unauthorised" };

  const parsed = competitorSchema.safeParse({
    competitorName: formData.get("competitorName"),
    differentiation: formData.get("differentiation"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, message: "Please check your input" };
  }

  const brand = await prisma.brand.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  if (!brand) return { message: "No brand found" };

  const competitorList = parsed.data.competitorName
    ? JSON.stringify([{ name: parsed.data.competitorName, positioningNote: parsed.data.differentiation }])
    : "";

  await prisma.brandBrain.upsert({
    where: { brandId: brand.id },
    create: {
      brandId: brand.id,
      competitorList,
      competitors: parsed.data.competitorName,
    },
    update: {
      competitorList,
      competitors: parsed.data.competitorName,
    },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingStep: "chat" },
  });

  redirect("/onboarding/chat");
}

export async function skipPhase2CardAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const nextStep = formData.get("nextStep") as string;
  const skippedCard = formData.get("skippedCard") as string;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingSkippedCards: true },
  });

  const updatedSkipped = user?.onboardingSkippedCards ?? [];
  if (skippedCard && !updatedSkipped.includes(skippedCard)) {
    updatedSkipped.push(skippedCard);
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      onboardingStep: nextStep,
      onboardingSkippedCards: updatedSkipped,
    },
  });

  redirect(`/onboarding/${nextStep}`);
}

export async function skipPhase2Action() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingStep: "chat" },
  });

  redirect("/onboarding/chat");
}

export async function exitOnboardingAction() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  // Don't mark complete — user can resume from /onboarding later
  redirect("/dashboard");
}

export async function completeOnboardingAction() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      onboardingStep: "complete",
      onboardingCompleted: true,
    },
  });

  return { success: true };
}
