"use client";

import type { ReactNode } from "react";
import { useBrand } from "@/lib/brand-context-provider";
import { useBrandSwitchEffects } from "@/lib/brand-switch-effects";
import { BrandSwitchOverlay } from "@/components/layout/BrandSwitchOverlay";

export function DashboardShell({ children }: { children: ReactNode }) {
  const { currentBrand } = useBrand();

  useBrandSwitchEffects();

  return (
    <div className="mos-app-shell min-h-screen">
      {children}
      <BrandSwitchOverlay />
    </div>
  );
}
