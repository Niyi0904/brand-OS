import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getUserSubscription } from "@/lib/subscription";
import { SettingsContainer } from "./settings-container";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // 1. Fetch User Data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  // 2. Fetch Organization membership
  const membership = await prisma.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: {
      organization: true,
    },
  });

  const organization = membership
    ? {
        id: membership.organization.id,
        name: membership.organization.name,
        slug: membership.organization.slug,
      }
    : null;

  // 3. Fetch Organization Members (Human and AI Employees)
  let allMembers: Array<{ id: string; name: string; role: string; email: string; isAI?: boolean }> = [];

  if (membership) {
    // Human Members
    const dbMembers = await prisma.organizationMember.findMany({
      where: { organizationId: membership.organizationId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { role: "asc" },
    });

    const humanMembers = dbMembers.map((m) => ({
      id: m.id,
      name: m.user.name || "User",
      role: m.role,
      email: m.user.email,
    }));

    // AI Members
    const dbAIEmployees = await prisma.aIEmployee.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          { organizationId: membership.organizationId },
        ],
      },
      select: {
        id: true,
        name: true,
        title: true,
      },
    });

    const aiMembers = dbAIEmployees.map((emp) => ({
      id: emp.id,
      name: emp.name,
      role: emp.title || "AI Assistant",
      email: "active@marketing-os.ai",
      isAI: true,
    }));

    allMembers = [...humanMembers, ...aiMembers];
  } else {
    // If no org membership, at least show the user
    allMembers = [
      {
        id: user.id,
        name: user.name || "User",
        role: "OWNER",
        email: user.email,
      },
    ];
  }

  // 4. Fetch subscription info
  const subscriptionInfo = await getUserSubscription(session.user.id);
  const subscription = subscriptionInfo
    ? {
        plan: subscriptionInfo.plan,
        status: subscriptionInfo.status,
        aiCredits: subscriptionInfo.aiCredits,
        aiCreditsUsed: subscriptionInfo.aiCreditsUsed,
        currentPeriodEnd: subscriptionInfo.currentPeriodEnd
          ? subscriptionInfo.currentPeriodEnd.toISOString()
          : null,
      }
    : null;

  return (
    <SettingsContainer
      user={user}
      organization={organization}
      members={allMembers}
      subscription={subscription}
    />
  );
}
