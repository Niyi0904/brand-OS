"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { compare, hash } from "bcryptjs";
import { z } from "zod";

// Validation schemas for settings
const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.string().url("Must be a valid URL").or(z.string().length(0)).optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirmation password must be at least 8 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match",
  path: ["confirmPassword"],
});

const updateOrgSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
});

export type ActionState = {
  success?: boolean;
  errors?: Record<string, string[] | undefined>;
  message?: string;
};

// 1. Update Profile
export async function updateProfileAction(
  prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
    image: formData.get("image"),
  });

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: "Please fix the validation errors",
    };
  }

  const { name, image } = parsed.data;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        image: image || null,
      },
    });

    revalidatePath("/dashboard/settings");
    return { success: true, message: "Profile updated successfully!" };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, message: "An error occurred while updating profile" };
  }
}

// 2. Change Password
export async function changePasswordAction(
  prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: "Please check your password entries",
    };
  }

  const { currentPassword, newPassword } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user || !user.password) {
      return { success: false, message: "User account credentials not set" };
    }

    // Verify current password matches
    const passwordMatch = await compare(currentPassword, user.password);
    if (!passwordMatch) {
      return {
        success: false,
        errors: { currentPassword: ["Incorrect current password"] },
        message: "Incorrect current password",
      };
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 10);

    // Save to DB
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return { success: true, message: "Password updated successfully!" };
  } catch (error) {
    console.error("Failed to update password:", error);
    return { success: false, message: "An error occurred while updating your password" };
  }
}

// 3. Update Organization details
export async function updateOrgAction(
  prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const parsed = updateOrgSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  });

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: "Please fix the organization validation errors",
    };
  }

  const { name, slug } = parsed.data;

  try {
    // Find organization membership where role is OWNER or ADMIN
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId: session.user.id,
        role: { in: ["OWNER", "ADMIN"] },
      },
      select: {
        organizationId: true,
      },
    });

    if (!membership) {
      return { success: false, message: "You do not have permissions to modify organization settings." };
    }

    // Verify slug uniqueness (except current organization)
    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
    });

    if (existingOrg && existingOrg.id !== membership.organizationId) {
      return {
        success: false,
        errors: { slug: ["This slug is already taken by another organization"] },
        message: "Slug already in use",
      };
    }

    await prisma.organization.update({
      where: { id: membership.organizationId },
      data: { name, slug },
    });

    revalidatePath("/dashboard/settings");
    return { success: true, message: "Organization updated successfully!" };
  } catch (error) {
    console.error("Failed to update organization:", error);
    return { success: false, message: "An error occurred while updating organization settings" };
  }
}
