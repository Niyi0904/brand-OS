import { Suspense } from "react";
import { getSubscriptionAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function SubscriptionStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: "bg-green-500/10 text-green-400 border-green-500/20",
    TRIALING: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    PAST_DUE: "bg-red-500/10 text-red-400 border-red-500/20",
    CANCELLED: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? styles.CANCELLED}`}>
      {status}
    </span>
  );
}

async function BillingContent() {
  const subscription = await getSubscriptionAction();

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No subscription found</CardTitle>
          <CardDescription>You are currently on the Free plan. Upgrade to unlock more features.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Current Plan</CardTitle>
            <p className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">{subscription.plan}</p>
          </div>
          <SubscriptionStatusBadge status={subscription.status} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[var(--color-text-secondary)]">AI Credits</p>
              <p className="mt-1 text-[var(--color-text-primary)]">
                {subscription.aiCreditsUsed} / {subscription.aiCredits}
              </p>
            </div>
            <div>
              <p className="text-[var(--color-text-secondary)]">Current Period Ends</p>
              <p className="mt-1 text-[var(--color-text-primary)]">
                {subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>

          {subscription.cancelAtPeriodEnd && (
            <p className="text-sm text-yellow-400">Your subscription will cancel at the end of the current period.</p>
          )}

          {(subscription.status === "PAST_DUE" || subscription.status === "CANCELLED") && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
              <h3 className="text-sm font-medium text-red-400">Payment Issue</h3>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {subscription.status === "PAST_DUE"
                  ? "Your payment failed. Please update your payment method to restore access."
                  : "Your subscription has been cancelled. Resubscribe to regain access."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {subscription.plan === "FREE" && (
        <Card>
          <CardHeader>
            <CardTitle>Upgrade your plan</CardTitle>
            <CardDescription>Get access to more AI credits, advanced features, and priority support.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <PlanCard name="Pro" price="$29/mo" description="For growing teams" priceId={process.env.STRIPE_PRICE_ID_PRO ?? ""} />
            <PlanCard name="Enterprise" price="$99/mo" description="For large organizations" priceId={process.env.STRIPE_PRICE_ID_ENTERPRISE ?? ""} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PlanCard({ name, price, description, priceId }: { name: string; price: string; description: string; priceId: string }) {
  if (!priceId) return null;

  return (
    <form action="/api/stripe/create-checkout" method="POST" className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
      <h4 className="font-semibold text-[var(--color-text-primary)]">{name}</h4>
      <p className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">{price}</p>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{description}</p>
      <input type="hidden" name="priceId" value={priceId} />
      <Button type="submit" className="mt-4 w-full">
        Upgrade to {name}
      </Button>
    </form>
  );
}

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Billing</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Manage your subscription and payment details.</p>
      </div>
      <Suspense fallback={<div className="text-sm text-[var(--color-text-secondary)]">Loading subscription...</div>}>
        <BillingContent />
      </Suspense>
    </div>
  );
}
