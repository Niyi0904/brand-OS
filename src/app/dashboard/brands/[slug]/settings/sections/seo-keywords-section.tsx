"use client";

import { useState } from "react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AutoGrowTextarea } from "@/components/ui/auto-grow-textarea";
import { TagInput } from "@/components/ui/tag-input";
import { FieldError } from "@/components/ui/field-error";

interface SeoKeywordsSectionProps {
  primaryKeywords: string;
  secondaryKeywords: string;
  topicsToOwn: string;
  topicsToAvoid: string;
  onFieldChange: (field: string, value: string) => void;
  errors?: Partial<Record<string, string[]>>;
}

export function SeoKeywordsSection({
  primaryKeywords,
  secondaryKeywords,
  topicsToOwn,
  topicsToAvoid,
  onFieldChange,
  errors,
}: SeoKeywordsSectionProps) {
  // Local state for tags so UI updates immediately (not waiting for save)
  const [localPrimary, setLocalPrimary] = useState<string[]>(() => {
    try { return JSON.parse(primaryKeywords || "[]"); } catch { return []; }
  });
  const [localSecondary, setLocalSecondary] = useState<string[]>(() => {
    try { return JSON.parse(secondaryKeywords || "[]"); } catch { return []; }
  });

  const handlePrimaryChange = (tags: string[]) => {
    setLocalPrimary(tags);
    onFieldChange("primaryKeywords", JSON.stringify(tags));
  };

  const handleSecondaryChange = (tags: string[]) => {
    setLocalSecondary(tags);
    onFieldChange("secondaryKeywords", JSON.stringify(tags));
  };

  return (
    <SectionWrapper
      title="SEO & keywords"
      subtext="The terms this brand wants to own. The AI weaves these in naturally when writing content."
      completionState={
        localPrimary.length > 0 || localSecondary.length > 0 || topicsToOwn || topicsToAvoid
          ? localPrimary.length > 0 && (localSecondary.length > 0 || topicsToOwn || topicsToAvoid)
            ? "complete"
            : "partial"
          : "empty"
      }
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="primaryKeywords" className="mos-label text-sm font-medium">
            Primary keywords
          </label>
          <TagInput
            tags={localPrimary}
            onChange={handlePrimaryChange}
            maxTags={10}
            placeholder="e.g. project management, team collaboration, remote work"
          />
          <input type="hidden" name="primaryKeywords" value={JSON.stringify(localPrimary)} />
          <FieldError messages={errors?.primaryKeywords} />
        </div>

        <div className="space-y-2">
          <label htmlFor="secondaryKeywords" className="mos-label text-sm font-medium">
            Secondary keywords
          </label>
          <TagInput
            tags={localSecondary}
            onChange={handleSecondaryChange}
            maxTags={20}
            placeholder="Long-tail keywords, related terms, synonyms"
          />
          <input type="hidden" name="secondaryKeywords" value={JSON.stringify(localSecondary)} />
          <FieldError messages={errors?.secondaryKeywords} />
        </div>

        <div className="space-y-2">
          <label htmlFor="topicsToOwn" className="mos-label text-sm font-medium">
            Topics to own
          </label>
          <AutoGrowTextarea
            id="topicsToOwn"
            name="topicsToOwn"
            defaultValue={topicsToOwn}
            placeholder="Subject areas where this brand wants to be seen as an authority."
            onBlur={(e) => onFieldChange("topicsToOwn", e.target.value)}
          />
          <FieldError messages={errors?.topicsToOwn} />
        </div>

        <div className="space-y-2">
          <label htmlFor="topicsToAvoid" className="mos-label text-sm font-medium">
            Topics to avoid
          </label>
          <AutoGrowTextarea
            id="topicsToAvoid"
            name="topicsToAvoid"
            defaultValue={topicsToAvoid}
            placeholder="Subjects the brand does not want to be associated with."
            onBlur={(e) => onFieldChange("topicsToAvoid", e.target.value)}
          />
          <FieldError messages={errors?.topicsToAvoid} />
        </div>
      </div>
    </SectionWrapper>
  );
}
