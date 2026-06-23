"use client";

import { useEffect } from "react";
import { useBrand, Brand } from "@/lib/brand-context-provider";

type BrandProviderInitializerProps = {
  brands: Brand[];
  /** Optional brand ID from the server cookie, passed down from layout. */
  activeBrandId?: string | null;
};

/**
 * Hydrates the Zustand brand store with brands fetched server-side.
 *
 * When `activeBrandId` is provided (read from the cookie server-side)
 * it is used directly — no client-side cookie parsing needed.
 * Falls back to localStorage for environments without SSR (edge cases).
 */
export function BrandProviderInitializer({ brands, activeBrandId }: BrandProviderInitializerProps) {
  const { initialize } = useBrand();

  useEffect(() => {
    let brandId = activeBrandId ?? null;

    // Fallback: parse cookie client-side when SSR didn't run
    if (!brandId) {
      brandId =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("active_brand_id="))
          ?.split("=")[1] ||
        localStorage.getItem("current_brand_id") ||
        null;
    }

    initialize(brands, brandId);
  }, [brands, initialize, activeBrandId]);

  return null;
}
