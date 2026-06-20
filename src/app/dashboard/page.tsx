import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  MessageSquare,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  icon: ReactNode;
};

type QuickActionCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  signal: string;
};

async function getDashboardStats(userId: string) {
  const [brandCount, campaignCount, conversationCount, brandBrains] = await Promise.all([
    prisma.brand.count({ where: { userId } }),
    prisma.campaign.count({ where: { brand: { userId } } }),
    prisma.conversation.count({ where: { userId } }),
    prisma.brand.findMany({
      where: { userId },
      include: { brandBrain: true },
      take: 10,
    }),
  ]);

  // Compute average brand brain completeness
  let avgCompleteness = 0;
  if (brandBrains.length > 0) {
    const totals = brandBrains.map((b) => {
      if (!b.brandBrain) return 0;
      const fields = [
        b.brandBrain.mission, b.brandBrain.vision, b.brandBrain.values,
        b.brandBrain.targetAudience, b.brandBrain.customerPersonas,
        b.brandBrain.products, b.brandBrain.services,
        b.brandBrain.toneOfVoice, b.brandBrain.brandColors, b.brandBrain.typography,
        b.brandBrain.competitors, b.brandBrain.seoKeywords, b.brandBrain.goals,
        b.brandBrain.preferredPlatforms, b.brandBrain.writingStyle,
        b.brandBrain.marketingStrategy, b.brandBrain.offers, b.brandBrain.businessInfo,
        b.brandBrain.locations, b.brandBrain.faqs, b.brandBrain.brandRules,
      ];
      const filled = fields.filter((f) => f !== null && f !== "").length;
      return Math.round((filled / fields.length) * 100);
    });
    avgCompleteness = Math.round(totals.reduce((a, b) => a + b, 0) / totals.length);
  }

  return {
    brandCount,
    campaignCount,
    conversationCount,
    avgCompleteness,
  };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const stats = await getDashboardStats(session.user.id);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="mos-card overflow-hidden">
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_260px] lg:p-7">
            <div>
              <div className="mos-pill mb-5 inline-flex rounded-full px-3 py-1 text-xs font-medium">
                Marketing command center
              </div>
              <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-[var(--color-text-primary)] sm:text-4xl">
                Run every brand with context, clarity, and AI employees that know the brief.
              </h1>
              <p className="mos-muted mt-4 max-w-2xl text-sm leading-6 sm:text-base">
                Keep Brand Brain data current, route work to the right specialist, and track the next marketing moves from one focused workspace.
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
                <p className="mos-subtle text-xs font-semibold uppercase tracking-[0.18em]">Brand readiness</p>
                <div className="mt-5 flex items-end gap-2">
                  <span className="text-5xl font-semibold">{stats.avgCompleteness}</span>
                  <span className="mos-muted mb-2 text-sm">/100</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--color-surface-3)]">
                  <div
                    className="h-full rounded-full bg-[var(--brand-accent)]"
                    style={{ width: `${stats.avgCompleteness}%` }}
                  />
                </div>
              </div>
              <div className="mt-6 space-y-3">
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

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Active Campaigns" value={`${stats.campaignCount}`} change="Real-time" icon={<Target />} />
        <StatCard title="Brands" value={`${stats.brandCount}`} change="In workspace" icon={<Calendar />} />
        <StatCard title="AI Generations" value={`${stats.conversationCount}`} change="Total sessions" icon={<Sparkles />} />
        <StatCard title="Brand Health" value={`${stats.avgCompleteness}%`} change="Avg completeness" icon={<TrendingUp />} />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <QuickActionCard
          title="Campaign brief"
          description="Turn a business objective into a structured campaign plan."
          icon={<Target />}
          href="/dashboard/campaigns/new"
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
          title="Content calendar"
          description="Plan the next seven days of publish-ready assets."
          icon={<Calendar />}
          href="/dashboard/content-planner"
          signal="Scheduling"
        />
      </section>
    </div>
  );
}

function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <Card className="mos-card-hover">
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
    </Card>
  );
}

function QuickActionCard({ title, description, icon, href, signal }: QuickActionCardProps) {
  return (
    <Card className="mos-card-hover">
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
    </Card>
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
      <CheckCircle2 className="h-4 w-4 text-[var(--color-positive)]" />
    </div>
  );
}

function ReadinessRow({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="mos-muted">{label}</span>
      <span className={muted ? "mos-warning-pill rounded-full px-2 py-0.5 text-xs" : "mos-success-pill rounded-full px-2 py-0.5 text-xs"}>
        {value}
      </span>
    </div>
  );
}