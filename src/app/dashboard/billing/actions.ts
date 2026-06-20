"use server";

import { auth } from "@/lib/auth-edge";
import { prisma } from "@/lib/db";
import { createCheckoutSession } from "@/lib/stripe";
import { getUserSubscription } from "@/lib/subscription";

export type BillingActionState = {
  error?: string;
  url?: string;
};

export async function createCheckoutAction(priceId: string): Promise<BillingActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const allowedPriceIds = [
    process.env.STRIPE_PRICE_ID_PRO,
    process.env.STRIPE_PRICE_ID_ENTERPRISE,
  ].filter(Boolean) as string[];

  if (!allowedPriceIds.includes(priceId)) {
    return { error: "Invalid price selected" };
  }

  const member = await prisma.organizationMember.findFirst({
    where: { userId: session.user.id },
    select: {
      id: true,
      organizationId: true,
      organization: {
        select: {
          id: true,
          subscriptions: {
            select: {
              stripeCustomerId: true,
            },
            take: 1,
          },
        },
      },
    },
  });

  if (!member) {
    return { error: "No organization found" };
  }

  const stripeCustomerId = member.organization.subscriptions[0]?.stripeCustomerId ?? null;

  try {
    const { url } = await createCheckoutSession({
      priceId,
      customerEmail: session.user.email ?? undefined,
      customerId: stripeCustomerId ?? undefined,
      userId: session.user.id,
      organizationId: member.organizationId,
    });

    return { url };
  } catch (error) {
    console.error("Failed to create checkout session:", error);
    return { error: "Failed to start checkout" };
  }
}

export async function getSubscriptionAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  return getUserSubscription(session.user.id);
}