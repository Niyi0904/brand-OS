"use client";

import { useSectionAutoSave } from "../use-section-auto-save";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AutoGrowTextarea } from "@/components/ui/auto-grow-textarea";

interface BrandIdentitySectionProps {
  slug: string;
  brandName: string;
  tagline: string;
  websiteUrl: string;
  industry: string;
  foundedYear: string;
  logo: string;
}

export function BrandIdentitySection({
  slug,
  brandName,
  tagline,
  websiteUrl,
  industry,
  foundedYear,
  logo,
}: BrandIdentitySectionProps) {
  const { saveState, save } = useSectionAutoSave("brand-identity", slug);

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
            onBlur={(e) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("brandName", e.target.value);
              save(fd);
            }}
            className="mos-input h-10 w-full rounded-md px-3 text-sm transition-[border-color] duration-150 focus-visible:border-[var(--brand-accent)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]"
            aria-required="true"
          />
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
            onBlur={(e) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("tagline", e.target.value);
              save(fd);
            }}
          />
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
            onBlur={(e) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("websiteUrl", e.target.value);
              save(fd);
            }}
            className="mos-input h-10 w-full rounded-md px-3 text-sm transition-[border-color] duration-150 focus-visible:border-[var(--brand-accent)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]"
          />
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
              onBlur={(e) => {
                const fd = new FormData();
                fd.set("slug", slug);
                fd.set("industry", e.target.value);
                save(fd);
              }}
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
              onBlur={(e) => {
                const fd = new FormData();
                fd.set("slug", slug);
                fd.set("foundedYear", e.target.value);
                save(fd);
              }}
              className="mos-input h-10 w-full rounded-md px-3 text-sm transition-[border-color] duration-150 focus-visible:border-[var(--brand-accent)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]"
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}