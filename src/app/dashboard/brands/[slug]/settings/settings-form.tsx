"use client";

import { useState, useEffect, useActionState, useTransition } from "react";
import { Upload, Check, Loader2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SaveBar } from "@/components/ui/save-bar";
import { UploadDropzone } from "@/lib/uploadthing-components";
import { updateBrandBrainAction, type SettingsActionState } from "./actions";
import { useBrandBrainForm } from "./use-brand-brain-form";
import { useBeforeUnload } from "./use-before-unload";
import { BrandIdentitySection } from "./sections/brand-identity-section";
import { MissionValuesSection } from "./sections/mission-values-section";
import { VoiceToneSection } from "./sections/voice-tone-section";
import { TargetAudienceSection } from "./sections/target-audience-section";
import { ProductsServicesSection } from "./sections/products-services-section";
import { CompetitorsSection } from "./sections/competitors-section";
import { SeoKeywordsSection } from "./sections/seo-keywords-section";
import { FaqsSection } from "./sections/faqs-section";
import { AdditionalContextSection } from "./sections/additional-context-section";
import { AppearanceSection } from "./sections/appearance-section";

type SettingsFormProps = {
  slug: string;
  brandName: string;
  logoUrl: string | null;
  accentColour: string | null;
  brain: Record<string, string | null> | null;
};

// Fields that count toward completeness (matches SECTION_DEFINITIONS in brand-utils.ts)
const COMPLETENESS_FIELDS: string[] = [
  "tagline", "websiteUrl", "industry",
  "missionStatement", "coreValues", "brandPromise",
  "voiceAdjectives", "toneDescription", "writingStyleNotes", "thingsToAvoid",
  "primaryAudience", "audienceDemographics", "audiencePainPoints", "audienceVocabulary",
  "productList", "pricingTier", "keyDifferentiators",
  "competitorList", "competitiveAdvantages", "thingsNeverDo",
  "primaryKeywords", "secondaryKeywords", "topicsToOwn", "topicsToAvoid",
  "faqList",
  "freeformNotes", "contentExamples", "brandStory",
];

const isFilledValue = (value: string | null | undefined): boolean => {
  if (!value || value.trim().length === 0) return false;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.length > 0;
  } catch {}
  return true;
};

