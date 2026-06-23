"use client";

import { useActionState, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import { Phase2Card } from "@/components/onboarding/Phase2Card";
import { saveProductsAction, skipPhase2CardAction, type Phase2ActionState } from "@/app/onboarding/actions";

const initialState: Phase2ActionState = {};

interface ProductRow {
  id: string;
  name: string;
  oneLiner: string;
}

function createRow(name = "", oneLiner = ""): ProductRow {
  return { id: Math.random().toString(36).slice(2), name, oneLiner };
}

export default function ProductsPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(saveProductsAction, initialState);
  const [rows, setRows] = useState<ProductRow[]>([createRow()]);

  const updateRow = (id: string, field: "name" | "oneLiner", value: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const addRow = () => {
    if (rows.length < 5) setRows((prev) => [...prev, createRow()]);
  };

  const productList = JSON.stringify(rows.map((r) => ({ name: r.name, oneLiner: r.oneLiner })));

  const handleSkip = useCallback(async () => {
    const formData = new FormData();
    formData.set("nextStep", "competitor");
    formData.set("skippedCard", "products");
    await skipPhase2CardAction(formData);
    router.refresh();
  }, [router]);

  return (
    <Phase2Card
      icon={<Package className="h-4 w-4" />}
      heading="What does this brand actually sell?"
      subtext="The AI uses this when writing about specific offerings. Keep it short — one line per product is enough."
      isSubmitting={isPending}
      continueFormAction={formAction}
      onSkip={handleSkip}
      skipLabel="Skip Products for now"
    >
      <input name="productList" type="hidden" value={productList} />
      <div className="space-y-3">
        {rows.map((row, idx) => (
          <div key={row.id} className="flex items-start gap-2 animate-row-expand">
            <div className="flex-1 space-y-2">
              <input
                value={row.name}
                onChange={(e) => updateRow(row.id, "name", e.target.value)}
                placeholder="e.g. Premium Face Serum"
                disabled={isPending}
                className="w-full h-10 px-3 rounded-lg text-sm outline-none border border-[var(--color-border)] focus:border-[var(--brand-accent)] bg-[var(--color-surface-2)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] transition-colors"
                style={{ caretColor: "var(--brand-accent)" }}
              />
              {idx === 0 && (
                <input
                  value={row.oneLiner}
                  onChange={(e) => updateRow(row.id, "oneLiner", e.target.value)}
                  placeholder="e.g. Anti-ageing serum for women over 40, £65"
                  disabled={isPending}
                  className="w-full h-10 px-3 rounded-lg text-sm outline-none border border-[var(--color-border)] focus:border-[var(--brand-accent)] bg-[var(--color-surface-2)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] transition-colors"
                  style={{ caretColor: "var(--brand-accent)" }}
                />
              )}
            </div>
            {rows.length > 1 && (
              <button
                type="button"
                onClick={() => removeRow(row.id)}
                disabled={isPending}
                className="mt-2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
                aria-label="Remove product"
              >
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            )}
          </div>
        ))}
        {rows.length < 5 && (
          <button
            type="button"
            onClick={addRow}
            disabled={isPending}
            className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            + Add another product
          </button>
        )}
      </div>
    </Phase2Card>
  );
}
