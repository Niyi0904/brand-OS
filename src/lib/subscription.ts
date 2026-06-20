import { prisma } from "@/lib/db";
import type { SubscriptionPlan, SubscriptionStatus } from "@prisma/client";

export type SubscriptionInfo = {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  aiCredits: number;
  aiCreditsUsed: number;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
};

const PLAN_HIERARCHY: Record<SubscriptionPlan, number> = {
  FREE: 0,
  PRO: 1,
  ENTERPRISE: 2,
};

export async function getUserSubscription(userId: string): Promise<SubscriptionInfo | null> {
  const membership = await prisma.organizationMember.findFirst({
    where: { userId },
    include: {
      organization: {
        include: {
          subscriptions: true,
        },
      },
    },
  });

  if (!membership) {
    return null;
  }

  const subscriptions = membership.organization.subscriptions;
  const subscription = subscriptions.length > 0 ? subscriptions[0] : null;

  if (!subscription) {
    return {
      id: "",
      plan: "FREE",
      status: "ACTIVE",
      aiCredits: 0,
      aiCreditsUsed: 0,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    };
  }

  return {
    id: subscription.id,
    plan: subscription.plan,
    status: subscription.status,
    aiCredits: subscription.aiCredits,
    aiCreditsUsed: subscription.aiCreditsUsed,
    currentPeriodEnd: subscription.currentPeriodEnd,
    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
  };
}

export function hasFeatureAccess(
  subscription: SubscriptionInfo | null,
  requiredPlan: SubscriptionPlan
): boolean {
  if (!subscription) return false;
  return PLAN_HIERARCHY[subscription.plan] >= PLAN_HIERARCHY[requiredPlan];
}

export function isSubscriptionActive(subscription: SubscriptionInfo | null): boolean {
  if (!subscription) return false;
  return subscription.status === "ACTIVE" || subscription.status === "TRIALING";
}

export function isSubscriptionPastDue(subscription: SubscriptionInfo | null): boolean {
  if (!subscription) return false;
  return subscription.status === "PAST_DUE";
}

export function isSubscriptionCancelled(subscription: SubscriptionInfo | null): boolean {
  if (!subscription) return false;
  return subscription.status === "CANCELLED";
}