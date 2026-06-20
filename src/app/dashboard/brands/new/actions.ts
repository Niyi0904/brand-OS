"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { brandSchema } from "@/lib/validations";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createBrandSchema = brandSchema.extend({
  audience: z.string().optional(),
  accent: z.string().optional(),
});

export type CreateBrandActionState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
};

export async function createBrandAction(
  prev: CreateBrandActionState,
  formData: FormData
): Promise<CreateBrandActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "Unauthorised" };
  }

  const parsed = createBrandSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    logo: formData.get("logo"),
    audience: formData.get("audience"),
    accent: formData.get("accent"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, message: "Please check your input" };
  }

  const { name, slug, description, logo, audience, accent } = parsed.data;

  // Check for existing slug
  const existing = await prisma.brand.findFirst({
    where: { slug, userId: session.user.id },
  });

  if (existing) {
    return { message: "A brand with this slug already exists" };
  }

  await prisma.brand.create({
    data: {
      name,
      slug,
      description,
      logo,
      userId: session.user.id,
      brandBrain: {
        create: {},
      },
    },
  });

  revalidatePath("/dashboard/brands");
  redirect("/dashboard/brands");
}