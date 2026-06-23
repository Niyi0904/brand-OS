"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

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

interface BrandContextType {
  currentBrand: Brand | null;
  setCurrentBrand: (brand: Brand | null) => void;
  brands: Brand[];
  setBrands: (brands: Brand[]) => void;
  initialize: (brands: Brand[], currentBrandId: string | null) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);

  const initialize = useCallback((initialBrands: Brand[], currentBrandId: string | null) => {
    setBrands(initialBrands);
    if (currentBrandId) {
      const found = initialBrands.find((b) => b.id === currentBrandId);
      if (found) setCurrentBrand(found);
    } else if (initialBrands.length > 0) {
      setCurrentBrand(initialBrands[0]);
    }
  }, []);

  return (
    <BrandContext.Provider
      value={{ currentBrand, setCurrentBrand, brands, setBrands, initialize }}
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