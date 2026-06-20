"use client";

import { useSectionAutoSave } from "../use-section-auto-save";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AutoGrowTextarea } from "@/components/ui/auto-grow-textarea";

interface TargetAudienceSectionProps {
  slug: string;
  primaryAudience: string;
  audienceDemographics: string;
  audiencePainPoints: string;
  audienceVocabulary: string;
}

export function TargetAudienceSection({
  slug,
  primaryAudience,
  audienceDemographics,
  audiencePainPoints,
  audienceVocabulary,
}: TargetAudienceSectionProps) {
  const { save } = useSectionAutoSave("target-audience", slug);

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
            onBlur={(e) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("primaryAudience", e.target.value);
              save(fd);
            }}
          />
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
            onBlur={(e) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("audienceDemographics", e.target.value);
              save(fd);
            }}
          />
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
            onBlur={(e) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("audiencePainPoints", e.target.value);
              save(fd);
            }}
          />
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
            onBlur={(e) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("audienceVocabulary", e.target.value);
              save(fd);
            }}
          />
        </div>
      </div>
    </SectionWrapper>
  );
}