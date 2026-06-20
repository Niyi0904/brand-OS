"use client";

import { useSectionAutoSave } from "../use-section-auto-save";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AutoGrowTextarea } from "@/components/ui/auto-grow-textarea";
import { TagInput } from "@/components/ui/tag-input";

interface VoiceToneSectionProps {
  slug: string;
  voiceAdjectives: string;
  toneDescription: string;
  writingStyleNotes: string;
  thingsToAvoid: string;
}

export function VoiceToneSection({
  slug,
  voiceAdjectives,
  toneDescription,
  writingStyleNotes,
  thingsToAvoid,
}: VoiceToneSectionProps) {
  const { save } = useSectionAutoSave("voice-tone", slug);

  const adjectives = (() => {
    try {
      return JSON.parse(voiceAdjectives || "[]");
    } catch {
      return [];
    }
  })();

  return (
    <SectionWrapper
      title="Voice & tone"
      subtext="This is what the AI reads before it writes anything for this brand."
      completionState={
        adjectives.length > 0 || toneDescription || writingStyleNotes || thingsToAvoid
          ? adjectives.length > 0 && (toneDescription || writingStyleNotes || thingsToAvoid)
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
            tags={adjectives}
            onChange={(tags) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("voiceAdjectives", JSON.stringify(tags));
              save(fd);
            }}
            maxTags={6}
            placeholder="e.g. Warm, direct, a little irreverent — never corporate"
            onBlur={() => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("voiceAdjectives", JSON.stringify(adjectives));
              save(fd);
            }}
          />
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
            onBlur={(e) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("toneDescription", e.target.value);
              save(fd);
            }}
          />
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
            onBlur={(e) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("writingStyleNotes", e.target.value);
              save(fd);
            }}
          />
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
            onBlur={(e) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("thingsToAvoid", e.target.value);
              save(fd);
            }}
          />
        </div>
      </div>
    </SectionWrapper>
  );
}