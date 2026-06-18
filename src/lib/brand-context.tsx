"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
}

interface BrandContextType {
  currentBrand: Brand | null;
  setCurrentBrand: (brand: Brand | null) => void;
  brands: Brand[];
  setBrands: (brands: Brand[]) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);

  return (
    <BrandContext.Provider
      value={{ currentBrand, setCurrentBrand, brands, setBrands }}
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
