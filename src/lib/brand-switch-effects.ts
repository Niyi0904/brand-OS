"use client";

import { useEffect, useRef } from "react";
import { useBrandStore } from "@/lib/stores/brand-store";

const BRAND_SWITCHED_EVENT = "brandswitched";

/**
 * Fires side-effects whenever the active brand changes:
 *  - Dispatches a custom `brandswitched` DOM event so any component
 *    or hook can listen and reset its local state / caches.
 *  - Updates `document.title` to reflect the active brand.
 *
 * Call this once near the root of the app (e.g. inside DashboardShell).
 */
export function useBrandSwitchEffects() {
  const currentBrand = useBrandStore((s) => s.currentBrand);
  const lastSwitchedAt = useBrandStore((s) => s.lastSwitchedAt);
  const prevRef = useRef(currentBrand?.id);

  useEffect(() => {
    const brandId = currentBrand?.id;
    if (!brandId || brandId === prevRef.current) return;

    prevRef.current = brandId;

    // ---- Dispatch a global event ----
    window.dispatchEvent(
      new CustomEvent(BRAND_SWITCHED_EVENT, {
        detail: { brandId, brand: currentBrand, switchedAt: lastSwitchedAt },
      }),
    );

    // ---- Update document title ----
    document.title = currentBrand
      ? `${currentBrand.name} — MarketingOS`
      : "MarketingOS";
  }, [currentBrand, lastSwitchedAt]);
}

/**
 * Returns a ref that is incremented every time a brand switch occurs.
 * Handy for forcing key-based re-mounts of child trees.
 */
export function useBrandSwitchKey(): number {
  return useBrandStore((s) => s.lastSwitchedAt);
}

/**
 * React Query cache key factory scoped to the active brand.
 * Returns a query-key prefix that changes when the brand does.
 */
export function brandQueryKey(...parts: (string | number | undefined)[]) {
  const brandId = useBrandStore.getState().currentBrand?.id;
  return ["brand", brandId, ...parts].filter(Boolean);
}
