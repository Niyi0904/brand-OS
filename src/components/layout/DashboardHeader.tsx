"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Search,
  X,
  LayoutDashboard,
  Bot,
  Target,
  Calendar,
  FolderOpen,
  BookOpen,
  BarChart3,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { BrandSwitcher } from "@/components/layout/BrandSwitcher";
import { useBrand } from "@/lib/brand-context-provider";

const mobileNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/brands", label: "Brands", icon: Building2 },
  { href: "/dashboard/ai-employees", label: "AI Employees", icon: Bot },
  { href: "/dashboard/campaigns", label: "Campaigns", icon: Target, status: "Soon" },
  { href: "/dashboard/content-planner", label: "Content Planner", icon: Calendar, status: "Soon" },
  { href: "/dashboard/media-library", label: "Media Library", icon: FolderOpen, status: "Soon" },
  { href: "/dashboard/knowledge-base", label: "Knowledge Base", icon: BookOpen, status: "Soon" },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, status: "Soon" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [brandSwitcherOpen, setBrandSwitcherOpen] = useState(false);
  const { brands, currentBrand } = useBrand();

  return (
    <>
      <header className="mos-topbar sticky top-0 z-20 border-b">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center lg:hidden">
            <Image
              src="/logo.png"
              alt="MarketingOS"
              width={47}
              height={24}
              priority
              className="h-6 w-auto"
            />
          </Link>

          <div className="hidden min-w-0 flex-1 items-center gap-3 lg:flex">
            <div className="mos-panel flex h-10 max-w-xl flex-1 items-center gap-3 px-3">
              <Search className="h-4 w-4 text-[var(--color-text-tertiary)] shrink-0" />
              <span className="mos-subtle text-sm">Search brands, employees, campaigns</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentBrand && (
              <span className="mos-pill hidden rounded-full px-3 py-1 text-xs font-medium sm:inline-flex">
                {currentBrand.name}
              </span>
            )}
            <Button variant="default" size="sm" asChild>
              <Link href="/dashboard/brands/new">
                <Building2 className="h-4 w-4" />
                New brand
              </Link>
            </Button>
          </div>
        </div>

        <MobileTopBar
          onMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
          onBrandTrigger={() => setBrandSwitcherOpen((prev) => !prev)}
        />
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="mos-sidebar absolute inset-y-0 left-0 z-50 flex w-[var(--sidebar-width)] flex-col border-r bg-[var(--color-surface-1)]">
            <div className="flex h-full flex-col p-5">
              <div className="mb-4 flex items-center justify-between">
                <Link href="/dashboard" className="flex shrink-0 flex-col gap-0.5">
                  <Image
                    src="/logo.png"
                    alt="MarketingOS"
                    width={63}
                    height={32}
                    priority
                    className="h-8 w-auto"
                  />
                  <div className="mos-subtle text-xs">AI marketing command</div>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)]"
                  aria-label="Close navigation menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {brands.length > 0 && (
                <div className="mb-4">
                  <BrandSwitcher asBottomSheet={false} />
                </div>
              )}

              <nav className="flex-1 overflow-y-auto -mx-5 px-5 space-y-1">
                {mobileNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.status === "Soon" ? "#" : item.href}
                    onClick={() => {
                      if (item.status !== "Soon") setMobileMenuOpen(false);
                    }}
                    className={`group flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      item.status === "Soon"
                        ? "text-[var(--color-text-tertiary)] cursor-not-allowed"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    <span className="flex h-5 w-5 items-center justify-center [&_svg]:h-4 [&_svg]:w-4 text-[var(--color-text-tertiary)]">
                      <item.icon />
                    </span>
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.status && (
                      <span className="mos-subtle rounded-full border px-2 py-0.5 text-[10px] font-medium mos-divider">
                        {item.status}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      )}

      {brandSwitcherOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setBrandSwitcherOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0">
            <BrandSwitcher
              showName={true}
              asBottomSheet={true}
            />
          </div>
        </div>
      )}
    </>
  );
}
