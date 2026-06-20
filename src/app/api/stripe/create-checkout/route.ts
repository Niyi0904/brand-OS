import { NextResponse } from "next/server";
import { auth } from "@/lib/auth-edge";
import { prisma } from "@/lib/db";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { priceId } = body as { priceId: string };

    if (!priceId) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
    }

    const allowedPriceIds = [
      process.env.STRIPE_PRICE_ID_PRO,
      process.env.STRIPE_PRICE_ID_ENTERPRISE,
    ].filter(Boolean) as string[];

    if (!allowedPriceIds.includes(priceId)) {
      return NextResponse.json({ error: "Invalid price ID" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        email: true,
        organizations: {
          select: {
            id: true,
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
        },
      },
    });

    if (!user || user.organizations.length === 0) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    const orgMember = user.organizations[0];
    const organization = orgMember.organization;
    const stripeCustomerId = organization.subscriptions?.[0]?.stripeCustomerId;

    const { url } = await createCheckoutSession({
      priceId,
      customerEmail: user.email ?? undefined,
      customerId: stripeCustomerId ?? undefined,
      userId: session.user.id,
      organizationId: organization.id,
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Failed to create checkout session:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
