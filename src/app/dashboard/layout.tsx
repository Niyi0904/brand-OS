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
  Sparkles,
  Target,
  User,
} from "lucide-react";

import { auth } from "@/auth";
import { BrandProvider } from "@/lib/brand-context";

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

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <BrandProvider>
      <div className="mos-app-shell min-h-screen">
        <aside className="mos-sidebar fixed inset-y-0 left-0 z-30 hidden w-[var(--sidebar-width)] border-r lg:flex lg:flex-col">
          <div className="flex h-full flex-col p-5">
            <Link href="/dashboard" className="mb-7 flex items-center gap-3">
              <div className="mos-icon-tile flex h-10 w-10 items-center justify-center rounded-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-wide">MarketingOS</div>
                <div className="mos-subtle text-xs">AI marketing command</div>
              </div>
            </Link>

            <SidebarSection label="Workspace" items={primaryNavItems} />
            <SidebarSection label="Intelligence" items={intelligenceNavItems} />

            <div className="mt-auto space-y-4">
              <div className="mos-panel p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Sparkles className="h-4 w-4 text-[var(--brand-accent-strong)]" />
                  Brand Brain status
                </div>
                <p className="mos-muted text-xs leading-5">
                  Context quality improves every employee response. Keep brand strategy, voice, and offer data current.
                </p>
              </div>

              <div className="flex items-center gap-3 border-t pt-4 mos-divider">
                <div className="mos-icon-tile flex h-10 w-10 items-center justify-center rounded-full">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{session.user?.name ?? "Marketing lead"}</p>
                  <p className="mos-subtle truncate text-xs">{session.user?.email ?? "Signed in"}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="lg:pl-[var(--sidebar-width)]">
          <header className="mos-topbar sticky top-0 z-20 border-b">
            <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
                <div className="mos-icon-tile flex h-9 w-9 items-center justify-center rounded-lg">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold">MarketingOS</span>
              </Link>

              <div className="hidden min-w-0 flex-1 items-center gap-3 lg:flex">
                <div className="mos-panel flex h-10 max-w-xl flex-1 items-center gap-3 px-3">
                  <Search className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                  <span className="mos-subtle text-sm">Search brands, employees, campaigns</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="mos-pill hidden rounded-full px-3 py-1 text-xs font-medium sm:inline-flex">
                  M2 Brand Brain
                </span>
                <Link
                  href="/dashboard/brands/new"
                  className="mos-button-primary inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors"
                >
                  <Building2 className="h-4 w-4" />
                  New brand
                </Link>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
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
