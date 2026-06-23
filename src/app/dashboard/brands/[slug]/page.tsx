import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  Brain,
  Edit,
  Settings2,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeBrandBrainCompleteness } from "@/lib/brand-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type BrandOverviewPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BrandOverviewPage({ params }: BrandOverviewPageProps) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const brand = await prisma.brand.findFirst({
    where: { slug, userId: session.user.id },
    include: {
      brandBrain: true,
      _count: {
        select: {
          campaigns: true,
          contentItems: true,
          conversations: true,
          mediaAssets: true,
        },
      },
    },
  });

  if (!brand) notFound();

  const completeness = computeBrandBrainCompleteness(brand.brandBrain);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild aria-label="Back to brands">
            <Link href="/dashboard/brands">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div className="mos-icon-tile flex h-10 w-10 items-center justify-center rounded-lg">
                  <Brain className="h-5 w-5" />
                </div>
              )}
              <div>
                <div className="mos-pill mb-2 inline-flex rounded-full px-3 py-1 text-xs font-medium">
                  Brand overview
                </div>
                <h1 className="text-3xl font-semibold leading-tight text-[var(--color-text-primary)]">
                  {brand.name}
                </h1>
                <p className="mos-muted mt-1 text-sm">@{brand.slug}</p>
              </div>
            </div>
            {brand.description && (
              <p className="mos-muted mt-3 max-w-2xl text-sm leading-6">
                {brand.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Button asChild variant="outline">
            <Link href={`/dashboard/brands/${slug}/settings`}>
              <Edit className="h-4 w-4" />
              Edit Brand Brain
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/employees`}>
              <Bot className="h-4 w-4" />
              AI Employees
            </Link>
          </Button>
        </div>
      </section>

      {/* Health & Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Brain health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-semibold text-[var(--color-text-primary)]">
                {completeness}
              </span>
              <span className="mos-muted mb-1 text-sm">/100</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-surface-3)]">
              <div
                className="h-full rounded-full bg-[var(--brand-accent)]"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-[var(--color-text-primary)]">
              {brand._count.campaigns}
            </p>
            <CardDescription className="mt-1">Active & drafted</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Content items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-[var(--color-text-primary)]">
              {brand._count.contentItems}
            </p>
            <CardDescription className="mt-1">Across all channels</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-[var(--color-text-primary)]">
              {brand._count.conversations}
            </p>
            <CardDescription className="mt-1">With AI employees</CardDescription>
          </CardContent>
        </Card>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">Quick actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href={`/dashboard/brands/${slug}/settings`}
            className="mos-card-hover group rounded-xl border border-[var(--color-border)] p-5 transition-colors hover:bg-[var(--color-surface-2)]"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-surface-3)] group-hover:bg-[var(--color-surface-2)]">
              <Brain className="h-5 w-5 text-[var(--brand-accent-strong)]" />
            </div>
            <h3 className="mb-1 font-medium text-[var(--color-text-primary)]">Configure Brand Brain</h3>
            <p className="mos-muted text-sm leading-5">
              Set your brand identity, voice, audience, and strategy context.
            </p>
          </Link>

          <Link
            href={`/dashboard/employees`}
            className="mos-card-hover group rounded-xl border border-[var(--color-border)] p-5 transition-colors hover:bg-[var(--color-surface-2)]"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-surface-3)] group-hover:bg-[var(--color-surface-2)]">
              <Bot className="h-5 w-5 text-[var(--brand-accent-strong)]" />
            </div>
            <h3 className="mb-1 font-medium text-[var(--color-text-primary)]">Chat with AI employees</h3>
            <p className="mos-muted text-sm leading-5">
              Your employees read brand context before every response.
            </p>
          </Link>

          <Link
            href={`/dashboard/brands`}
            className="mos-card-hover group rounded-xl border border-[var(--color-border)] p-5 transition-colors hover:bg-[var(--color-surface-2)]"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-surface-3)] group-hover:bg-[var(--color-surface-2)]">
              <Settings2 className="h-5 w-5 text-[var(--brand-accent-strong)]" />
            </div>
            <h3 className="mb-1 font-medium text-[var(--color-text-primary)]">Manage brands</h3>
            <p className="mos-muted text-sm leading-5">
              Switch between brands or create a new one.
            </p>
          </Link>
        </div>
      </section>

      {/* Brand Brain Summary */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Brand Brain summary</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/brands/${slug}/settings`}>
              <Edit className="h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>

        {brand.brandBrain ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <BrainSummaryCard title="Tagline" content={brand.brandBrain.tagline} empty="Not set" />
            <BrainSummaryCard title="Industry" content={brand.brandBrain.industry} empty="Not set" />
            <BrainSummaryCard title="Voice" content={brand.brandBrain.voiceAdjectives} empty="Not set" />
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <Brain className="h-10 w-10 text-[var(--color-text-tertiary)]" />
              <div>
                <p className="font-medium text-[var(--color-text-primary)]">Brand Brain not configured</p>
                <p className="mos-muted mt-1 text-sm">
                  Set up your brand context so AI employees can produce on-brand work.
                </p>
              </div>
              <Button asChild>
                <Link href={`/dashboard/brands/${slug}/settings`}>Configure now</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

function BrainSummaryCard({ title, content, empty }: { title: string; content: string | null | undefined; empty: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[var(--color-text-secondary)]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-[var(--color-text-primary)]">
          {content || <span className="mos-muted italic">{empty}</span>}
        </p>
      </CardContent>
    </Card>
  );
}
