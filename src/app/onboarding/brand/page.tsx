"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { createBrandAndStartOnboarding, type CreateBrandState } from "@/app/onboarding/actions";

const INDUSTRIES = [
  "Fashion & Apparel",
  "Beauty & Skincare",
  "Food & Beverage",
  "Health & Wellness",
  "Technology",
  "Real Estate",
  "Professional Services",
  "E-commerce",
  "Hospitality",
  "Education",
  "Finance",
  "Other",
] as const;

const initialState: CreateBrandState = {};

export default function BrandPage() {
  const [state, formAction, isPending] = useActionState(createBrandAndStartOnboarding, initialState);
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const allFilled = brandName.trim().length > 0 && description.trim().length > 0 && industry.length > 0;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getError = (field: string) => {
    if (!touched[field]) return undefined;
    return state?.errors?.[field]?.[0];
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[1.5rem] font-semibold text-[var(--color-text-primary)]">
          Let&apos;s set up your first client.
        </h1>
        <p className="text-[0.9rem] text-[var(--color-text-secondary)] mt-2">
          You can always edit this later — nothing is locked in.
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        {/* Brand name */}
        <div>
          <label htmlFor="brandName" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            What&apos;s the brand called?
          </label>
          <input
            id="brandName"
            name="brandName"
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            onBlur={() => handleBlur("brandName")}
            placeholder="e.g. Nike NG, Bloom Studio, The Tea Bar"
            disabled={isPending}
            className={`w-full h-11 px-3 rounded-lg text-sm outline-none transition-colors ${
              getError("brandName")
                ? "border border-[var(--color-red)]"
                : "border border-[var(--color-border)] focus:border-[var(--brand-accent)]"
            } bg-[var(--color-surface-2)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]`}
            style={{ caretColor: "var(--brand-accent)" }}
          />
          {getError("brandName") && (
            <p role="alert" className="text-[0.8125rem] text-[var(--color-red)] mt-1">
              {getError("brandName")}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            What does this brand do?
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => handleBlur("description")}
            placeholder="e.g. A premium skincare brand for women over 40 in West Africa"
            rows={3}
            disabled={isPending}
            className={`w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none transition-colors ${
              getError("description")
                ? "border border-[var(--color-red)]"
                : "border border-[var(--color-border)] focus:border-[var(--brand-accent)]"
            } bg-[var(--color-surface-2)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]`}
            style={{ caretColor: "var(--brand-accent)" }}
          />
          {getError("description") && (
            <p role="alert" className="text-[0.8125rem] text-[var(--color-red)] mt-1">
              {getError("description")}
            </p>
          )}
        </div>

        {/* Industry */}
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            What industry are they in?
          </label>
          <select
            id="industry"
            name="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            onBlur={() => handleBlur("industry")}
            disabled={isPending}
            className={`w-full h-11 px-3 rounded-lg text-sm outline-none transition-colors appearance-none ${
              getError("industry")
                ? "border border-[var(--color-red)]"
                : "border border-[var(--color-border)] focus:border-[var(--brand-accent)]"
            } bg-[var(--color-surface-2)] text-[var(--color-text-primary)] ${
              !industry ? "text-[var(--color-text-tertiary)]" : ""
            }`}
            style={{
              caretColor: "var(--brand-accent)",
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='rgba(255,255,255,0.38)' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
              backgroundSize: "16px",
            }}
          >
            <option value="" disabled>Select an industry</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
          {getError("industry") && (
            <p role="alert" className="text-[0.8125rem] text-[var(--color-red)] mt-1">
              {getError("industry")}
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="pt-3 space-y-3">
          <button
            type="submit"
            disabled={!allFilled || isPending}
            className="w-full flex items-center justify-center gap-2 h-11 rounded-lg text-sm font-medium transition-all"
            style={{
              background: allFilled && !isPending ? "var(--brand-accent)" : "var(--color-surface-3)",
              color: allFilled && !isPending ? "var(--color-bg)" : "var(--color-text-tertiary)",
              cursor: allFilled && !isPending ? "pointer" : "not-allowed",
            }}
            aria-disabled={!allFilled || isPending}
            aria-busy={isPending}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Continue
          </button>

          <div className="text-center">
            <span
              className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-tertiary)] cursor-default"
            >
              Import from a website instead
              <span className="mos-pill text-[10px] px-1.5 py-0.5">Coming soon</span>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
