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
  Zap,
  ChevronRight,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerActiveBrandId } from "@/lib/brand-server";
import { computeBrandBrainCompleteness } from "@/lib/brand-utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHover,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/* ─────────────────────────────────────────────────────────────────────────────
   Data
────────────────────────────────────────────────────────────────────────────── */
async function getDashboardStats(userId: string, brandId: string | null) {
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

/* ─────────────────────────────────────────────────────────────────────────────
   Page
────────────────────────────────────────────────────────────────────────────── */
export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const activeBrandId = await getServerActiveBrandId();
  const stats = await getDashboardStats(session.user.id, activeBrandId);

  const userName = session.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-7">

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <section className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[1.5rem] font-semibold tracking-[-0.025em] text-[var(--text-primary)] leading-none mb-1">
            {stats.activeBrand
              ? `${stats.activeBrand.name}`
              : `Good day, ${userName}`}
          </h1>
          <p className="text-[0.8125rem] text-[var(--text-secondary)]">
            {stats.activeBrand
              ? "Marketing command center"
              : "Your marketing command center"}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/brands/new">
              <Plus className="h-3.5 w-3.5" />
              Add brand
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/ai-employees">
              <Sparkles className="h-3.5 w-3.5" />
              Open AI team
            </Link>
          </Button>
        </div>
      </section>

      {/* ── Command center / stats ────────────────────────────────────────── */}
      <section className="grid gap-5 lg:grid-cols-[1fr_280px]">

        {/* Hero card */}
        <div
          className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] p-6 lg:p-8"
          style={{
            background: `
              linear-gradient(135deg, rgba(212,149,106,0.06) 0%, transparent 50%),
              linear-gradient(180deg, rgba(255,255,255,0.028) 0%, transparent 40%),
              var(--surface-2)
            `,
            boxShadow: "var(--shadow-md)",
          }}
        >
          {/* Subtle top-edge highlight */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 30%)",
            }}
          />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_200px]">

            {/* Left: headline + actions */}
            <div>
              <Badge variant="accent" className="mb-5">
                <Zap className="h-2.5 w-2.5" />
                Marketing command center
              </Badge>
              <h2 className="max-w-lg text-[1.5rem] font-semibold leading-[1.25] tracking-[-0.03em] text-[var(--text-primary)] sm:text-[1.875rem]">
                {stats.activeBrand
                  ? `Running ${stats.activeBrand.name} with AI clarity.`
                  : "Run every brand with context, clarity, and AI employees."}
              </h2>
              <p className="mt-3 max-w-md text-[0.875rem] leading-[1.65] text-[var(--text-secondary)]">
                {stats.activeBrand
                  ? `Keep ${stats.activeBrand.name}'s Brand Brain current, route work to specialist AI employees, and track the next marketing moves.`
                  : "Keep Brand Brain data current, route work to the right specialist, and track the next moves from one focused workspace."}
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Button asChild>
                  <Link href="/dashboard/ai-employees">
                    <Sparkles className="h-3.5 w-3.5" />
                    Open AI team
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/brands/new">
                    <Plus className="h-3.5 w-3.5" />
                    Add brand
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: readiness panel */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-3)] p-5">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.10em] text-[var(--text-tertiary)]">
                {stats.activeBrand ? "Brand readiness" : "Workspace readiness"}
              </p>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span
                  className="text-[2.5rem] font-semibold leading-none tracking-[-0.04em] text-[var(--text-primary)]"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {stats.avgCompleteness}
                </span>
                <span className="text-[0.875rem] text-[var(--text-tertiary)] mb-0.5">/100</span>
              </div>

              {/* Progress bar */}
              <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-[var(--surface-4)]">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${stats.avgCompleteness}%`,
                    background: "linear-gradient(90deg, var(--accent), var(--accent-strong))",
                  }}
                />
              </div>

              <div className="mt-5 space-y-2.5">
                <ReadinessRow label="Brands" value={`${stats.brandCount}`} suffix="active" />
                <ReadinessRow label="Campaigns" value={`${stats.campaignCount}`} suffix="running" />
                <ReadinessRow label="AI sessions" value={`${stats.conversationCount}`} suffix="total" />
              </div>
            </div>
          </div>
        </div>

        {/* Today's priorities */}
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s priorities</CardTitle>
            <CardDescription>High-signal work for the next operating cycle.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <PriorityItem
              icon={<Target />}
              title="Finalize campaign brief"
              meta="Due today"
              color="var(--accent)"
            />
            <PriorityItem
              icon={<MessageSquare />}
              title="Review AI content draft"
              meta="3 pending"
              color="var(--ai-action)"
            />
            <PriorityItem
              icon={<BarChart3 />}
              title="Check weekly growth trend"
              meta="Track progress"
              color="var(--positive)"
            />
          </CardContent>
        </Card>
      </section>

      {/* ── Stat cards ───────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          title="Campaigns"
          value={String(stats.campaignCount)}
          label="Active"
          icon={<Target />}
          color="var(--accent)"
        />
        <StatCard
          title="Brands"
          value={String(stats.brandCount)}
          label="In workspace"
          icon={<Building2 />}
          color="var(--positive)"
        />
        <StatCard
          title="AI Sessions"
          value={String(stats.conversationCount)}
          label="Total"
          icon={<Sparkles />}
          color="var(--ai-action)"
        />
        <StatCard
          title="Brand Health"
          value={`${stats.avgCompleteness}%`}
          label="Avg completeness"
          icon={<TrendingUp />}
          color="var(--warning)"
        />
      </section>

      {/* ── Quick actions ────────────────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[0.875rem] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
            Quick actions
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <QuickActionCard
            title="Campaign brief"
            description="Turn a business objective into a structured campaign plan with AI."
            icon={<Target />}
            href="/dashboard/ai-employees"
            label="Strategy"
            color="var(--accent)"
          />
          <QuickActionCard
            title="AI employee room"
            description="Ask specialist AI employees to produce brand-aware work."
            icon={<Bot />}
            href="/dashboard/ai-employees"
            label="Execution"
            color="var(--ai-action)"
          />
          <QuickActionCard
            title="Content planner"
            description="Plan the next cycle of publish-ready assets and campaigns."
            icon={<Calendar />}
            href="/dashboard/ai-employees"
            label="Scheduling"
            color="var(--positive)"
          />
        </div>
      </section>

    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Sub-components
────────────────────────────────────────────────────────────────────────────── */

function StatCard({
  title,
  value,
  label,
  icon,
  color,
}: {
  title: string;
  value: string;
  label: string;
  icon: ReactNode;
  color: string;
}) {
  return (
    <CardHover>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <p className="text-[0.75rem] font-medium text-[var(--text-secondary)]">{title}</p>
          <div
            className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] [&_svg]:h-3.5 [&_svg]:w-3.5"
            style={{
              background: `${color}18`,
              border: `1px solid ${color}30`,
              color,
            }}
          >
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-5">
        <div
          className="text-[2rem] font-semibold leading-none tracking-[-0.04em]"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {value}
        </div>
        <p className="mt-1.5 text-[0.6875rem] text-[var(--text-tertiary)]">{label}</p>
      </CardContent>
    </CardHover>
  );
}

