import { Bot, Copy, Edit, MessageSquare, MoreVertical, Plus, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type EmployeeCardProps = {
  name: string;
  title: string;
  description: string;
  strength: string;
  workload: string;
  isSystem?: boolean;
};

const employees: EmployeeCardProps[] = [
  {
    name: "Marketing Director",
    title: "Strategy and campaign leadership",
    description: "Turns business goals into focused GTM plans, campaign briefs, and channel priorities.",
    strength: "Strategy",
    workload: "4 briefs",
    isSystem: true,
  },
  {
    name: "Content Director",
    title: "Editorial strategy and production",
    description: "Builds content angles, calendars, hooks, outlines, and platform-native variants.",
    strength: "Content",
    workload: "12 drafts",
    isSystem: true,
  },
  {
    name: "Creative Director",
    title: "Brand expression and visual direction",
    description: "Shapes campaign concepts, visual systems, creative prompts, and asset direction.",
    strength: "Creative",
    workload: "5 concepts",
    isSystem: true,
  },
  {
    name: "SEO Director",
    title: "Search strategy and optimization",
    description: "Finds keyword opportunities, briefs pages, and improves durable organic growth.",
    strength: "SEO",
    workload: "9 keywords",
    isSystem: true,
  },
  {
    name: "Sales Director",
    title: "Revenue messaging and conversion",
    description: "Refines offers, objections, email flows, scripts, and sales enablement assets.",
    strength: "Revenue",
    workload: "3 offers",
    isSystem: true,
  },
  {
    name: "Analytics Director",
    title: "Measurement and insight",
    description: "Summarizes performance, finds anomalies, and recommends the next experiment.",
    strength: "Insights",
    workload: "7 reports",
    isSystem: true,
  },
];

export default function AIEmployeesPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
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
        <Button>
          <Plus className="h-4 w-4" />
          Create employee
        </Button>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <TeamSignal title="Available specialists" value="6" detail="System roles enabled" />
        <TeamSignal title="Open work" value="40" detail="Drafts, briefs, reports" />
        <TeamSignal title="Context coverage" value="92%" detail="Brand Brain ready" />
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {employees.map((employee) => (
          <EmployeeCard key={employee.name} {...employee} />
        ))}
      </section>
    </div>
  );
}

function EmployeeCard({ name, title, description, strength, workload, isSystem }: EmployeeCardProps) {
  return (
    <Card className="mos-card-hover">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="mos-icon-tile flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
              <Bot className="h-5 w-5" />
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
      <CardContent className="space-y-5">
        <p className="mos-muted min-h-[72px] text-sm leading-6">{description}</p>

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
          <span className="mos-warning-pill rounded-full px-3 py-1 text-xs font-medium">M3 preview</span>
        </div>

        <Button variant="outline" className="w-full">
          <MessageSquare className="h-4 w-4" />
          Start task
        </Button>
      </CardContent>
    </Card>
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
