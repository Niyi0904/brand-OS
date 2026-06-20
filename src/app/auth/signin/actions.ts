"use server";

import { signInSchema } from "@/lib/validations";

export type SignInActionState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
};

export async function validateSignInFields(
  prev: SignInActionState,
  formData: FormData
): Promise<SignInActionState> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, message: "Please check your input" };
  }

  // Validation passed — the client will call signIn("credentials") with the data
  return { message: "" };
}