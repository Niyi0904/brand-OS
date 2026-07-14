"use client";

import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AutoGrowTextarea } from "@/components/ui/auto-grow-textarea";
import { FieldError } from "@/components/ui/field-error";

interface TargetAudienceSectionProps {
  primaryAudience: string;
  audienceDemographics: string;
  audiencePainPoints: string;
  audienceVocabulary: string;
  onFieldChange: (field: string, value: string) => void;
  errors?: Partial<Record<string, string[]>>;
}

export function TargetAudienceSection({
  primaryAudience,
  audienceDemographics,
  audiencePainPoints,
  audienceVocabulary,
  onFieldChange,
  errors,
}: TargetAudienceSectionProps) {
  return (
    <SectionWrapper
      title="Target audience"
      subtext="Who the brand is talking to. The AI adjusts its language and examples based on this."
      completionState={
        primaryAudience || audienceDemographics || audiencePainPoints || audienceVocabulary
          ? primaryAudience && (audienceDemographics || audiencePainPoints || audienceVocabulary)
            ? "complete"
            : "partial"
          : "empty"
      }
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="primaryAudience" className="mos-label text-sm font-medium">
            Primary audience description
          </label>
          <AutoGrowTextarea
            id="primaryAudience"
            name="primaryAudience"
            defaultValue={primaryAudience}
            placeholder="e.g. Female founders, 28–42, UK-based, running product businesses with 1–10 employees."
            onBlur={(e) => onFieldChange("primaryAudience", e.target.value)}
          />
          <FieldError messages={errors?.primaryAudience} />
        </div>

        <div className="space-y-2">
          <label htmlFor="audienceDemographics" className="mos-label text-sm font-medium">
            Audience demographics
          </label>
          <AutoGrowTextarea
            id="audienceDemographics"
            name="audienceDemographics"
            defaultValue={audienceDemographics}
            placeholder="Age ranges, locations, income levels, job titles."
            onBlur={(e) => onFieldChange("audienceDemographics", e.target.value)}
          />
          <FieldError messages={errors?.audienceDemographics} />
        </div>

        <div className="space-y-2">
          <label htmlFor="audiencePainPoints" className="mos-label text-sm font-medium">
            Audience pain points
          </label>
          <AutoGrowTextarea
            id="audiencePainPoints"
            name="audiencePainPoints"
            defaultValue={audiencePainPoints}
            placeholder="What keeps them up at night. What they're struggling with."
            onBlur={(e) => onFieldChange("audiencePainPoints", e.target.value)}
          />
          <FieldError messages={errors?.audiencePainPoints} />
        </div>

        <div className="space-y-2">
          <label htmlFor="audienceVocabulary" className="mos-label text-sm font-medium">
            Audience vocabulary / language
          </label>
          <AutoGrowTextarea
            id="audienceVocabulary"
            name="audienceVocabulary"
            defaultValue={audienceVocabulary}
            placeholder="Terms they use, jargon they know, phrases that resonate."
            onBlur={(e) => onFieldChange("audienceVocabulary", e.target.value)}
          />
          <FieldError messages={errors?.audienceVocabulary} />
        </div>
      </div>
    </SectionWrapper>
  );
}
