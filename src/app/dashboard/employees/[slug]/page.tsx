import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeBrandBrainCompleteness } from "@/lib/brand-utils";
import { ChatShell } from "./components/ChatShell";

interface EmployeeChatPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ brand?: string; conversation?: string }>;
}

export default async function EmployeeChatPage({
  params,
  searchParams,
}: EmployeeChatPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const { slug } = await params;
  const { brand: brandId, conversation: conversationId } = await searchParams;

  // Fetch employee by slug
  const employee = await prisma.aIEmployee.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      title: true,
      icon: true,
      accentColor: true,
      description: true,
    },
  });

  if (!employee || !employee.slug) {
    notFound();
  }

  // Get active brand — use provided brandId or find first brand
  let activeBrandId = brandId;
  if (!activeBrandId) {
    const firstBrand = await prisma.brand.findFirst({
      where: { userId: session.user.id },
      select: { id: true },
      orderBy: { createdAt: "desc" },
    });
    activeBrandId = firstBrand?.id;
  }

  if (!activeBrandId) {
    // No brands exist — redirect to create one
    redirect("/dashboard/brands/new");
  }

  const brand = await prisma.brand.findFirst({
    where: {
      id: activeBrandId,
      OR: [
        { userId: session.user.id },
        { organizationId: { not: null } },
      ],
    },
    include: { brandBrain: true },
  });

  if (!brand) {
    notFound();
  }

  // Fetch conversations for this employee + brand
  const conversations = await prisma.conversation.findMany({
    where: {
      userId: session.user.id,
      employeeId: employee.id,
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

  // Fetch initial messages if conversationId provided
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

  // Compute brand brain completeness
  const completeness = computeBrandBrainCompleteness(brand.brandBrain);
  const isBrainSparse = completeness < 30;

  return (
    <ChatShell
      employee={employee}
      brand={brand}
      conversations={conversations}
      initialMessages={initialMessages}
      activeConversationId={conversationId}
      isBrainSparse={isBrainSparse}
    />
  );
}