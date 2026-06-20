"use server";

import { signUpSchema } from "@/lib/validations";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";

export type SignUpActionState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
  success?: boolean;
};

export async function signUpAction(
  prev: SignUpActionState,
  formData: FormData
): Promise<SignUpActionState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, message: "Please check your input" };
  }

  const { name, email, password } = parsed.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { message: "User already exists" };
    }

    const hashedPassword = await hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { message: "Account created successfully! Redirecting...", success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { message: "Something went wrong. Please try again." };
  }
}
