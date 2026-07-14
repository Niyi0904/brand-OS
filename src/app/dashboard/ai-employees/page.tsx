import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Bot,
  Copy,
  Edit,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Sparkles,
  Trash2,
  Users,
  Zap,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ─────────────────────────────────────────────────────────────────────────────
   Page
────────────────────────────────────────────────────────────────────────────── */
export default async function AIEmployeesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const employees = await prisma.aIEmployee.findMany({
    where: {
      OR: [
        { userId: session.user.id },
        { isSystem: true },
      ],
    },
    orderBy: [
      { isSystem: "desc" },
      { name: "asc" },
    ],
  });

  const employeeIds = employees.map((e) => e.id);
  const conversationCounts = await prisma.conversation.groupBy({
    by: ["employeeId"],
    where: {
      employeeId: { in: employeeIds },
      userId: session.user.id,
    },
    _count: { id: true },
  });

  const countsMap = new Map(conversationCounts.map((c) => [c.employeeId, c._count.id]));
  const totalOpenWork = employees.reduce((sum, e) => sum + (countsMap.get(e.id) || 0), 0);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-7">

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="accent" className="mb-3">
            <Users className="h-2.5 w-2.5" />
            AI employee roster
          </Badge>
          <h1 className="text-[1.5rem] font-semibold tracking-[-0.025em] text-[var(--text-primary)] leading-none mb-2">
            AI Employees
          </h1>
          <p className="max-w-xl text-[0.875rem] leading-[1.6] text-[var(--text-secondary)]">
            Specialist operators that inherit the selected Brand Brain before every task.
            Each employee brings deep expertise to their domain.
          </p>
        </div>
        <Button className="w-full sm:w-auto shrink-0" asChild>
          <Link href="/dashboard/ai-employees/new">
            <Plus className="h-3.5 w-3.5" />
            Create employee
          </Link>
        </Button>
      </section>

      {/* ── Team signals ─────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TeamSignal
          title="Available specialists"
          value={String(employees.length)}
          detail="Roles enabled"
          icon={<Users />}
          color="var(--accent)"
        />
        <TeamSignal
          title="Open work"
          value={String(totalOpenWork)}
          detail="Active conversations"
          icon={<MessageSquare />}
          color="var(--ai-action)"
        />
        <TeamSignal
          title="Context coverage"
          value="92%"
          detail="Brand Brain ready"
          icon={<Zap />}
          color="var(--positive)"
        />
      </section>

      {/* ── Employee cards ────────────────────────────────────────────────── */}
      {employees.length === 0 ? (
        <EmptyState />
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {employees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              id={employee.id}
              slug={employee.slug}
              name={employee.name}
              title={employee.title}
              description={employee.description}
              strength={employee.purpose || "General"}
              workload={countsMap.get(employee.id) || 0}
              isSystem={employee.isSystem}
              accentColor={employee.accentColor}
            />
          ))}
        </section>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TeamSignal
────────────────────────────────────────────────────────────────────────────── */
function TeamSignal({
  title,
  value,
  detail,
  icon,
  color,
}: {
  title: string;
  value: string;
  detail: string;
  icon: ReactNode;
  color: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <p className="text-[0.75rem] font-medium text-[var(--text-secondary)]">{title}</p>
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] [&_svg]:h-3.5 [&_svg]:w-3.5"
            style={{
              background: `${color}16`,
              border: `1px solid ${color}30`,
              color,
            }}
          >
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p
          className="text-[2rem] font-semibold leading-none tracking-[-0.04em] text-[var(--text-primary)]"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {value}
        </p>
        <p className="mt-1 text-[0.6875rem] text-[var(--text-tertiary)]">{detail}</p>
      </CardContent>
    </Card>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   EmployeeCard
────────────────────────────────────────────────────────────────────────────── */
type EmployeeCardData = {
  id: string;
  slug: string | null;
  name: string;
  title: string;
  description?: string | null;
  strength: string;
  workload: number;
  isSystem: boolean;
  accentColor: string | null;
};

function EmployeeCard({
  id,
  slug,
  name,
  title,
  description,
  strength,
  workload,
  isSystem,
  accentColor,
}: EmployeeCardData) {
  const chatHref = `/dashboard/employees/${slug || id}`;
  const color = accentColor || "var(--accent)";

  return (
    <CardHover className="flex flex-col">
      <CardHeader>
        {/* Employee identity row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar tile */}
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)] [&_svg]:h-5 [&_svg]:w-5"
              style={{
                background: `${color}16`,
                border: `1px solid ${color}30`,
                color,
              }}
            >
              <Bot />
            </div>

            {/* Name + title */}
            <div className="min-w-0">
              <CardTitle className="truncate text-[0.9375rem]">{name}</CardTitle>
              <CardDescription className="mt-0.5 truncate">{title}</CardDescription>
            </div>
          </div>

          {/* Actions menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Open ${name} actions`}
                className="shrink-0 mt-0.5"
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit />
                Edit employee
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy />
                Duplicate
              </DropdownMenuItem>
              {!isSystem && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-[var(--danger)] focus:text-[var(--danger)]">
                    <Trash2 />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        {/* Description */}
        <p className="min-h-[48px] text-[0.8125rem] leading-[1.6] text-[var(--text-secondary)]">
          {description || "No description provided."}
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-3)] p-3">
            <p className="text-[0.6875rem] text-[var(--text-tertiary)]">Strength</p>
            <p className="mt-1 truncate text-[0.8125rem] font-medium text-[var(--text-primary)]">
              {strength}
            </p>
          </div>
          <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-3)] p-3">
            <p className="text-[0.6875rem] text-[var(--text-tertiary)]">Open work</p>
            <p
              className="mt-1 text-[0.8125rem] font-medium text-[var(--text-primary)]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {workload} sessions
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          {isSystem && (
            <Badge variant="accent">
              <Sparkles className="h-2.5 w-2.5" />
              System
            </Badge>
          )}
          <Badge variant="positive" dot>
            Active
          </Badge>
        </div>

        {/* CTA */}
        <Button variant="outline" className="w-full mt-auto" asChild>
          <Link href={chatHref}>
            <MessageSquare className="h-3.5 w-3.5" />
            Start task
          </Link>
        </Button>
      </CardContent>
    </CardHover>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   EmptyState
────────────────────────────────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-5 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-2)] py-20 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-xl)] [&_svg]:h-7 [&_svg]:w-7"
        style={{
          background: "var(--accent-subtle)",
          border: "1px solid var(--accent-border)",
          color: "var(--accent)",
        }}
      >
        <Bot />
      </div>
      <div>
        <h3 className="text-[1rem] font-semibold tracking-[-0.015em] text-[var(--text-primary)]">
          No AI employees yet
        </h3>
        <p className="mt-1.5 max-w-xs text-[0.875rem] text-[var(--text-secondary)]">
          Create your first AI employee to start producing brand-aware marketing work.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard/ai-employees/new">
          <Plus className="h-3.5 w-3.5" />
          Create employee
        </Link>
      </Button>
    </div>
  );
}
