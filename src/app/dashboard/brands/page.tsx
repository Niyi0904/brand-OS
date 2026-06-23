import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Building2, CheckCircle2, Edit, MoreVertical, Plus, Trash2 } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeBrandBrainCompleteness } from "@/lib/brand-utils";
import { Button } from "@/components/ui/button";
import { Card, CardHover, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function BrandsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const brands = await prisma.brand.findMany({
    where: { userId: session.user.id },
    include: { brandBrain: true },
    orderBy: { createdAt: "desc" },
  });

  const avgHealth = brands.length > 0
    ? Math.round(brands.reduce((sum, b) => sum + computeBrandBrainCompleteness(b.brandBrain), 0) / brands.length)
    : 0;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mos-pill mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium">
            Brand Brain workspace
          </div>
          <h1 className="text-3xl font-semibold leading-tight">Brands</h1>
          <p className="mos-muted mt-2 max-w-2xl text-sm leading-6">
            Manage the strategic context every AI employee reads before producing marketing work.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/brands/new">
            <Plus className="h-4 w-4" />
            Create brand
          </Link>
        </Button>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard title="Brand Brains" value={`${brands.length}`} detail="All active" />
        <SummaryCard title="Average health" value={`${avgHealth}%`} detail="Brain completeness" />
        <SummaryCard title="AI ready" value="6 roles" detail="Using shared context" />
      </section>

      {brands.length === 0 ? (
        <div className="mos-card flex flex-col items-center gap-4 py-16 text-center">
          <Building2 className="h-12 w-12 text-[var(--color-text-tertiary)]" />
          <div>
            <h3 className="text-lg font-semibold">No brands yet</h3>
            <p className="mos-muted mt-1 text-sm">Create your first brand to start building Brand Brain context.</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/brands/new">
              <Plus className="h-4 w-4" />
              Create brand
            </Link>
          </Button>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {brands.map((brand) => (
            <BrandCard
              key={brand.id}
              id={brand.id}
              name={brand.name}
              slug={brand.slug}
              description={brand.description}
              brandBrain={brand.brandBrain}
              healthScore={computeBrandBrainCompleteness(brand.brandBrain)}
            />
          ))}
        </section>
      )}
    </div>
  );
}

type BrandCardData = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  brandBrain: unknown;
  healthScore: number;
};

function BrandCard({ id, name, slug, description, healthScore }: BrandCardData) {
  return (
    <CardHover>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="mos-icon-tile flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate text-lg">{name}</CardTitle>
              <CardDescription className="text-xs">@{slug}</CardDescription>
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
                <Link href={`/dashboard/brands/${slug}/settings`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Brand Brain
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[var(--color-danger)]">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete brand
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="mos-muted min-h-[40px] text-sm leading-6">{description || "No description yet"}</p>

        <div className="mos-panel p-4">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="mos-muted">Health score</span>
            <span className="font-semibold">{healthScore}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-surface-3)]">
            <div className="h-full rounded-full bg-[var(--brand-accent)]" style={{ width: `${healthScore}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="mos-success-pill inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Active
          </span>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/brands/${slug}`}>
              Open
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </CardHover>
  );
}

function SummaryCard({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardDescription>{detail}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
