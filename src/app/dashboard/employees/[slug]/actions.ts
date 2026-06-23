"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { redirect } from "next/navigation";

const RenameSchema = z.object({
  conversationId: z.string(),
  title: z.string().min(1).max(100),
});

const DeleteSchema = z.object({
  conversationId: z.string(),
});

export type ActionState = { errors?: Record<string, string[]>; message?: string };

export async function renameConversationAction(
  prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { message: "Unauthorised" };

  const parsed = RenameSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const { conversationId, title } = parsed.data;

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { userId: true },
  });

  if (!conversation || conversation.userId !== session.user.id) {
    return { message: "Conversation not found" };
  }

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { title },
  });

  return { message: "Renamed" };
}

export async function deleteConversationAction(
  prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { message: "Unauthorised" };

  const parsed = DeleteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const { conversationId } = parsed.data;

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { userId: true },
  });

  if (!conversation || conversation.userId !== session.user.id) {
    return { message: "Conversation not found" };
  }

  await prisma.conversation.delete({
    where: { id: conversationId },
  });

  return { message: "Deleted" };
}

export async function startNewConversationAction(
  employeeSlug: string,
  brandId: string
): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const employee = await prisma.aIEmployee.findUnique({
    where: { slug: employeeSlug },
    select: { id: true },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  const conversation = await prisma.conversation.create({
    data: {
      userId: session.user.id,
      employeeId: employee.id,
      brandId,
      title: "New conversation",
    },
  });

  return conversation.id;
}