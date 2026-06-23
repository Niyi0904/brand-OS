"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  X,
} from "lucide-react";

import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { BrandSwitcher } from "@/components/layout/BrandSwitcher";
import { useBrand } from "@/lib/brand-context-provider";

export function DashboardHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [brandSwitcherOpen, setBrandSwitcherOpen] = useState(false);
  const { brands } = useBrand();

  return (
    <>
      <header className="mos-topbar sticky top-0 z-20 border-b">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
            <div className="mos-icon-tile flex h-9 w-9 items-center justify-center rounded-lg">
              <Building2 className="h-4 w-4" />
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

        {/* MobileTopBar - visible only on mobile */}
        <MobileTopBar
          onMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
          onBrandTrigger={() => setBrandSwitcherOpen((prev) => !prev)}
        />
      </header>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="mos-sidebar absolute inset-y-0 left-0 z-50 flex w-[var(--sidebar-width)] flex-col border-r bg-[var(--color-surface-1)]">
            <div className="flex h-full flex-col p-5">
              <div className="mb-4 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-3 shrink-0">
                  <div className="mos-icon-tile flex h-10 w-10 items-center justify-center rounded-lg">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold tracking-wide">MarketingOS</div>
                    <div className="mos-subtle text-xs">AI marketing command</div>
                  </div>
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

              <div className="flex-1 overflow-y-auto scroll-smooth overscroll-contain -mx-5 px-5">
                <p className="mos-subtle mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em]">Quick actions</p>
                <Link
                  href="/dashboard/brands/new"
                  className="flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Building2 className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                  New brand
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Brand switcher bottom sheet on mobile */}
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
