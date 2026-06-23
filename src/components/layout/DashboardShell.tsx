"use client";

import type { ReactNode } from "react";
import { useBrand } from "@/lib/brand-context-provider";
import { useBrandSwitchEffects } from "@/lib/brand-switch-effects";
import { BrandSwitchOverlay } from "@/components/layout/BrandSwitchOverlay";

export function DashboardShell({ children }: { children: ReactNode }) {
  const { currentBrand } = useBrand();

  // Fire side-effects whenever the active brand changes
  useBrandSwitchEffects();

  return (
    <div
      className="mos-app-shell min-h-screen"
      style={{
        "--brand-accent": currentBrand?.accentColour || "#7c6ff7",
        "--brand-accent-strong": currentBrand?.accentColour
          ? `${currentBrand.accentColour}cc`
          : "#c2d1ff",
      } as React.CSSProperties}
    >
      {children}

      {/* Full-screen loading overlay during brand switch */}
      <BrandSwitchOverlay />
    </div>
  );
}
