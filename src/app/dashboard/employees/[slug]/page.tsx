import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
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
    select: {
      id: true,
      name: true,
      slug: true,
      brandBrain: {
        select: {
          id: true,
          mission: true,
          vision: true,
          values: true,
          tagline: true,
          industry: true,
          voiceAdjectives: true,
          primaryAudience: true,
          primaryKeywords: true,
          missionStatement: true,
          coreValues: true,
          toneDescription: true,
          writingStyleNotes: true,
        },
      },
    },
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
  const brain = brand.brandBrain;
  let filledSections = 0;
  if (brain) {
    if (brain.mission || brain.missionStatement) filledSections++;
    if (brain.vision) filledSections++;
    if (brain.values || brain.coreValues) filledSections++;
    if (brain.tagline || brain.industry) filledSections++;
    if (brain.voiceAdjectives || brain.toneDescription) filledSections++;
    if (brain.primaryAudience) filledSections++;
    if (brain.primaryKeywords) filledSections++;
    if (brain.writingStyleNotes) filledSections++;
  }
  const isBrainSparse = filledSections < 3;

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