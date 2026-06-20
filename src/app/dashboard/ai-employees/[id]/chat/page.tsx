import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ChatLayout } from "@/components/chat/chat-layout";

interface ChatPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ brand?: string; conversation?: string }>;
}

export default async function ChatPage({ params, searchParams }: ChatPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    return notFound();
  }

  const { id } = await params;
  const { brand: brandId, conversation: conversationId } = await searchParams;

  const employee = await prisma.aIEmployee.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      title: true,
      accentColor: true,
      description: true,
    },
  });

  if (!employee) {
    return notFound();
  }

  const activeBrandId = brandId || session.user.id;

  const brand = await prisma.brand.findFirst({
    where: {
      id: activeBrandId,
      OR: [
        { userId: session.user.id },
        { organizationId: { not: null } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  if (!brand) {
    return notFound();
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      userId: session.user.id,
      employeeId: id,
      brandId: activeBrandId,
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { messages: true } },
    },
  });

  const initialMessages = conversationId
    ? await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          role: true,
          content: true,
          createdAt: true,
        },
      })
    : [];

  return (
    <ChatLayout
      employee={employee}
      brand={brand}
      conversations={conversations}
      initialMessages={initialMessages}
      activeConversationId={conversationId}
    />
  );
}