export function SettingsForm({ slug, brandName, logoUrl, accentColour, brain }: SettingsFormProps) {
  const initialState: SettingsActionState = {};
  const [state, formAction] = useActionState(updateBrandBrainAction, initialState);
  const [isPending, startTransition] = useTransition();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(logoUrl);
  const [hasFileSelected, setHasFileSelected] = useState(false);

  const { values, isDirty, saveState, fieldErrors, onFieldChange, handleActionResult, markSaving } =
    useBrandBrainForm({
      initialValues: Object.fromEntries(
        COMPLETENESS_FIELDS.map((f) => [f, brain?.[f] ?? ""])
      ),
    });

  // Wire action state into the hook's result handler
  useEffect(() => {
    if (state && (state.message || state.errors)) {
      handleActionResult(state);
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  // Warn before navigating away with unsaved changes
  useBeforeUnload(isDirty);

  // Scroll to first field error on validation failure
  useEffect(() => {
    if (Object.keys(fieldErrors).length > 0) {
      const firstError = document.querySelector("[data-field-error]");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [fieldErrors]);

  // Progress from values map (responds to both saved and unsaved changes)
  const progress = (() => {
    const totalFields = COMPLETENESS_FIELDS.length;
    const filledFields = COMPLETENESS_FIELDS.filter((field) => isFilledValue(values[field])).length;
    return Math.round((filledFields / totalFields) * 100);
  })();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    markSaving();
    startTransition(() => {
      formAction(fd);
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="logo" value={selectedLogo ?? ""} id="logo-input" />

        {/* Live Progress Bar — responds to both saved data AND unsaved input changes */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[var(--color-text-primary)]">Brand Brain Progress</span>
              <span className="text-sm font-bold text-[var(--brand-accent)]">{progress}/100</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[var(--color-surface-2)]">
              <div
                className="h-2 rounded-full bg-[var(--brand-accent)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Logo Upload */}
        <Card className="mb-6">
          <CardHeader>
            <div className="mb-3 flex items-center gap-3">
              <div className="mos-icon-tile flex h-10 w-10 items-center justify-center rounded-lg [&_svg]:h-4 [&_svg]:w-4">
                <Upload className="h-4 w-4" />
              </div>
              <div>
                <CardTitle>Brand logo</CardTitle>
                <CardDescription>Upload a logo for your brand. Recommended: square PNG or SVG, max 4MB.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              {selectedLogo ? (
                <img src={selectedLogo} alt="Brand logo" className="h-16 w-16 rounded-lg border border-[var(--color-border)] object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-tertiary)]">
                  No logo
                </div>
              )}
              <div className="flex-1">
                <div className={`rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
                  hasFileSelected
                    ? "border-[var(--brand-accent)] bg-[var(--color-surface-2)]"
                    : "border-[var(--color-border)]"
                }`}>
                  <UploadDropzone
                    endpoint="brandLogo"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        setSelectedLogo(res[0].url);
                        document.getElementById("logo-input")?.setAttribute("value", res[0].url);
                        setUploadingLogo(false);
                        setHasFileSelected(false);
                      }
                    }}
                    onUploadError={(error) => {
                      console.error("Upload error:", error);
                      setUploadingLogo(false);
                      setHasFileSelected(false);
                    }}
                    onUploadBegin={() => {
                      setUploadingLogo(true);
                      setHasFileSelected(true);
                    }}
                  />
                  {!uploadingLogo && !selectedLogo && !hasFileSelected && (
                    <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">
                      Drop an image here or click to browse
                    </p>
                  )}
                  {hasFileSelected && !uploadingLogo && !selectedLogo && (
                    <p className="mt-2 flex items-center justify-center gap-1 text-xs text-[var(--brand-accent)]">
                      <Check className="h-3 w-3" />
                      File selected — ready to upload
                    </p>
                  )}
                </div>
                {uploadingLogo && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Uploading...
                  </div>
                )}
                {selectedLogo && !uploadingLogo && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-green-400">
                    <Check className="h-3 w-3" />
                    Logo uploaded successfully
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section components — INSIDE the form so their inputs get collected on Save changes */}
        <div className="space-y-6 mb-6">
          <BrandIdentitySection
            brandName={brandName}
            tagline={brain?.tagline ?? ""}
            websiteUrl={brain?.websiteUrl ?? ""}
            industry={brain?.industry ?? ""}
            foundedYear={brain?.foundedYear ?? ""}
            onFieldChange={onFieldChange}
            errors={fieldErrors}
          />

          <MissionValuesSection
            missionStatement={brain?.missionStatement ?? ""}
            coreValues={brain?.coreValues ?? ""}
            brandPromise={brain?.brandPromise ?? ""}
            onFieldChange={onFieldChange}
            errors={fieldErrors}
          />

          <VoiceToneSection
            voiceAdjectives={brain?.voiceAdjectives ?? ""}
            toneDescription={brain?.toneDescription ?? ""}
            writingStyleNotes={brain?.writingStyleNotes ?? ""}
            thingsToAvoid={brain?.thingsToAvoid ?? ""}
            onFieldChange={onFieldChange}
            errors={fieldErrors}
          />

          <TargetAudienceSection
            primaryAudience={brain?.primaryAudience ?? ""}
            audienceDemographics={brain?.audienceDemographics ?? ""}
            audiencePainPoints={brain?.audiencePainPoints ?? ""}
            audienceVocabulary={brain?.audienceVocabulary ?? ""}
            onFieldChange={onFieldChange}
            errors={fieldErrors}
          />

          <ProductsServicesSection
            productList={brain?.productList ?? ""}
            pricingTier={brain?.pricingTier ?? ""}
            keyDifferentiators={brain?.keyDifferentiators ?? ""}
            onFieldChange={onFieldChange}
            errors={fieldErrors}
          />

          <CompetitorsSection
            competitorList={brain?.competitorList ?? ""}
            competitiveAdvantages={brain?.competitiveAdvantages ?? ""}
            thingsNeverDo={brain?.thingsNeverDo ?? ""}
            onFieldChange={onFieldChange}
            errors={fieldErrors}
          />

          <SeoKeywordsSection
            primaryKeywords={brain?.primaryKeywords ?? ""}
            secondaryKeywords={brain?.secondaryKeywords ?? ""}
            topicsToOwn={brain?.topicsToOwn ?? ""}
            topicsToAvoid={brain?.topicsToAvoid ?? ""}
            onFieldChange={onFieldChange}
            errors={fieldErrors}
          />

          <FaqsSection
            faqList={brain?.faqList ?? ""}
            onFieldChange={onFieldChange}
            errors={fieldErrors}
          />

          <AdditionalContextSection
            freeformNotes={brain?.freeformNotes ?? ""}
            contentExamples={brain?.contentExamples ?? ""}
            brandStory={brain?.brandStory ?? ""}
            onFieldChange={onFieldChange}
            errors={fieldErrors}
          />

          <AppearanceSection
            accentColour={accentColour ?? ""}
            onFieldChange={onFieldChange}
            errors={fieldErrors}
          />
        </div>

        {/* Save Bar — sticky bottom, visible when dirty or saving */}
        <SaveBar isDirty={isDirty} saveState={saveState} isPending={isPending} />
      </form>
    </div>
  );
}
