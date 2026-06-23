import Link from "next/link";
import { redirect } from "next/navigation";
import { Bot, Copy, Edit, MessageSquare, MoreVertical, Plus, Sparkles, Trash2 } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardHover, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mos-pill mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium">
            AI employee roster
          </div>
          <h1 className="text-3xl font-semibold leading-tight">AI Employees</h1>
          <p className="mos-muted mt-2 max-w-2xl text-sm leading-6">
            Specialist operators that inherit the selected Brand Brain before every task.
          </p>
        </div>
        <Button className="w-full sm:w-auto" asChild>
          <Link href="/dashboard/ai-employees/new">
            <Plus className="h-4 w-4" />
            Create employee
          </Link>
        </Button>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TeamSignal title="Available specialists" value={`${employees.length}`} detail="Roles enabled" />
        <TeamSignal title="Open work" value={`${totalOpenWork}`} detail="Active conversations" />
        <TeamSignal title="Context coverage" value="92%" detail="Brand Brain ready" />
      </section>

      {employees.length === 0 ? (
        <div className="mos-card flex flex-col items-center gap-4 py-16 text-center">
          <Bot className="h-12 w-12 text-[var(--color-text-tertiary)]" />
          <div>
            <h3 className="text-lg font-semibold">No AI employees yet</h3>
            <p className="mos-muted mt-1 text-sm">Create your first AI employee to start producing marketing work.</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/ai-employees/new">
              <Plus className="h-4 w-4" />
              Create employee
            </Link>
          </Button>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {employees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              id={employee.id}
              slug={employee.slug}
              name={employee.name}
              title={employee.title}
              description={employee.description}
              strength={employee.purpose || "General"}
              workload={`${countsMap.get(employee.id) || 0} conversations`}
              isSystem={employee.isSystem}
              accentColor={employee.accentColor}
            />
          ))}
        </section>
      )}
    </div>
  );
}

type EmployeeCardData = {
  id: string;
  slug: string | null;
  name: string;
  title: string;
  description?: string | null;
  strength: string;
  workload: string;
  isSystem: boolean;
  accentColor: string | null;
};

function EmployeeCard({ id, slug, name, title, description, strength, workload, isSystem, accentColor }: EmployeeCardData) {
  const chatHref = `/dashboard/employees/${slug || id}`;
  const color = accentColor || "var(--brand-accent)";

  return (
    <CardHover>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
              style={{
                backgroundColor: `${color}26`,
                border: `1px solid ${color}40`,
              }}
            >
              <Bot className="h-5 w-5" style={{ color }} />
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate text-lg">{name}</CardTitle>
              <CardDescription className="text-xs">{title}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Open ${name} actions`}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit employee
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              {!isSystem ? (
                <DropdownMenuItem className="text-[var(--color-danger)]">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="mos-muted min-h-[40px] text-sm leading-6">{description || "No description provided."}</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="mos-panel p-3">
            <p className="mos-subtle text-xs">Strength</p>
            <p className="mt-1 truncate text-sm font-medium">{strength}</p>
          </div>
          <div className="mos-panel p-3">
            <p className="mos-subtle text-xs">Open work</p>
            <p className="mt-1 truncate text-sm font-medium">{workload}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isSystem ? <span className="mos-pill rounded-full px-3 py-1 text-xs font-medium">System</span> : null}
          <span className="mos-success-pill rounded-full px-3 py-1 text-xs font-medium">Active</span>
        </div>

        <Button variant="outline" className="w-full" asChild>
          <Link href={chatHref}>
            <MessageSquare className="h-4 w-4" />
            Start task
          </Link>
        </Button>
      </CardContent>
    </CardHover>
  );
}

function TeamSignal({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <CardDescription>{detail}</CardDescription>
        </div>
        <div className="mos-icon-tile flex h-9 w-9 items-center justify-center rounded-lg">
          <Sparkles className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
