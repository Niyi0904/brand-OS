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
  Plus,
  Command,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { BrandSwitcher } from "@/components/layout/BrandSwitcher";
import { useBrand } from "@/lib/brand-context-provider";
import { Badge } from "@/components/ui/badge";

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
      {/* ── Topbar ──────────────────────────────────────────────────────── */}
      <header className="mos-topbar sticky top-0 z-20 border-b" style={{ height: 56 }}>
        <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

          {/* Mobile: logo */}
          <Link href="/dashboard" className="flex items-center lg:hidden">
            <Image
              src="/logo.png"
              alt="MarketingOS"
              width={120}
              height={32}
              priority
              style={{ height: 24, width: "auto", filter: "brightness(1.15)", opacity: 0.9 }}
            />
          </Link>

          {/* Desktop: command search bar */}
          <div className="hidden min-w-0 flex-1 items-center lg:flex">
            <button
              type="button"
              className="group flex h-8 w-full max-w-[360px] items-center gap-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-3)] px-3 text-left transition-all duration-[120ms] hover:border-[var(--border-strong)] hover:bg-[var(--surface-4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)]"
              aria-label="Open command palette"
              onClick={() => {/* TODO: open command palette */}}
            >
              <Search className="h-3.5 w-3.5 shrink-0 text-[var(--text-tertiary)]" />
              <span className="flex-1 text-[0.8125rem] text-[var(--text-tertiary)]">
                Search...
              </span>
              <kbd
                className="hidden items-center gap-0.5 rounded border border-[var(--border)] bg-[var(--surface-4)] px-1.5 py-0.5 text-[0.625rem] font-medium text-[var(--text-tertiary)] sm:flex"
                aria-label="Command K"
              >
                <Command className="h-2.5 w-2.5" />K
              </kbd>
            </button>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Active brand pill — desktop only */}
            {currentBrand && (
              <Badge
                variant="accent"
                className="hidden shrink-0 sm:inline-flex"
              >
                {currentBrand.name}
              </Badge>
            )}

            {/* Primary CTA */}
            <Button size="sm" asChild>
              <Link href="/dashboard/brands/new">
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">New brand</span>
                <span className="sm:hidden">New</span>
              </Link>
            </Button>
          </div>
        </div>

        <MobileTopBar
          onMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
          onBrandTrigger={() => setBrandSwitcherOpen((prev) => !prev)}
        />
      </header>

      {/* ── Mobile side drawer ──────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[3px] animate-[mos-fade-in_200ms_cubic-bezier(0.16,1,0.3,1)]"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <aside
            className="absolute inset-y-0 left-0 z-50 flex w-[var(--sidebar-width)] flex-col bg-[var(--surface-1)] border-r border-[var(--border)] animate-[mos-slide-down_280ms_cubic-bezier(0.16,1,0.3,1)]"
          >
            <div className="flex h-full flex-col">

              {/* Header */}
              <div className="flex h-[56px] shrink-0 items-center justify-between border-b border-[var(--border)] px-4">
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Image
                    src="/logo.png"
                    alt="MarketingOS"
                    width={120}
                    height={32}
                    priority
                    style={{ height: 24, width: "auto", filter: "brightness(1.15)", opacity: 0.9 }}
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--surface-3)] hover:text-[var(--text-primary)] transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Brand switcher */}
              {brands.length > 0 && (
                <div className="shrink-0">
                  <BrandSwitcher asBottomSheet={false} />
                </div>
              )}

              {/* Nav */}
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
                {mobileNavItems.map((item) => {
                  const Icon = item.icon;
                  const isDisabled = !!item.status;
                  return (
                    <Link
                      key={item.href}
                      href={isDisabled ? "#" : item.href}
                      onClick={() => {
                        if (!isDisabled) setMobileMenuOpen(false);
                      }}
                      className={[
                        "flex items-center gap-2.5 rounded-[var(--radius-md)] px-2.5 py-2",
                        "text-[0.875rem] font-medium",
                        "transition-colors duration-[100ms]",
                        isDisabled
                          ? "text-[var(--text-tertiary)] cursor-default"
                          : "text-[var(--text-secondary)] hover:bg-[var(--surface-3)] hover:text-[var(--text-primary)]",
                      ].join(" ")}
                    >
                      <span className="[&_svg]:h-[15px] [&_svg]:w-[15px] text-[var(--text-tertiary)]">
                        <Icon />
                      </span>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.status && (
                        <Badge variant="muted" className="text-[0.625rem]">
                          {item.status}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </nav>

            </div>
          </aside>
        </div>
      )}

      {/* ── Mobile brand switcher bottom sheet ──────────────────────────── */}
      {brandSwitcherOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[mos-fade-in_200ms_cubic-bezier(0.16,1,0.3,1)]"
            onClick={() => setBrandSwitcherOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 animate-[mos-slide-up_280ms_cubic-bezier(0.16,1,0.3,1)]">
            <BrandSwitcher showName={true} asBottomSheet={true} />
          </div>
        </div>
      )}
    </>
  );
}
