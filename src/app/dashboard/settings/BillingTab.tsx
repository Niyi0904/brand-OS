"use client";

import { useState } from "react";
import { AlertCircle, Check, ExternalLink, Loader2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type SubscriptionData } from "./common";

interface BillingTabProps {
  subscription: SubscriptionData | null;
}

export function BillingTab({ subscription }: BillingTabProps) {
  const [stripePortalPending, setStripePortalPending] = useState(false);

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Billing Inactive</CardTitle>
          <CardDescription>Could not retrieve subscription settings.</CardDescription>
        </CardHeader>
        <CardContent className="py-6 text-center">
          <AlertCircle className="mx-auto mb-2 h-8 w-8 text-yellow-400" />
          <p className="text-sm text-[var(--color-text-secondary)]">
            Please ensure Stripe environment credentials are set up.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Plan Tier</CardTitle>
            <CardDescription>Status and credit usage for this organization.</CardDescription>
          </div>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
              subscription.status === "ACTIVE"
                ? "border-green-500/20 bg-green-500/10 text-green-400"
                : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
            }`}
          >
            {subscription.status}
          </span>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--color-text-tertiary)]">Plan Name</p>
              <h4 className="mt-1 text-3xl font-extrabold text-[var(--brand-accent-strong)]">
                {subscription.plan}
              </h4>
            </div>
            {subscription.currentPeriodEnd && (
              <div className="text-sm">
                <span className="block mos-muted sm:text-right">Renews On</span>
                <span className="mt-0.5 block font-semibold sm:text-right">
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2 border-t border-[var(--color-border)] pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-[var(--color-text-secondary)]">AI Credit Allotment</span>
              <span className="font-semibold">
                {subscription.aiCreditsUsed.toLocaleString()} / {subscription.aiCredits.toLocaleString()} used
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface-3)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--brand-accent)] to-[#4d72fc] transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(0, (subscription.aiCreditsUsed / subscription.aiCredits) * 100))}%`,
                }}
              />
            </div>
            <p className="text-xs text-[var(--color-text-tertiary)]">
              Credits recharge on your billing renewal date. 1 credit equals 1 generated asset or AI chat message.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 border-t border-[var(--color-border)] bg-[var(--color-surface-2)]/20 py-4 sm:flex-row sm:justify-between">
          <p className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <ShieldCheck className="h-4 w-4 text-[var(--color-positive)]" /> Secure Stripe checkout & billing portal.
          </p>
          <form action="/api/stripe/create-checkout" method="POST">
            <Button
              type="submit"
              variant="outline"
              size="sm"
              onClick={() => setStripePortalPending(true)}
              disabled={stripePortalPending}
            >
              {stripePortalPending ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" /> Accessing...
                </>
              ) : (
                <>
                  Manage Subscription <ExternalLink className="h-3 w-3" />
                </>
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>

      {subscription.plan === "FREE" && <PricingCards />}
    </div>
  );
}

function PricingCards() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Upgrade Options</CardTitle>
        <CardDescription>Upgrade to unlock higher credit thresholds and more AI Employees.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col justify-between space-y-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5">
          <div>
            <span className="mos-pill rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              RECOMMENDED
            </span>
            <h4 className="mt-2 text-lg font-bold">MarketingOS PRO</h4>
            <p className="mt-1 text-3xl font-extrabold">
              $29<span className="text-sm font-normal text-[var(--color-text-secondary)]">/mo</span>
            </p>
            <p className="mos-muted mt-2 text-xs leading-5">
              For startup founders, boutique marketing agencies, and scaling brands.
            </p>
            <ul className="mt-4 space-y-2 text-xs">
              <FeatureItem text="200,000 AI Credits/mo" />
              <FeatureItem text="Unlimited Brand Brains" />
              <FeatureItem text="Custom AI Employee generation" />
              <FeatureItem text="Direct platform scheduling (Slack, X)" />
            </ul>
          </div>
          <form action="/api/stripe/create-checkout" method="POST">
            <input type="hidden" name="priceId" value={process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || "pro_plan"} />
            <Button type="submit" className="mt-2 w-full">
              Upgrade to Pro
            </Button>
          </form>
        </div>

        <div className="flex flex-col justify-between space-y-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5">
          <div>
            <span className="rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-tertiary)]">
              SCALE
            </span>
            <h4 className="mt-2 text-lg font-bold">MarketingOS Enterprise</h4>
            <p className="mt-1 text-3xl font-extrabold">
              $99<span className="text-sm font-normal text-[var(--color-text-secondary)]">/mo</span>
            </p>
            <p className="mos-muted mt-2 text-xs leading-5">
              For multi-brand organizations, corporate agencies, and high volume teams.
            </p>
            <ul className="mt-4 space-y-2 text-xs">
              <FeatureItem text="1,000,000 AI Credits/mo" />
              <FeatureItem text="Dedicated custom-trained models" />
              <FeatureItem text="Premium API access integrations" />
              <FeatureItem text="24/7 dedicated support representative" />
            </ul>
          </div>
          <form action="/api/stripe/create-checkout" method="POST">
            <input
              type="hidden"
              name="priceId"
              value={process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE || "enterprise_plan"}
            />
            <Button type="submit" variant="secondary" className="mt-2 w-full">
              Contact Enterprise
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2">
      <Check className="h-3.5 w-3.5 text-[var(--color-positive)]" />
      {text}
    </li>
  );
}
