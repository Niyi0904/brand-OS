"use client";

import { useSectionAutoSave } from "../use-section-auto-save";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AutoGrowTextarea } from "@/components/ui/auto-grow-textarea";

interface AdditionalContextSectionProps {
  slug: string;
  freeformNotes: string;
  contentExamples: string;
  brandStory: string;
}

export function AdditionalContextSection({
  slug,
  freeformNotes,
  contentExamples,
  brandStory,
}: AdditionalContextSectionProps) {
  const { save } = useSectionAutoSave("additional-context", slug);

  return (
    <SectionWrapper
      title="Additional context"
      subtext="Anything else the AI should know. Brand story, tone examples, things that are hard to categorise."
      completionState={
        freeformNotes || contentExamples || brandStory
          ? freeformNotes && (contentExamples || brandStory)
            ? "complete"
            : "partial"
          : "empty"
      }
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="freeformNotes" className="mos-label text-sm font-medium">
            Free-form notes
          </label>
          <AutoGrowTextarea
            id="freeformNotes"
            name="freeformNotes"
            defaultValue={freeformNotes}
            placeholder="Anything that doesn't fit elsewhere. Random facts, history, context."
            onBlur={(e) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("freeformNotes", e.target.value);
              save(fd);
            }}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="contentExamples" className="mos-label text-sm font-medium">
            Content examples
          </label>
          <AutoGrowTextarea
            id="contentExamples"
            name="contentExamples"
            defaultValue={contentExamples}
            placeholder="Paste links to great content, or describe what good looks like."
            onBlur={(e) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("contentExamples", e.target.value);
              save(fd);
            }}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="brandStory" className="mos-label text-sm font-medium">
            Brand story
          </label>
          <AutoGrowTextarea
            id="brandStory"
            name="brandStory"
            defaultValue={brandStory}
            placeholder="The origin story. Why this brand exists. The people behind it."
            onBlur={(e) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("brandStory", e.target.value);
              save(fd);
            }}
          />
        </div>
      </div>
    </SectionWrapper>
  );
}