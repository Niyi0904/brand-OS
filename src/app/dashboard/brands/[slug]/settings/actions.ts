"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { brandBrainSchema } from "@/lib/validations";
import { redirect } from "next/navigation";
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
    "mission", "vision", "values",
    "targetAudience", "customerPersonas",
    "products", "services",
    "toneOfVoice", "brandColors", "typography",
    "competitors", "seoKeywords", "goals",
    "preferredPlatforms", "writingStyle",
    "marketingStrategy", "offers", "businessInfo",
    "locations", "faqs", "brandRules",
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

  await prisma.brand.update({
    where: { id: brand.id },
    data: {
      logo: logo ?? undefined,
      brandBrain: {
        upsert: {
          where: { brandId: brand.id },
          update: parsed.data,
          create: parsed.data,
        },
      },
    },
  });

  revalidatePath(`/dashboard/brands/${slug}/settings`);
  return { message: "Brand Brain saved successfully" };
}