"use client";

import { useState, useEffect } from "react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AutoGrowTextarea } from "@/components/ui/auto-grow-textarea";
import { TagInput } from "@/components/ui/tag-input";
import { FieldError } from "@/components/ui/field-error";

interface MissionValuesSectionProps {
  missionStatement: string;
  coreValues: string;
  brandPromise: string;
  onFieldChange: (field: string, value: string) => void;
  errors?: Partial<Record<string, string[]>>;
}

export function MissionValuesSection({
  missionStatement,
  coreValues,
  brandPromise,
  onFieldChange,
  errors,
}: MissionValuesSectionProps) {
  // Local state for tags so UI updates immediately (not waiting for save)
  const [localValues, setLocalValues] = useState<string[]>(() => {
    try { return JSON.parse(coreValues || "[]"); } catch { return []; }
  });

  // Sync from props when server data changes (after save + revalidation)
  useEffect(() => {
    try {
      const parsed = JSON.parse(coreValues || "[]");
      setLocalValues(parsed);
    } catch { /* ignore */ }
  }, [coreValues]);

  const handleValueTagsChange = (tags: string[]) => {
    setLocalValues(tags);
    onFieldChange("coreValues", JSON.stringify(tags));
  };

  return (
    <SectionWrapper
      title="Mission & values"
      subtext="What the brand stands for. The AI uses this to stay on-purpose in every piece of content."
      completionState={
        missionStatement || localValues.length > 0 || brandPromise
          ? missionStatement && (localValues.length > 0 || brandPromise)
            ? "complete"
            : "partial"
          : "empty"
      }
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="missionStatement" className="mos-label text-sm font-medium">
            Mission statement
          </label>
          <AutoGrowTextarea
            id="missionStatement"
            name="missionStatement"
            defaultValue={missionStatement}
            onBlur={(e) => onFieldChange("missionStatement", e.target.value)}
            placeholder="e.g. We help small businesses compete with bigger ones by giving them better tools."
          />
          <FieldError messages={errors?.missionStatement} />
        </div>

        <div className="space-y-2">
          <label htmlFor="coreValues" className="mos-label text-sm font-medium">
            Core values
          </label>
          <TagInput
            tags={localValues}
            onChange={handleValueTagsChange}
            maxTags={5}
            placeholder="e.g. Transparency, Customer-first, Innovation"
          />
          <input type="hidden" name="coreValues" value={JSON.stringify(localValues)} />
          <FieldError messages={errors?.coreValues} />
        </div>

        <div className="space-y-2">
          <label htmlFor="brandPromise" className="mos-label text-sm font-medium">
            Brand promise
          </label>
          <AutoGrowTextarea
            id="brandPromise"
            name="brandPromise"
            defaultValue={brandPromise}
            placeholder="What the brand guarantees to every customer."
            onBlur={(e) => onFieldChange("brandPromise", e.target.value)}
          />
          <FieldError messages={errors?.brandPromise} />
        </div>
      </div>
    </SectionWrapper>
  );
}
