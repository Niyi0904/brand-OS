"use client";

import { useEffect } from "react";
import { useBrand, Brand } from "@/lib/brand-context-provider";

type BrandProviderInitializerProps = {
  brands: Brand[];
};

export function BrandProviderInitializer({ brands }: BrandProviderInitializerProps) {
  const { initialize } = useBrand();

  useEffect(() => {
    // Read active brand from cookie (set by /api/brands/switch), fall back to localStorage
    const fromCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("active_brand_id="))
      ?.split("=")[1] || null;

    const activeBrandId = fromCookie || localStorage.getItem("current_brand_id");

    initialize(brands, activeBrandId);
  }, [brands, initialize]);

  return null;
}