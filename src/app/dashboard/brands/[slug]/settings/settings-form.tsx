"use client";

import { useActionState } from "react";
import { useState, useEffect, useCallback } from "react";
import { Save, Upload, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadDropzone } from "@/lib/uploadthing-components";
import { updateBrandBrainAction, type SettingsActionState } from "./actions";
import { BrandIdentitySection } from "./sections/brand-identity-section";
import { MissionValuesSection } from "./sections/mission-values-section";
import { VoiceToneSection } from "./sections/voice-tone-section";
import { TargetAudienceSection } from "./sections/target-audience-section";
import { ProductsServicesSection } from "./sections/products-services-section";
import { CompetitorsSection } from "./sections/competitors-section";
import { SeoKeywordsSection } from "./sections/seo-keywords-section";
import { FaqsSection } from "./sections/faqs-section";
import { AdditionalContextSection } from "./sections/additional-context-section";

type SettingsFormProps = {
  slug: string;
  brandName: string;
  logoUrl: string | null;
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

export function SettingsForm({ slug, brandName, logoUrl, brain }: SettingsFormProps) {
  const initialState: SettingsActionState = {};
  const [state, formAction] = useActionState(updateBrandBrainAction, initialState);
  const router = useRouter();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(logoUrl);
  const [hasFileSelected, setHasFileSelected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track live field values for dynamic progress — init from server data
  const [liveValues, setLiveValues] = useState<Record<string, string | null>>(() => {
    return Object.fromEntries(
      COMPLETENESS_FIELDS.map((field) => [field, brain?.[field] ?? null])
    );
  });

  // Sync when brain prop changes (after server save + refresh)
  useEffect(() => {
    if (brain) {
      setLiveValues((prev) => {
        const next = { ...prev };
        for (const field of COMPLETENESS_FIELDS) {
          const serverVal = brain[field];
          if (serverVal !== undefined) {
            next[field] = serverVal;
          }
        }
        return next;
      });
    }
  }, [brain]);

  // Listen for field changes via a custom event dispatched by section components
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const { fieldId, value } = e.detail;
      setLiveValues((prev) => ({ ...prev, [fieldId]: value }));
    };
    window.addEventListener("brain-field-change", handler as EventListener);
    return () => window.removeEventListener("brain-field-change", handler as EventListener);
  }, []);

  // Calculate progress from live values (responds to both saved and unsaved changes)
  const progress = (() => {
    const totalFields = COMPLETENESS_FIELDS.length;
    const filledFields = COMPLETENESS_FIELDS.filter((field) => {
      const value = liveValues[field];
      return value !== null && value !== undefined && value.trim().length > 0;
    }).length;
    return Math.round((filledFields / totalFields) * 100);
  })();

  // Handle save
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    await formAction(formData);
    setIsSubmitting(false);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <form action={formAction} onSubmit={handleSubmit}>
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="logo" value={selectedLogo ?? ""} id="logo-input" />

        {/* Success/Error Messages */}
        {state?.message && !state.errors && (
          <div className="mb-6 rounded-md bg-green-500/10 px-4 py-3 text-sm text-green-400 flex items-center gap-2">
            <Check className="h-4 w-4" />
            {state.message}
          </div>
        )}

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
            slug={slug}
            brandName={brandName}
            tagline={brain?.tagline ?? ""}
            websiteUrl={brain?.websiteUrl ?? ""}
            industry={brain?.industry ?? ""}
            foundedYear={brain?.foundedYear ?? ""}
            logo={selectedLogo ?? ""}
          />

          <MissionValuesSection
            slug={slug}
            missionStatement={brain?.missionStatement ?? ""}
            coreValues={brain?.coreValues ?? ""}
            brandPromise={brain?.brandPromise ?? ""}
          />

          <VoiceToneSection
            slug={slug}
            voiceAdjectives={brain?.voiceAdjectives ?? ""}
            toneDescription={brain?.toneDescription ?? ""}
            writingStyleNotes={brain?.writingStyleNotes ?? ""}
            thingsToAvoid={brain?.thingsToAvoid ?? ""}
          />

          <TargetAudienceSection
            slug={slug}
            primaryAudience={brain?.primaryAudience ?? ""}
            audienceDemographics={brain?.audienceDemographics ?? ""}
            audiencePainPoints={brain?.audiencePainPoints ?? ""}
            audienceVocabulary={brain?.audienceVocabulary ?? ""}
          />

          <ProductsServicesSection
            slug={slug}
            productList={brain?.productList ?? ""}
            pricingTier={brain?.pricingTier ?? ""}
            keyDifferentiators={brain?.keyDifferentiators ?? ""}
          />

          <CompetitorsSection
            slug={slug}
            competitorList={brain?.competitorList ?? ""}
            competitiveAdvantages={brain?.competitiveAdvantages ?? ""}
            thingsNeverDo={brain?.thingsNeverDo ?? ""}
          />

          <SeoKeywordsSection
            slug={slug}
            primaryKeywords={brain?.primaryKeywords ?? ""}
            secondaryKeywords={brain?.secondaryKeywords ?? ""}
            topicsToOwn={brain?.topicsToOwn ?? ""}
            topicsToAvoid={brain?.topicsToAvoid ?? ""}
          />

          <FaqsSection
            slug={slug}
            faqList={brain?.faqList ?? ""}
          />

          <AdditionalContextSection
            slug={slug}
            freeformNotes={brain?.freeformNotes ?? ""}
            contentExamples={brain?.contentExamples ?? ""}
            brandStory={brain?.brandStory ?? ""}
          />
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4 pb-4">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save changes
              </>
            )}
          </Button>
          {state?.message && !state.errors && (
            <span className="text-sm text-green-400">✓ Saved</span>
          )}
        </div>
      </form>
    </div>
  );
}