"use server";

import { auth } from "@/lib/auth-edge";
import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { randomBytes } from "crypto";

export async function forgotPasswordAction(formData: FormData): Promise<void> {
  const email = formData.get("email") as string;

  if (!email) {
    throw new Error("Email is required");
  }

  const session = await auth();
  if (session?.user?.email === email) {
    throw new Error("You are already logged in");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true },
  });

  if (!user) {
    return;
  }

  const token = randomBytes(32).toString("hex");
  const expires = new Date();
  expires.setHours(expires.getHours() + 1);

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/reset-password?token=${token}`;

  try {
    await sendPasswordResetEmail({ to: email, resetUrl });
  } catch (emailError) {
    console.error("Failed to send password reset email:", emailError);
    throw new Error("Failed to send reset email. Please try again.");
  }
}
