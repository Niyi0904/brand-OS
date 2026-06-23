"use client";

import { useState, useEffect } from "react";
import { useSectionAutoSave } from "../use-section-auto-save";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AutoGrowTextarea } from "@/components/ui/auto-grow-textarea";
import { TagInput } from "@/components/ui/tag-input";

interface SeoKeywordsSectionProps {
  slug: string;
  primaryKeywords: string;
  secondaryKeywords: string;
  topicsToOwn: string;
  topicsToAvoid: string;
}

export function SeoKeywordsSection({
  slug,
  primaryKeywords,
  secondaryKeywords,
  topicsToOwn,
  topicsToAvoid,
}: SeoKeywordsSectionProps) {
  const { save } = useSectionAutoSave("seo-keywords", slug);

  // Local state for tags so UI updates immediately (not waiting for API)
  const [localPrimary, setLocalPrimary] = useState<string[]>(() => {
    try { return JSON.parse(primaryKeywords || "[]"); } catch { return []; }
  });
  const [localSecondary, setLocalSecondary] = useState<string[]>(() => {
    try { return JSON.parse(secondaryKeywords || "[]"); } catch { return []; }
  });

  // Sync from props when API save completes
  useEffect(() => {
    try { setLocalPrimary(JSON.parse(primaryKeywords || "[]")); } catch { /* ignore */ }
  }, [primaryKeywords]);

  useEffect(() => {
    try { setLocalSecondary(JSON.parse(secondaryKeywords || "[]")); } catch { /* ignore */ }
  }, [secondaryKeywords]);

  const handlePrimaryChange = (tags: string[]) => {
    setLocalPrimary(tags);
    const fd = new FormData();
    fd.set("slug", slug);
    fd.set("primaryKeywords", JSON.stringify(tags));
    save(fd);
  };

  const handleSecondaryChange = (tags: string[]) => {
    setLocalSecondary(tags);
    const fd = new FormData();
    fd.set("slug", slug);
    fd.set("secondaryKeywords", JSON.stringify(tags));
    save(fd);
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
            onBlur={(e) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("topicsToOwn", e.target.value);
              save(fd);
            }}
          />
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
            onBlur={(e) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("topicsToAvoid", e.target.value);
              save(fd);
            }}
          />
        </div>
      </div>
    </SectionWrapper>
  );
}