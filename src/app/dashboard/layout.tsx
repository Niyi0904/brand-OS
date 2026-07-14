import type { ReactNode } from "react";
import Image from "next/image";
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
import { getServerActiveBrandId } from "@/lib/brand-server";
import { BrandProvider } from "@/lib/brand-context-provider";
import { BrandProviderInitializer } from "@/components/layout/BrandProviderInitializer";
import { getUserSubscription } from "@/lib/subscription";
import { SubscriptionGuard } from "@/components/layout/SubscriptionGuard";
import { BrandSwitcher } from "@/components/layout/BrandSwitcher";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { NavItem } from "@/components/layout/NavItem";

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

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingCompleted: true, onboardingStep: true },
  });

  if (!user?.onboardingCompleted && (!user?.onboardingStep || user.onboardingStep === "brand")) {
    redirect("/onboarding");
  }

  const subscription = await getUserSubscription(session.user.id);

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

  const activeBrandId = await getServerActiveBrandId();

  return (
    <BrandProvider>
      <BrandProviderInitializer brands={brands} activeBrandId={activeBrandId} />
      <SubscriptionGuard subscription={subscription}>
        <DashboardShell>

          {/* ── Sidebar ──────────────────────────────────────────────────────── */}
          <aside className="mos-sidebar fixed inset-y-0 left-0 z-30 hidden w-[var(--sidebar-width)] lg:flex lg:flex-col">
            <div className="flex h-full flex-col">

              {/* Logo area */}
              <div className="flex h-[56px] shrink-0 items-center px-4 border-b border-[var(--border)]">
                <Link href="/dashboard" className="flex items-center gap-2.5 group">
                  <Image
                    src="/logo.png"
                    alt="MarketingOS"
                    width={130}
                    height={36}
                    style={{
                      height: 28,
                      width: "auto",
                      filter: "brightness(1.15)",
                      opacity: 0.9,
                    }}
                    priority
                  />
                </Link>
              </div>

              {/* Brand Switcher */}
              <div className="shrink-0">
                <BrandSwitcher />
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto py-4 px-3">
                <SidebarSection label="Workspace" items={primaryNavItems} />
                <SidebarSection label="Intelligence" items={intelligenceNavItems} />
                <SidebarSection label="System" items={systemNavItems} />
              </div>

              {/* Brand Brain hint */}
              <div className="shrink-0 mx-3 mb-3">
                <div
                  className="rounded-[var(--radius-md)] p-3.5"
                  style={{
                    background: "linear-gradient(135deg, rgba(212,149,106,0.08), rgba(212,149,106,0.04))",
                    border: "1px solid rgba(212,149,106,0.18)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles
                      className="h-3.5 w-3.5 shrink-0"
                      style={{ color: "var(--accent)" }}
                    />
                    <span className="text-[0.75rem] font-semibold text-[var(--accent-strong)]">
                      Brand Brain
                    </span>
                  </div>
                  <p className="text-[0.7rem] leading-[1.5] text-[var(--text-tertiary)]">
                    Keep your brand data current — every AI employee reads it automatically.
                  </p>
                </div>
              </div>

              {/* User footer */}
              <div className="shrink-0 border-t border-[var(--border)] px-3 py-3">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 rounded-[var(--radius-md)] p-2 transition-colors hover:bg-[var(--surface-3)] group"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--border-strong)] bg-[var(--surface-3)]">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.8125rem] font-medium text-[var(--text-primary)] leading-none mb-0.5">
                      {session.user?.name ?? "Marketing lead"}
                    </p>
                    <p className="truncate text-[0.6875rem] text-[var(--text-tertiary)]">
                      {session.user?.email ?? "Signed in"}
                    </p>
                  </div>
                </Link>
              </div>

            </div>
          </aside>

          {/* ── Main content ─────────────────────────────────────────────────── */}
          <div className="lg:pl-[var(--sidebar-width)]">
            <DashboardHeader />
            <main className="relative z-[1] min-h-[calc(100vh-56px)] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              {children}
            </main>
          </div>

        </DashboardShell>
      </SubscriptionGuard>
    </BrandProvider>
  );
}

/* ── SidebarSection ──────────────────────────────────────────────────────── */
function SidebarSection({ label, items }: { label: string; items: NavItemConfig[] }) {
  return (
    <div className="mb-5">
      <p className="mos-section-label mb-2">{label}</p>
      <nav className="space-y-0.5">
        {items.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>
    </div>
  );
}
