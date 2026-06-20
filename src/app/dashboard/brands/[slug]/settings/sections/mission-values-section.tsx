"use client";

import { useSectionAutoSave } from "../use-section-auto-save";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AutoGrowTextarea } from "@/components/ui/auto-grow-textarea";
import { TagInput } from "@/components/ui/tag-input";

interface MissionValuesSectionProps {
  slug: string;
  missionStatement: string;
  coreValues: string;
  brandPromise: string;
}

export function MissionValuesSection({
  slug,
  missionStatement,
  coreValues,
  brandPromise,
}: MissionValuesSectionProps) {
  const { save } = useSectionAutoSave("mission-values", slug);

  const values = (() => {
    try {
      return JSON.parse(coreValues || "[]");
    } catch {
      return [];
    }
  })();

  return (
    <SectionWrapper
      title="Mission & values"
      subtext="What the brand stands for. The AI uses this to stay on-purpose in every piece of content."
      completionState={
        missionStatement || values.length > 0 || brandPromise
          ? missionStatement && (values.length > 0 || brandPromise)
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
            placeholder="e.g. We help small businesses compete with bigger ones by giving them better tools."
            onBlur={(e) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("missionStatement", e.target.value);
              save(fd);
            }}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="coreValues" className="mos-label text-sm font-medium">
            Core values
          </label>
          <TagInput
            tags={values}
            onChange={(tags) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("coreValues", JSON.stringify(tags));
              save(fd);
            }}
            maxTags={5}
            placeholder="e.g. Transparency, Customer-first, Innovation"
            onBlur={() => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("coreValues", JSON.stringify(values));
              save(fd);
            }}
          />
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
            onBlur={(e) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("brandPromise", e.target.value);
              save(fd);
            }}
          />
        </div>
      </div>
    </SectionWrapper>
  );
}