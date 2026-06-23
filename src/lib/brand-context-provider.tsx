"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";

import { useBrandStore } from "@/lib/stores/brand-store";
export type { Brand } from "@/lib/stores/brand-store";

/**
 * Legacy BrandContextType — kept identical for callers of `useBrand()`.
 * Two new optional members (`isSwitching` and `switchBrand`) are added
 * so existing destructuring like `const { currentBrand } = useBrand()`
 * continues to compile without changes.
 */
interface BrandContextType {
  currentBrand: ReturnType<typeof useBrandStore.getState>["currentBrand"];
  setCurrentBrand: (brand: ReturnType<typeof useBrandStore.getState>["currentBrand"]) => void;
  brands: ReturnType<typeof useBrandStore.getState>["brands"];
  setBrands: (brands: ReturnType<typeof useBrandStore.getState>["brands"]) => void;
  initialize: (brands: ReturnType<typeof useBrandStore.getState>["brands"], currentBrandId: string | null) => void;
  /** True while a brand-switch request is in-flight */
  isSwitching: boolean;
  /**
   * Switch to a different brand — persists to cookie / localStorage,
   * refreshes server components, and fires cache-invalidation effects.
   */
  switchBrand: (brandId: string) => Promise<void>;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const prevBrandIdRef = useRef<string | null>(null);

  // Subscribe directly to Zustand — no re-render storms.
  const currentBrand = useBrandStore((s) => s.currentBrand);
  const brands = useBrandStore((s) => s.brands);
  const isSwitching = useBrandStore((s) => s.isSwitching);
  const setIsSwitching = useBrandStore((s) => s.setIsSwitching);

  const setCurrentBrand = useCallback(
    (brand: ReturnType<typeof useBrandStore.getState>["currentBrand"]) => {
      useBrandStore.getState().setCurrentBrand(brand);
      if (brand) {
        useBrandStore.getState().persistBrandId(brand.id);
      }
    },
    [],
  );

  const setBrands = useCallback(
    (brands: ReturnType<typeof useBrandStore.getState>["brands"]) => {
      useBrandStore.getState().setBrands(brands);
    },
    [],
  );

  const initialize = useCallback(
    (
      brands: ReturnType<typeof useBrandStore.getState>["brands"],
      currentBrandId: string | null,
    ) => {
      useBrandStore.getState().initialize(brands, currentBrandId);
      if (currentBrandId) {
        prevBrandIdRef.current = currentBrandId;
      }
    },
    [],
  );

  const switchBrand = useCallback(
    async (brandId: string) => {
      const store = useBrandStore.getState();
      const brand = store.brands.find((b) => b.id === brandId);
      if (!brand || brand.id === store.currentBrand?.id) return;

      prevBrandIdRef.current = store.currentBrand?.id ?? null;

      setIsSwitching(true);

      try {
        const res = await fetch("/api/brands/switch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brandId }),
        });

        if (!res.ok) throw new Error("Failed to switch brand");

        store.setCurrentBrand(brand);
        store.persistBrandId(brandId);

        router.refresh();
      } catch {
        // Revert on failure
        const revertId = prevBrandIdRef.current;
        if (revertId) {
          const revertBrand = store.brands.find((b) => b.id === revertId);
          if (revertBrand) {
            store.setCurrentBrand(revertBrand);
          }
        }
      } finally {
        setIsSwitching(false);
      }
    },
    [router, setIsSwitching],
  );

  return (
    <BrandContext.Provider
      value={{
        currentBrand,
        setCurrentBrand,
        brands,
        setBrands,
        initialize,
        isSwitching,
        switchBrand,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error("useBrand must be used within a BrandProvider");
  }
  return context;
}
