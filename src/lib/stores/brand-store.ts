"use client";

import { create } from "zustand";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  accentColour?: string | null;
  lastActiveAt?: Date | string | null;
  organization?: { name: string } | null;
}

interface BrandStore {
  currentBrand: Brand | null;
  brands: Brand[];
  isSwitching: boolean;
  lastSwitchedAt: number;

  setCurrentBrand: (brand: Brand | null) => void;
  setBrands: (brands: Brand[]) => void;
  setIsSwitching: (isSwitching: boolean) => void;
  initialize: (brands: Brand[], currentBrandId: string | null) => void;
  persistBrandId: (brandId: string) => void;
}

export const useBrandStore = create<BrandStore>((set, get) => ({
  currentBrand: null,
  brands: [],
  isSwitching: false,
  lastSwitchedAt: 0,

  setCurrentBrand: (brand) =>
    set({ currentBrand: brand, lastSwitchedAt: Date.now() }),

  setBrands: (brands) => set({ brands }),

  setIsSwitching: (isSwitching) => set({ isSwitching }),

  initialize: (brands, currentBrandId) => {
    if (currentBrandId) {
      const found = brands.find((b) => b.id === currentBrandId);
      set({
        brands,
        currentBrand: found || (brands.length > 0 ? brands[0] : null),
        lastSwitchedAt: Date.now(),
      });
    } else if (brands.length > 0) {
      set({
        brands,
        currentBrand: brands[0],
        lastSwitchedAt: Date.now(),
      });
    } else {
      set({ brands });
    }
  },

  persistBrandId: (brandId) => {
    try {
      localStorage.setItem("current_brand_id", brandId);
      document.cookie = `active_brand_id=${brandId};path=/;max-age=${60 * 60 * 24 * 30};SameSite=Lax`;
    } catch {}
  },
}));
