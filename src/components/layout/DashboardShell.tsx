"use client";

import type { ReactNode } from "react";
import { useBrand } from "@/lib/brand-context-provider";

export function DashboardShell({ children }: { children: ReactNode }) {
  const { currentBrand } = useBrand();

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
    </div>
  );
}
