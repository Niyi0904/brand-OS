import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock3,
  MessageSquare,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

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

type ActivityItemProps = {
  title: string;
  description: string;
  icon: ReactNode;
};

const contentItems = [
  { title: "Instagram launch sequence", date: "Tomorrow", status: "Approved" },
  { title: "Founder POV LinkedIn post", date: "Jun 21", status: "Draft" },
  { title: "Newsletter growth offer", date: "Jun 23", status: "Needs review" },
];

export default function DashboardPage() {
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
                  <span className="text-5xl font-semibold">92</span>
                  <span className="mos-muted mb-2 text-sm">/100</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--color-surface-3)]">
                  <div className="h-full w-[92%] rounded-full bg-[var(--brand-accent)]" />
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <ReadinessRow label="Identity" value="Complete" />
                <ReadinessRow label="Voice" value="Strong" />
                <ReadinessRow label="Offers" value="Needs refresh" muted />
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s priorities</CardTitle>
            <CardDescription>High-signal work for the next operating cycle.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <PriorityItem icon={<Target />} title="Finalize campaign brief" meta="Due today" />
            <PriorityItem icon={<MessageSquare />} title="Review AI content draft" meta="3 pending" />
            <PriorityItem icon={<BarChart3 />} title="Check weekly growth trend" meta="+12.4% reach" />
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Active Campaigns" value="3" change="+2 this month" icon={<Target />} />
        <StatCard title="Content Scheduled" value="24" change="+8 this week" icon={<Calendar />} />
        <StatCard title="AI Generations" value="156" change="+32 this week" icon={<Sparkles />} />
        <StatCard title="Brand Health" value="92%" change="+5% this month" icon={<TrendingUp />} />
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

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest meaningful changes across the workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ActivityItem title="Summer sale campaign launched" description="Started 2 hours ago" icon={<Target />} />
            <ActivityItem title="AI generated five Instagram variants" description="Generated 3 hours ago" icon={<Sparkles />} />
            <ActivityItem title="Next week&apos;s content queue updated" description="Scheduled 5 hours ago" icon={<Calendar />} />
            <ActivityItem title="Brand Brain voice notes refined" description="Updated 1 day ago" icon={<MessageSquare />} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Performance overview</CardTitle>
                <CardDescription>Month-to-date signal across active channels.</CardDescription>
              </div>
              <span className="mos-success-pill rounded-full px-3 py-1 text-xs font-medium">Healthy</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-[1fr_180px]">
              <div className="mos-panel flex h-64 items-end gap-2 p-4">
                {[42, 58, 46, 74, 63, 88, 79, 96, 82, 104, 98, 118].map((height, index) => (
                  <div key={index} className="flex flex-1 items-end">
                    <div
                      className="w-full rounded-t-sm bg-[var(--brand-accent)] opacity-80"
                      style={{ height: `${height}px` }}
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <Metric label="Reach" value="48.2K" />
                <Metric label="Engagement" value="8.7%" />
                <Metric label="Leads" value="312" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming content</CardTitle>
          <CardDescription>Scheduled assets that need attention before publishing.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y mos-divider">
            {contentItems.map((item) => (
              <div key={item.title} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="mos-icon-tile flex h-9 w-9 items-center justify-center rounded-lg">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="mos-subtle text-xs">{item.date}</p>
                  </div>
                </div>
                <span className="mos-pill w-fit rounded-full px-3 py-1 text-xs font-medium">{item.status}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
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

function ActivityItem({ title, description, icon }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mos-icon-tile mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="mos-subtle mt-1 text-xs">{description}</p>
      </div>
    </div>
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="mos-panel p-4">
      <p className="mos-subtle text-xs font-medium uppercase tracking-[0.14em]">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
