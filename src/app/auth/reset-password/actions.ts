"use server";

import { auth } from "@/lib/auth-edge";
import { prisma } from "@/lib/db";
import { compare, hash } from "bcryptjs";
import { redirect } from "next/navigation";

export async function resetPasswordAction(formData: FormData): Promise<void> {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!token) {
    throw new Error("Invalid or expired reset token");
  }

  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const verificationToken = await prisma.verificationToken.findFirst({
    where: { token },
  });

  if (!verificationToken || verificationToken.expires < new Date()) {
    throw new Error("Invalid or expired reset token");
  }

  const user = await prisma.user.findUnique({
    where: { email: verificationToken.identifier },
    select: { id: true },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  const hashedPassword = await hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  await prisma.verificationToken.deleteMany({
    where: { token },
  });

  redirect("/auth/signin?reset=success");
}