"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { brandBrainSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export type SettingsActionState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
};

export async function updateBrandBrainAction(
  prev: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "Unauthorised" };
  }

  const slug = formData.get("slug") as string;
  if (!slug) return { message: "Missing brand slug" };

  const brand = await prisma.brand.findFirst({
    where: { slug, userId: session.user.id },
    select: { id: true },
  });

  if (!brand) return { message: "Brand not found" };

  const raw: Record<string, string> = {};
  const fields = [
    // Legacy M1 fields
    "mission", "vision", "values",
    "targetAudience", "customerPersonas",
    "products", "services",
    "toneOfVoice", "brandColors", "typography",
    "competitors", "seoKeywords", "goals",
    "preferredPlatforms", "writingStyle",
    "marketingStrategy", "offers", "businessInfo",
    "locations", "faqs", "brandRules",
    // M2 Brand Identity
    "tagline", "websiteUrl", "industry", "foundedYear",
    // M2 Mission & Values
    "missionStatement", "coreValues", "brandPromise",
    // M2 Voice & Tone
    "voiceAdjectives", "toneDescription", "writingStyleNotes", "thingsToAvoid",
    // M2 Target Audience
    "primaryAudience", "audienceDemographics", "audiencePainPoints", "audienceVocabulary",
    // M2 Products & Services
    "productList", "pricingTier", "keyDifferentiators",
    // M2 Competitors
    "competitorList", "competitiveAdvantages", "thingsNeverDo",
    // M2 SEO & Keywords
    "primaryKeywords", "secondaryKeywords", "topicsToOwn", "topicsToAvoid",
    // M2 FAQs
    "faqList",
    // M2 Additional Context
    "freeformNotes", "contentExamples", "brandStory",
  ];

  for (const field of fields) {
    const val = formData.get(field);
    raw[field] = typeof val === "string" ? val : "";
  }

  const logo = formData.get("logo") as string | null;
  const parsed = brandBrainSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, message: "Please check your input" };
  }

  // Convert foundedYear from string to number for Prisma Int field
  const { foundedYear, ...restData } = parsed.data;
  const updateData: Record<string, unknown> = { ...restData };
  if (foundedYear) {
    const year = parseInt(foundedYear, 10);
    updateData.foundedYear = isNaN(year) ? null : year;
  } else {
    updateData.foundedYear = null;
  }

  await prisma.brand.update({
    where: { id: brand.id },
    data: {
      logo: logo ?? undefined,
      brandBrain: {
        upsert: {
          where: { brandId: brand.id },
          update: updateData,
          create: updateData,
        },
      },
    },
  });

  revalidatePath(`/dashboard/brands/${slug}/settings`);
  return { message: "Brand Brain saved successfully" };
}