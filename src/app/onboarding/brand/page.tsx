"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { createBrandAndStartOnboarding, type CreateBrandState } from "@/app/onboarding/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
        <p className="mt-2 text-[0.9rem] text-[var(--color-text-secondary)]">
          You can always edit this later — nothing is locked in.
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        <div>
          <label htmlFor="brandName" className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
            What&apos;s the brand called?
          </label>
          <Input
            id="brandName"
            name="brandName"
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            onBlur={() => handleBlur("brandName")}
            placeholder="e.g. Nike NG, Bloom Studio, The Tea Bar"
            disabled={isPending}
            error={getError("brandName")}
            style={{ caretColor: "var(--brand-accent)" }}
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
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
            className={`w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors resize-none ${
              getError("description")
                ? "border border-[var(--color-red)]"
                : "border border-[var(--color-border)] focus:border-[var(--brand-accent)]"
            } bg-[var(--color-surface-2)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]`}
            style={{ caretColor: "var(--brand-accent)" }}
          />
          {getError("description") && (
            <p role="alert" className="mt-1 text-[0.8125rem] text-[var(--color-red)]">
              {getError("description")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="industry" className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
            What industry are they in?
          </label>
          <select
            id="industry"
            name="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            onBlur={() => handleBlur("industry")}
            disabled={isPending}
            className={`w-full h-11 rounded-lg px-3 text-sm outline-none transition-colors appearance-none border ${
              getError("industry")
                ? "border-[var(--color-red)]"
                : "border-[var(--color-border)] focus:border-[var(--brand-accent)]"
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
            <p role="alert" className="mt-1 text-[0.8125rem] text-[var(--color-red)]">
              {getError("industry")}
            </p>
          )}
        </div>

        <div className="space-y-3 pt-3">
          <Button type="submit" className="w-full" disabled={!allFilled || isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Continue
          </Button>

          <div className="text-center">
            <span className="inline-flex cursor-default items-center gap-1.5 text-sm text-[var(--color-text-tertiary)]">
              Import from a website instead
              <span className="mos-pill rounded px-1.5 py-0.5 text-[10px]">Coming soon</span>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
