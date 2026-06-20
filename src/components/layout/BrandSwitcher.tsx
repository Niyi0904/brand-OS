"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useBrand } from "@/lib/brand-context-provider";

export function BrandSwitcher() {
  const router = useRouter();
  const { currentBrand, brands, setCurrentBrand } = useBrand();
  const [open, setOpen] = useState(false);

  if (!currentBrand || brands.length === 0) return null;

  const handleSwitch = async (brandId: string) => {
    try {
      const res = await fetch("/api/brands/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId }),
      });

      if (res.ok) {
        const brand = brands.find((b) => b.id === brandId);
        if (brand) setCurrentBrand(brand);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to switch brand:", error);
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-between"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2 truncate">
          <Building2 className="h-4 w-4 shrink-0" />
          <span className="truncate">{currentBrand.name}</span>
        </div>
        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
      </Button>

      {open ? (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-1 w-full min-w-[200px] rounded-lg border bg-[var(--color-surface-1)] p-1 shadow-lg">
            {brands.map((brand) => (
              <button
                key={brand.id}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-[var(--color-surface-2)]"
                onClick={() => handleSwitch(brand.id)}
              >
                <Building2 className="h-4 w-4 shrink-0 text-[var(--color-text-tertiary)]" />
                <span className="flex-1 truncate text-left">{brand.name}</span>
                {brand.id === currentBrand.id ? (
                  <Check className="h-4 w-4 text-[var(--brand-accent)]" />
                ) : null}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}