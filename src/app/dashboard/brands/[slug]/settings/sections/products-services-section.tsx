"use client";

import { useState } from "react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AutoGrowTextarea } from "@/components/ui/auto-grow-textarea";
import { RepeatingRow, type RowData } from "@/components/ui/repeating-row";
import { FieldError } from "@/components/ui/field-error";

interface ProductsServicesSectionProps {
  productList: string;
  pricingTier: string;
  keyDifferentiators: string;
  onFieldChange: (field: string, value: string) => void;
  errors?: Partial<Record<string, string[]>>;
}

type RawProduct = { name?: string; oneLiner?: string } | string;

function parseProducts(raw: string): RowData[] {
  try {
    const arr = JSON.parse(raw || "[]") as RawProduct[];
    return arr.map((p, i) => ({
      id: `product-${i}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: typeof p === "string" ? p : (p.name ?? ""),
      oneLiner: typeof p === "string" ? "" : (p.oneLiner ?? ""),
    }));
  } catch {
    return [];
  }
}

export function ProductsServicesSection({
  productList,
  pricingTier,
  keyDifferentiators,
  onFieldChange,
  errors,
}: ProductsServicesSectionProps) {
  // Local state so "Add another" works immediately
  // ALWAYS show at least one empty row so input fields are visible
  const [localProducts, setLocalProducts] = useState<RowData[]>(() => {
    const parsed = parseProducts(productList);
    if (parsed.length === 0) {
      return [{ id: crypto.randomUUID(), name: "", oneLiner: "" }];
    }
    return parsed;
  });

  const handleProductsChange = (rows: RowData[]) => {
    setLocalProducts(rows);
    onFieldChange("productList", JSON.stringify(rows.map((r) => ({ name: r.name, oneLiner: r.oneLiner }))));
  };

  return (
    <SectionWrapper
      title="Products & services"
      subtext="What the brand sells. The AI uses this when writing about specific offerings."
      completionState={
        localProducts.length > 0 || pricingTier || keyDifferentiators
          ? localProducts.length > 0 && (pricingTier || keyDifferentiators)
            ? "complete"
            : "partial"
          : "empty"
      }
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="mos-label text-sm font-medium">Products / services</label>
          <RepeatingRow
            rows={localProducts}
            onChange={handleProductsChange}
            maxRows={10}
            fields={[
              { id: "name", label: "Name", placeholder: "Product name" },
              { id: "oneLiner", label: "One-liner", placeholder: "Brief description", type: "textarea" },
            ]}
            itemLabel="product"
          />
          <input
            type="hidden"
            name="productList"
            value={JSON.stringify(localProducts.map((r) => ({ name: r.name, oneLiner: r.oneLiner })))}
          />
          <FieldError messages={errors?.productList} />
        </div>

        <div className="space-y-2">
          <label htmlFor="pricingTier" className="mos-label text-sm font-medium">
            Pricing tier description
          </label>
          <AutoGrowTextarea
            id="pricingTier"
            name="pricingTier"
            defaultValue={pricingTier}
            placeholder="Entry point, mid-tier, premium. Price anchors help the AI write accurately."
            onBlur={(e) => onFieldChange("pricingTier", e.target.value)}
          />
          <FieldError messages={errors?.pricingTier} />
        </div>

        <div className="space-y-2">
          <label htmlFor="keyDifferentiators" className="mos-label text-sm font-medium">
            Key differentiators
          </label>
          <AutoGrowTextarea
            id="keyDifferentiators"
            name="keyDifferentiators"
            defaultValue={keyDifferentiators}
            placeholder="What makes this brand's offering different from competitors."
            onBlur={(e) => onFieldChange("keyDifferentiators", e.target.value)}
          />
          <FieldError messages={errors?.keyDifferentiators} />
        </div>
      </div>
    </SectionWrapper>
  );
}
