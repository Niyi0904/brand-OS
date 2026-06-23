"use client";

import type { ReactNode } from "react";
import { useBrand } from "@/lib/brand-context-provider";
import { useBrandSwitchEffects } from "@/lib/brand-switch-effects";
import { BrandSwitchOverlay } from "@/components/layout/BrandSwitchOverlay";

export function DashboardShell({ children }: { children: ReactNode }) {
  const { currentBrand } = useBrand();

  useBrandSwitchEffects();

  const accent = currentBrand?.accentColour || "#7c9cff";
  const accentStrong = currentBrand?.accentColour
    ? `${currentBrand.accentColour}cc`
    : "#a6bdff";

  return (
    <div
      className="mos-app-shell min-h-screen"
      style={{
        "--brand-accent": accent,
        "--brand-accent-strong": accentStrong,
      } as React.CSSProperties}
    >
      {children}
      <BrandSwitchOverlay />
    </div>
  );
}
