"use client";

import { useSectionAutoSave } from "../use-section-auto-save";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AutoGrowTextarea } from "@/components/ui/auto-grow-textarea";
import { RepeatingRow } from "@/components/ui/repeating-row";

interface ProductsServicesSectionProps {
  slug: string;
  productList: string;
  pricingTier: string;
  keyDifferentiators: string;
}

export function ProductsServicesSection({
  slug,
  productList,
  pricingTier,
  keyDifferentiators,
}: ProductsServicesSectionProps) {
  const { save } = useSectionAutoSave("products-services", slug);

  const products = (() => {
    try {
      return JSON.parse(productList || "[]");
    } catch {
      return [];
    }
  })();

  interface ProductRow {
    id: string;
    name: string;
    oneLiner: string;
    [key: string]: string;
  }
  const normalizedProducts = products.map((p: any, i: number) => ({
    id: `product-${i}-${Date.now()}`,
    name: typeof p === "string" ? p : p.name || "",
    oneLiner: typeof p === "string" ? "" : p.oneLiner || "",
  }));

  return (
    <SectionWrapper
      title="Products & services"
      subtext="What the brand sells. The AI uses this when writing about specific offerings."
      completionState={
        normalizedProducts.length > 0 || pricingTier || keyDifferentiators
          ? normalizedProducts.length > 0 && (pricingTier || keyDifferentiators)
            ? "complete"
            : "partial"
          : "empty"
      }
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="mos-label text-sm font-medium">Products / services</label>
          <RepeatingRow
            rows={normalizedProducts}
            onChange={(rows) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("productList", JSON.stringify(rows.map((r: any) => ({ name: r.name, oneLiner: r.oneLiner }))));
              save(fd);
            }}
            maxRows={10}
            fields={[
              { id: "name", label: "Name", placeholder: "Product name" },
              { id: "oneLiner", label: "One-liner", placeholder: "Brief description", type: "textarea" },
            ]}
            itemLabel="product"
            onBlur={() => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("productList", JSON.stringify(normalizedProducts.map((r: any) => ({ name: r.name, oneLiner: r.oneLiner }))));
              save(fd);
            }}
          />
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
            onBlur={(e) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("pricingTier", e.target.value);
              save(fd);
            }}
          />
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
            onBlur={(e) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("keyDifferentiators", e.target.value);
              save(fd);
            }}
          />
        </div>
      </div>
    </SectionWrapper>
  );
}