function QuickActionCard({
  title,
  description,
  icon,
  href,
  label,
  color,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  label: string;
  color: string;
}) {
  return (
    <CardHover className="group cursor-pointer">
      <Link href={href} className="block h-full">
        <CardHeader>
          <div className="mb-4 flex items-center justify-between">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] [&_svg]:h-4.5 [&_svg]:w-4.5 [&_svg]:h-[18px] [&_svg]:w-[18px]"
              style={{
                background: `${color}14`,
                border: `1px solid ${color}28`,
                color,
              }}
            >
              {icon}
            </div>
            <span className="text-[0.6875rem] font-medium text-[var(--text-tertiary)]">{label}</span>
          </div>
          <CardTitle className="text-[0.9375rem]">{title}</CardTitle>
          <CardDescription className="mt-1 leading-[1.55]">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1.5 text-[0.8125rem] font-medium text-[var(--text-secondary)] transition-colors group-hover:text-[var(--accent)]">
            Open workflow
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </CardContent>
      </Link>
    </CardHover>
  );
}

function PriorityItem({
  icon,
  title,
  meta,
  color,
}: {
  icon: ReactNode;
  title: string;
  meta: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[var(--radius-md)] p-2.5 transition-colors hover:bg-[var(--surface-3)]">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] [&_svg]:h-3.5 [&_svg]:w-3.5"
        style={{
          background: `${color}14`,
          border: `1px solid ${color}28`,
          color,
        }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.8125rem] font-medium text-[var(--text-primary)]">{title}</p>
        <p className="text-[0.6875rem] text-[var(--text-tertiary)]">{meta}</p>
      </div>
      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[var(--text-tertiary)]" />
    </div>
  );
}

function ReadinessRow({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[0.75rem] text-[var(--text-secondary)]">{label}</span>
      <span className="text-[0.75rem] font-medium text-[var(--text-primary)]">
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{value}</span>
        <span className="ml-1 text-[var(--text-tertiary)] font-normal">{suffix}</span>
      </span>
    </div>
  );
}
