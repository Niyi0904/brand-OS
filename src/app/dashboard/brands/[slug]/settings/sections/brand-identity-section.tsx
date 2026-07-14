"use client";

import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AutoGrowTextarea } from "@/components/ui/auto-grow-textarea";
import { FieldError } from "@/components/ui/field-error";
import { cn } from "@/lib/utils";

interface BrandIdentitySectionProps {
  brandName: string;
  tagline: string;
  websiteUrl: string;
  industry: string;
  foundedYear: string;
  onFieldChange: (field: string, value: string) => void;
  errors?: Partial<Record<string, string[]>>;
}

export function BrandIdentitySection({
  brandName,
  tagline,
  websiteUrl,
  industry,
  foundedYear,
  onFieldChange,
  errors,
}: BrandIdentitySectionProps) {
  return (
    <SectionWrapper
      title="Brand identity"
      subtext="The basics. Your AI employees use this to introduce the brand correctly."
      completionState={
        brandName || tagline || websiteUrl || industry || foundedYear
          ? brandName && (tagline || websiteUrl || industry || foundedYear)
            ? "complete"
            : "partial"
          : "empty"
      }
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="brandName" className="mos-label text-sm font-medium">
            Brand name <span className="text-[var(--color-danger)]">*</span>
          </label>
          <input
            id="brandName"
            name="brandName"
            type="text"
            defaultValue={brandName}
            onBlur={(e) => onFieldChange("brandName", e.target.value)}
            className={cn(
              "mos-input h-10 w-full rounded-md px-3 text-sm transition-[border-color] duration-150 focus-visible:border-[var(--brand-accent)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]",
              errors?.brandName && "border-[var(--color-danger)]"
            )}
            aria-required="true"
          />
          <FieldError messages={errors?.brandName} />
        </div>

        <div className="space-y-2">
          <label htmlFor="tagline" className="mos-label text-sm font-medium">
            Tagline
          </label>
          <AutoGrowTextarea
            id="tagline"
            name="tagline"
            defaultValue={tagline}
            placeholder="e.g. We help small businesses compete with bigger ones by giving them better tools."
            onBlur={(e) => onFieldChange("tagline", e.target.value)}
          />
          <FieldError messages={errors?.tagline} />
        </div>

        <div className="space-y-2">
          <label htmlFor="websiteUrl" className="mos-label text-sm font-medium">
            Website URL
          </label>
          <input
            id="websiteUrl"
            name="websiteUrl"
            type="url"
            defaultValue={websiteUrl}
            placeholder="https://example.com"
            onBlur={(e) => onFieldChange("websiteUrl", e.target.value)}
            className="mos-input h-10 w-full rounded-md px-3 text-sm transition-[border-color] duration-150 focus-visible:border-[var(--brand-accent)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]"
          />
          <FieldError messages={errors?.websiteUrl} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="industry" className="mos-label text-sm font-medium">
              Industry
            </label>
            <select
              id="industry"
              name="industry"
              defaultValue={industry}
              onBlur={(e) => onFieldChange("industry", e.target.value)}
              className="mos-input h-10 w-full rounded-md px-3 text-sm transition-[border-color] duration-150 focus-visible:border-[var(--brand-accent)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]"
            >
              <option value="">Select industry</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Retail">Retail</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Professional Services">Professional Services</option>
              <option value="Other">Other</option>
            </select>
            <FieldError messages={errors?.industry} />
          </div>

          <div className="space-y-2">
            <label htmlFor="foundedYear" className="mos-label text-sm font-medium">
              Founded year
            </label>
            <input
              id="foundedYear"
              name="foundedYear"
              type="number"
              min="1800"
              max={new Date().getFullYear()}
              defaultValue={foundedYear}
              placeholder="2020"
              onBlur={(e) => onFieldChange("foundedYear", e.target.value)}
              className="mos-input h-10 w-full rounded-md px-3 text-sm transition-[border-color] duration-150 focus-visible:border-[var(--brand-accent)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]"
            />
            <FieldError messages={errors?.foundedYear} />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
