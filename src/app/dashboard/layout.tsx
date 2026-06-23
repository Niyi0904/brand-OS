import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Bot,
  Building2,
  Calendar,
  FolderOpen,
  LayoutDashboard,
  Search,
  Settings,
  Sparkles,
  Target,
  User,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { BrandProvider } from "@/lib/brand-context-provider";
import { BrandProviderInitializer } from "@/components/layout/BrandProviderInitializer";
import { getUserSubscription } from "@/lib/subscription";
import { SubscriptionGuard } from "@/components/layout/SubscriptionGuard";
import { BrandSwitcher } from "@/components/layout/BrandSwitcher";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

type DashboardLayoutProps = {
  children: ReactNode;
};

type NavItemConfig = {
  href: string;
  label: string;
  icon: ReactNode;
  status?: string;
};

const primaryNavItems: NavItemConfig[] = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
  { href: "/dashboard/brands", label: "Brands", icon: <Building2 /> },
  { href: "/dashboard/ai-employees", label: "AI Employees", icon: <Bot /> },
  { href: "/dashboard/campaigns", label: "Campaigns", icon: <Target />, status: "Soon" },
  { href: "/dashboard/content-planner", label: "Content Planner", icon: <Calendar />, status: "Soon" },
  { href: "/dashboard/media-library", label: "Media Library", icon: <FolderOpen />, status: "Soon" },
];

const intelligenceNavItems: NavItemConfig[] = [
  { href: "/dashboard/knowledge-base", label: "Knowledge Base", icon: <BookOpen />, status: "Soon" },
  { href: "/dashboard/analytics", label: "Analytics", icon: <BarChart3 />, status: "Soon" },
  { href: "/dashboard/seo", label: "SEO", icon: <Search />, status: "Soon" },
];

const systemNavItems: NavItemConfig[] = [
  { href: "/dashboard/settings", label: "Settings", icon: <Settings /> },
];

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Onboarding gate: redirect users who haven't created a brand yet
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingCompleted: true, onboardingStep: true },
  });

  if (!user?.onboardingCompleted && (!user?.onboardingStep || user.onboardingStep === "brand")) {
    redirect("/onboarding");
  }

  const subscription = await getUserSubscription(session.user.id);

  // Fetch brands for the BrandProvider initializer
  const brands = await prisma.brand.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      logo: true,
      accentColour: true,
      lastActiveAt: true,
      organization: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <BrandProvider>
      <BrandProviderInitializer brands={brands} />
      <SubscriptionGuard subscription={subscription}>
        <DashboardShell>
        <aside className="mos-sidebar fixed inset-y-0 left-0 z-30 hidden w-[var(--sidebar-width)] border-r lg:flex lg:flex-col">
          <div className="flex h-full flex-col p-5">
            <div className="mb-4">
              <BrandSwitcher />
            </div>

            <Link href="/dashboard" className="mb-7 flex items-center gap-3 shrink-0">
              <div className="mos-icon-tile flex h-10 w-10 items-center justify-center rounded-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-wide">MarketingOS</div>
                <div className="mos-subtle text-xs">AI marketing command</div>
              </div>
            </Link>

            <div className="flex-1 overflow-y-auto scroll-smooth overscroll-contain -mx-5 px-5">
              <SidebarSection label="Workspace" items={primaryNavItems} />
              <SidebarSection label="Intelligence" items={intelligenceNavItems} />
              <SidebarSection label="System" items={systemNavItems} />
            </div>

            <div className="mt-auto space-y-4 shrink-0">
              <div className="mos-panel p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Sparkles className="h-4 w-4 text-[var(--brand-accent-strong)]" />
                  Brand Brain status
                </div>
                <p className="mos-muted text-xs leading-5">
                  Context quality improves every employee response. Keep brand strategy, voice, and offer data current.
                </p>
              </div>

              <Link 
                href="/dashboard/settings"
                className="flex items-center gap-3 border-t pt-4 mos-divider hover:opacity-80 transition-opacity"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface-3)]">
                  {session.user?.image ? (
                    <img src={session.user.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-[var(--color-text-secondary)]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{session.user?.name ?? "Marketing lead"}</p>
                  <p className="mos-subtle truncate text-xs">{session.user?.email ?? "Signed in"}</p>
                </div>
              </Link>
            </div>
          </div>
        </aside>

        <div className="lg:pl-[var(--sidebar-width)]">
          <DashboardHeader />

          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </DashboardShell>
      </SubscriptionGuard>
    </BrandProvider>
  );
}

function SidebarSection({ label, items }: { label: string; items: NavItemConfig[] }) {
  return (
    <div className="mb-6">
      <p className="mos-subtle mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em]">{label}</p>
      <nav className="space-y-1">
        {items.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>
    </div>
  );
}

function NavItem({ item }: { item: NavItemConfig }) {
  return (
    <Link
      href={item.href}
      className="group flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]"
    >
      <span className="flex h-5 w-5 items-center justify-center text-[var(--color-text-tertiary)] transition-colors group-hover:text-[var(--brand-accent-strong)] [&_svg]:h-4 [&_svg]:w-4">
        {item.icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.status ? (
        <span className="mos-subtle rounded-full border px-2 py-0.5 text-[10px] font-medium mos-divider">
          {item.status}
        </span>
      ) : null}
    </Link>
  );
}
