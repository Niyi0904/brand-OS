"use client";

import { Menu } from "lucide-react";
import { useBrand } from "@/lib/brand-context-provider";
import { BrandAvatar } from "@/components/ui/brand-avatar";

type MobileTopBarProps = {
  onMenuToggle: () => void;
  onBrandTrigger: () => void;
};

export function MobileTopBar({ onMenuToggle, onBrandTrigger }: MobileTopBarProps) {
  const { currentBrand } = useBrand();

  return (
    <div className="flex items-center justify-between px-4 py-3 lg:hidden">
      <button
        type="button"
        onClick={onMenuToggle}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)] transition-colors"
        aria-label="Toggle navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {currentBrand && (
        <button
          type="button"
          onClick={onBrandTrigger}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[var(--color-surface-2)] transition-colors"
          aria-label={`Active brand: ${currentBrand.name}. Tap to switch.`}
        >
          <BrandAvatar brand={currentBrand} size={32} />
        </button>
      )}
    </div>
  );
}
