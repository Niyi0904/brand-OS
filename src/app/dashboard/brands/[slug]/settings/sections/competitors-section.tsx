"use client";

import { useState, useEffect } from "react";
import { useSectionAutoSave } from "../use-section-auto-save";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AutoGrowTextarea } from "@/components/ui/auto-grow-textarea";
import { RepeatingRow } from "@/components/ui/repeating-row";
import type { RowData } from "@/components/ui/repeating-row";

interface CompetitorsSectionProps {
  slug: string;
  competitorList: string;
  competitiveAdvantages: string;
  thingsNeverDo: string;
}

function parseCompetitors(raw: string): RowData[] {
  try {
    const arr = JSON.parse(raw || "[]");
    return arr.map((c: any, i: number) => ({
      id: `competitor-${i}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: typeof c === "string" ? c : c.name || "",
      positioningNote: typeof c === "string" ? "" : c.positioningNote || "",
    }));
  } catch {
    return [];
  }
}

export function CompetitorsSection({
  slug,
  competitorList,
  competitiveAdvantages,
  thingsNeverDo,
}: CompetitorsSectionProps) {
  const { save } = useSectionAutoSave("competitors", slug);

  // Local state so "Add another" works immediately
  // ALWAYS show at least one empty row so input fields are visible
  const [localCompetitors, setLocalCompetitors] = useState<RowData[]>(() => {
    const parsed = parseCompetitors(competitorList);
    if (parsed.length === 0) {
      return [{ id: crypto.randomUUID(), name: "", positioningNote: "" }];
    }
    return parsed;
  });

  useEffect(() => {
    setLocalCompetitors(parseCompetitors(competitorList));
  }, [competitorList]);

  const handleCompetitorsChange = (rows: RowData[]) => {
    setLocalCompetitors(rows);
    const fd = new FormData();
    fd.set("slug", slug);
    fd.set("competitorList", JSON.stringify(rows.map((r) => ({ name: r.name, positioningNote: r.positioningNote }))));
    save(fd);
  };

  return (
    <SectionWrapper
      title="Competitors"
      subtext="Who they're up against. The AI uses this to position the brand correctly and avoid endorsing competitors."
      completionState={
        localCompetitors.length > 0 || competitiveAdvantages || thingsNeverDo
          ? localCompetitors.length > 0 && (competitiveAdvantages || thingsNeverDo)
            ? "complete"
            : "partial"
          : "empty"
      }
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="mos-label text-sm font-medium">Competitors</label>
          <RepeatingRow
            rows={localCompetitors}
            onChange={handleCompetitorsChange}
            maxRows={5}
            fields={[
              { id: "name", label: "Name", placeholder: "Competitor name" },
              { id: "positioningNote", label: "Positioning", placeholder: "How they position themselves", type: "textarea" },
            ]}
            itemLabel="competitor"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="competitiveAdvantages" className="mos-label text-sm font-medium">
            Competitive advantages
          </label>
          <AutoGrowTextarea
            id="competitiveAdvantages"
            name="competitiveAdvantages"
            defaultValue={competitiveAdvantages}
            placeholder="What this brand does better than anyone else."
            onBlur={(e) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("competitiveAdvantages", e.target.value);
              save(fd);
            }}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="thingsNeverDo" className="mos-label text-sm font-medium">
            Things we never do that competitors do
          </label>
          <AutoGrowTextarea
            id="thingsNeverDo"
            name="thingsNeverDo"
            defaultValue={thingsNeverDo}
            placeholder="Lines this brand will not cross. Practices to avoid."
            onBlur={(e) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("thingsNeverDo", e.target.value);
              save(fd);
            }}
          />
        </div>
      </div>
    </SectionWrapper>
  );
}