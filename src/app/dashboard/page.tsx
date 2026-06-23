import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  BarChart3,
  Bot,
  Building2,
  Calendar,
  MessageSquare,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerActiveBrandId } from "@/lib/brand-server";
import { computeBrandBrainCompleteness } from "@/lib/brand-utils";
import { Button } from "@/components/ui/button";
import { Card, CardHover, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

async function getDashboardStats(userId: string, brandId: string | null) {
  const brandFilter = brandId ? { brandId } : { brand: { userId } };
  const brandWhere = brandId ? { id: brandId, userId } : { userId };

  const [activeBrand, brandCount, campaignCount, conversationCount, brandBrains] = await Promise.all([
    brandId
      ? prisma.brand.findUnique({
          where: { id: brandId },
          select: { id: true, name: true, slug: true, logo: true, accentColour: true },
        })
      : Promise.resolve(null),
    prisma.brand.count({ where: { userId } }),
    brandId
      ? prisma.campaign.count({ where: { brandId } })
      : prisma.campaign.count({ where: { brand: { userId } } }),
    brandId
      ? prisma.conversation.count({ where: { brandId } })
      : prisma.conversation.count({ where: { userId } }),
    prisma.brand.findMany({
      where: brandWhere,
      include: { brandBrain: true },
      take: 10,
    }),
  ]);

  let avgCompleteness = 0;
  if (brandBrains.length > 0) {
    const totals = brandBrains.map((b) => computeBrandBrainCompleteness(b.brandBrain));
    avgCompleteness = Math.round(totals.reduce((a, b) => a + b, 0) / totals.length);
  }

  return { activeBrand, brandCount, campaignCount, conversationCount, avgCompleteness };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const activeBrandId = await getServerActiveBrandId();
  const stats = await getDashboardStats(session.user.id, activeBrandId);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      {/* Active-brand header */}
      {stats.activeBrand ? (
        <section className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{
              background: stats.activeBrand.accentColour
                ? `${stats.activeBrand.accentColour}22`
                : "var(--color-surface-3)",
            }}
          >
            <Building2
              className="h-5 w-5"
              style={{ color: stats.activeBrand.accentColour ?? "var(--brand-accent)" }}
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              {stats.activeBrand.name}
            </h2>
            <p className="mos-muted text-xs">Active workspace</p>
          </div>
        </section>
      ) : null}

      {/* Command center */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="mos-card overflow-hidden">
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_240px] lg:p-8">
            <div>
              <div className="mos-pill mb-5 inline-flex rounded-full px-3 py-1 text-xs font-medium">
                Marketing command center
              </div>
              <h1 className="max-w-3xl text-2xl font-semibold leading-tight text-[var(--color-text-primary)] sm:text-3xl">
                {stats.activeBrand
                  ? `Running ${stats.activeBrand.name} with AI clarity.`
                  : "Run every brand with context, clarity, and AI employees."}
              </h1>
              <p className="mos-muted mt-4 max-w-xl text-sm leading-6">
                {stats.activeBrand
                  ? `Keep ${stats.activeBrand.name}'s Brand Brain current, route work to specialist AI employees, and track the next marketing moves.`
                  : "Keep Brand Brain data current, route work to the right specialist, and track the next moves from one focused workspace."}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/dashboard/ai-employees">
                    <Sparkles className="h-4 w-4" />
                    Open AI team
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/brands/new">
                    <Plus className="h-4 w-4" />
                    Add brand
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mos-panel flex flex-col justify-between p-5">
              <div>
                <p className="mos-subtle text-xs font-semibold uppercase tracking-[0.12em]">
                  {stats.activeBrand ? "Brand readiness" : "Workspace readiness"}
                </p>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-4xl font-semibold">{stats.avgCompleteness}</span>
                  <span className="mos-muted mb-1 text-sm">/100</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-surface-3)]">
                  <div
                    className="h-full rounded-full bg-[var(--brand-accent)]"
                    style={{ width: `${stats.avgCompleteness}%` }}
                  />
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <ReadinessRow label="Brands" value={`${stats.brandCount} active`} />
                <ReadinessRow label="Campaigns" value={`${stats.campaignCount} running`} />
                <ReadinessRow label="AI sessions" value={`${stats.conversationCount} total`} />
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Today's priorities</CardTitle>
            <CardDescription>High-signal work for the next operating cycle.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <PriorityItem icon={<Target />} title="Finalize campaign brief" meta="Due today" />
            <PriorityItem icon={<MessageSquare />} title="Review AI content draft" meta="3 pending" />
            <PriorityItem icon={<BarChart3 />} title="Check weekly growth trend" meta="Track progress" />
          </CardContent>
        </Card>
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Campaigns" value={`${stats.campaignCount}`} change="Real-time" icon={<Target />} />
        <StatCard title="Brands" value={`${stats.brandCount}`} change="In workspace" icon={<Building2 />} />
        <StatCard title="AI Generations" value={`${stats.conversationCount}`} change="Total sessions" icon={<Sparkles />} />
        <StatCard title="Brand Health" value={`${stats.avgCompleteness}%`} change="Avg completeness" icon={<TrendingUp />} />
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <QuickActionCard
          title="Campaign brief"
          description="Turn a business objective into a structured campaign plan."
          icon={<Target />}
          href="/dashboard/ai-employees"
          signal="Strategy"
        />
        <QuickActionCard
          title="AI employee room"
          description="Ask specialist AI employees to produce brand-aware work."
          icon={<Sparkles />}
          href="/dashboard/ai-employees"
          signal="Execution"
        />
        <QuickActionCard
          title="Content planner"
          description="Plan the next cycle of publish-ready assets and campaigns."
          icon={<Calendar />}
          href="/dashboard/ai-employees"
          signal="Scheduling"
        />
      </section>
    </div>
  );
}

function StatCard({ title, value, change, icon }: { title: string; value: string; change: string; icon: ReactNode }) {
  return (
    <CardHover>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="mos-icon-tile flex h-9 w-9 items-center justify-center rounded-lg [&_svg]:h-4 [&_svg]:w-4">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
        <p className="mos-muted mt-2 flex items-center gap-1 text-xs">
          <ArrowUpRight className="h-3.5 w-3.5 text-[var(--color-positive)]" />
          {change}
        </p>
      </CardContent>
    </CardHover>
  );
}

function QuickActionCard({ title, description, icon, href, signal }: { title: string; description: string; icon: ReactNode; href: string; signal: string }) {
  return (
    <CardHover>
      <CardHeader>
        <div className="mb-4 flex items-center justify-between">
          <div className="mos-icon-tile flex h-11 w-11 items-center justify-center rounded-lg [&_svg]:h-5 [&_svg]:w-5">
            {icon}
          </div>
          <span className="mos-subtle text-xs font-medium">{signal}</span>
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full" asChild>
          <Link href={href}>
            Open workflow
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </CardHover>
  );
}

function PriorityItem({ icon, title, meta }: { icon: ReactNode; title: string; meta: string }) {
  return (
    <div className="mos-panel flex items-center gap-3 p-3">
      <div className="mos-icon-tile flex h-9 w-9 items-center justify-center rounded-lg [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="mos-subtle text-xs">{meta}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-[var(--color-positive)]" />
    </div>
  );
}

function ReadinessRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="mos-muted">{label}</span>
      <span className="mos-success-pill rounded-full px-2 py-0.5 text-xs">{value}</span>
    </div>
  );
}
