"use client";

import { useState, useEffect } from "react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AutoGrowTextarea } from "@/components/ui/auto-grow-textarea";
import { TagInput } from "@/components/ui/tag-input";
import { FieldError } from "@/components/ui/field-error";

interface VoiceToneSectionProps {
  voiceAdjectives: string;
  toneDescription: string;
  writingStyleNotes: string;
  thingsToAvoid: string;
  onFieldChange: (field: string, value: string) => void;
  errors?: Partial<Record<string, string[]>>;
}

export function VoiceToneSection({
  voiceAdjectives,
  toneDescription,
  writingStyleNotes,
  thingsToAvoid,
  onFieldChange,
  errors,
}: VoiceToneSectionProps) {
  // Local state for tags so UI updates immediately (not waiting for save)
  const [localAdjectives, setLocalAdjectives] = useState<string[]>(() => {
    try { return JSON.parse(voiceAdjectives || "[]"); } catch { return []; }
  });

  // Sync from props when server data changes (after save + revalidation)
  useEffect(() => {
    try {
      const parsed = JSON.parse(voiceAdjectives || "[]");
      setLocalAdjectives(parsed);
    } catch { /* ignore */ }
  }, [voiceAdjectives]);

  const handleAdjectiveChange = (tags: string[]) => {
    setLocalAdjectives(tags);
    onFieldChange("voiceAdjectives", JSON.stringify(tags));
  };

  return (
    <SectionWrapper
      title="Voice & tone"
      subtext="This is what the AI reads before it writes anything for this brand."
      completionState={
        localAdjectives.length > 0 || toneDescription || writingStyleNotes || thingsToAvoid
          ? localAdjectives.length > 0 && (toneDescription || writingStyleNotes || thingsToAvoid)
            ? "complete"
            : "partial"
          : "empty"
      }
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="voiceAdjectives" className="mos-label text-sm font-medium">
            Voice adjectives
          </label>
          <TagInput
            tags={localAdjectives}
            onChange={handleAdjectiveChange}
            maxTags={6}
            placeholder="e.g. Warm, direct, a little irreverent — never corporate"
          />
          <input type="hidden" name="voiceAdjectives" value={JSON.stringify(localAdjectives)} />
          <FieldError messages={errors?.voiceAdjectives} />
        </div>

        <div className="space-y-2">
          <label htmlFor="toneDescription" className="mos-label text-sm font-medium">
            Tone description
          </label>
          <AutoGrowTextarea
            id="toneDescription"
            name="toneDescription"
            defaultValue={toneDescription}
            placeholder="How the brand sounds in different contexts."
            onBlur={(e) => onFieldChange("toneDescription", e.target.value)}
          />
          <FieldError messages={errors?.toneDescription} />
        </div>

        <div className="space-y-2">
          <label htmlFor="writingStyleNotes" className="mos-label text-sm font-medium">
            Writing style notes
          </label>
          <AutoGrowTextarea
            id="writingStyleNotes"
            name="writingStyleNotes"
            defaultValue={writingStyleNotes}
            placeholder="Sentence structure, paragraph length, formatting preferences."
            onBlur={(e) => onFieldChange("writingStyleNotes", e.target.value)}
          />
          <FieldError messages={errors?.writingStyleNotes} />
        </div>

        <div className="space-y-2">
          <label htmlFor="thingsToAvoid" className="mos-label text-sm font-medium">
            Things to avoid
          </label>
          <AutoGrowTextarea
            id="thingsToAvoid"
            name="thingsToAvoid"
            defaultValue={thingsToAvoid}
            placeholder="e.g. Don't use jargon. Don't be preachy. Don't mention competitors by name."
            onBlur={(e) => onFieldChange("thingsToAvoid", e.target.value)}
          />
          <FieldError messages={errors?.thingsToAvoid} />
        </div>
      </div>
    </SectionWrapper>
  );
}
