import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-02-24.acacia",
});

export type CheckoutSessionParams = {
  priceId: string;
  customerEmail?: string;
  customerId?: string;
  userId: string;
  organizationId: string;
};

export async function createCheckoutSession({
  priceId,
  customerEmail,
  customerId,
  userId,
  organizationId,
}: CheckoutSessionParams): Promise<{ url: string }> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId ?? undefined,
    customer_email: customerEmail ?? undefined,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/dashboard/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/dashboard/billing?canceled=true`,
    metadata: {
      userId,
      organizationId,
    },
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  return { url: session.url };
}

export function constructWebhookEvent(
  body: string,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }

  return stripe.webhooks.constructEvent(body, signature, webhookSecret);
}