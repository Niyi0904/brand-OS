"use client";

import { useEffect } from "react";
import { useBrand, Brand } from "@/lib/brand-context-provider";

type BrandProviderInitializerProps = {
  brands: Brand[];
};

export function BrandProviderInitializer({ brands }: BrandProviderInitializerProps) {
  const { initialize } = useBrand();

  useEffect(() => {
    // Read active brand cookie
    const activeBrandId = document.cookie
      .split("; ")
      .find((row) => row.startsWith("active_brand_id="))
      ?.split("=")[1] || null;

    initialize(brands, activeBrandId);
  }, [brands, initialize]);

  return null;
}