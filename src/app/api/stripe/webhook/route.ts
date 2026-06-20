import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { constructWebhookEvent } from "@/lib/stripe";
import { sendPaymentFailedEmail } from "@/lib/email";
import type { SubscriptionStatus } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature") ?? "";

    const event = constructWebhookEvent(body, signature);

    const session = event.data.object as unknown as Record<string, unknown>;

    switch (event.type) {
      case "checkout.session.completed": {
        const metadata = session.metadata as Record<string, string> | undefined;
        const organizationId = metadata?.organizationId;
        const customerId = session.customer as string | undefined;
        const subscriptionId = session.subscription as string | undefined;
        const lineItems = session.line_items as { data: { price: { id: string } }[] } | undefined;
        const priceId = lineItems?.data[0]?.price?.id;

        if (!organizationId || !customerId || !subscriptionId || !priceId) {
          console.error("Missing required fields in checkout.session.completed", { organizationId, customerId, subscriptionId, priceId });
          break;
        }

        const plan = mapPriceIdToPlan(priceId);

        await prisma.subscription.upsert({
          where: { organizationId },
          create: {
            organizationId,
            plan,
            status: "ACTIVE",
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
          },
          update: {
            plan,
            status: "ACTIVE",
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
          },
        });

        break;
      }

      case "customer.subscription.updated": {
        const subscriptionId = session.id as string | undefined;
        const status = session.status as string | undefined;
        const currentPeriodStart = session.current_period_start as number | undefined;
        const currentPeriodEnd = session.current_period_end as number | undefined;
        const cancelAtPeriodEnd = session.cancel_at_period_end as boolean | undefined;

        if (!subscriptionId) {
          console.error("Missing subscription id in customer.subscription.updated");
          break;
        }

        const mappedStatus = mapStripeStatus(status);

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            status: mappedStatus,
            currentPeriodStart: currentPeriodStart ? new Date(currentPeriodStart * 1000) : undefined,
            currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : undefined,
            cancelAtPeriodEnd: cancelAtPeriodEnd ?? false,
          },
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscriptionId = session.id as string | undefined;

        if (!subscriptionId) {
          console.error("Missing subscription id in customer.subscription.deleted");
          break;
        }

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: { status: "CANCELLED" },
        });

        break;
      }

      case "invoice.payment_failed": {
        const subscriptionId = (session.subscription as string | undefined);

        if (!subscriptionId) {
          console.error("Missing subscription id in invoice.payment_failed");
          break;
        }

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: { status: "PAST_DUE" },
        });

        const subscription = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscriptionId },
          include: { organization: { select: { name: true } } },
        });

        if (subscription) {
          const owner = await prisma.organizationMember.findFirst({
            where: { organizationId: subscription.organizationId, role: "OWNER" },
            include: { user: { select: { email: true, name: true } } },
          });

          if (owner?.user.email) {
            try {
              await sendPaymentFailedEmail({
                to: owner.user.email,
                organizationName: subscription.organization.name,
              });
            } catch (emailError) {
              console.error("Failed to send payment failed email:", emailError);
            }
          }
        }

        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 });
  }
}

function mapPriceIdToPlan(priceId: string): "FREE" | "PRO" | "ENTERPRISE" {
  if (priceId === process.env.STRIPE_PRICE_ID_PRO) return "PRO";
  if (priceId === process.env.STRIPE_PRICE_ID_ENTERPRISE) return "ENTERPRISE";
  return "FREE";
}

function mapStripeStatus(
  stripeStatus?: string
): SubscriptionStatus {
  switch (stripeStatus) {
    case "active":
      return "ACTIVE";
    case "canceled":
      return "CANCELLED";
    case "past_due":
      return "PAST_DUE";
    case "trialing":
      return "TRIALING";
    default:
      return "ACTIVE";
  }
}