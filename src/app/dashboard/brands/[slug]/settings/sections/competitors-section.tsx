"use client";

import { useState } from "react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AutoGrowTextarea } from "@/components/ui/auto-grow-textarea";
import { RepeatingRow } from "@/components/ui/repeating-row";
import type { RowData } from "@/components/ui/repeating-row";
import { FieldError } from "@/components/ui/field-error";

interface CompetitorsSectionProps {
  competitorList: string;
  competitiveAdvantages: string;
  thingsNeverDo: string;
  onFieldChange: (field: string, value: string) => void;
  errors?: Partial<Record<string, string[]>>;
}

type RawCompetitor = { name?: string; positioningNote?: string } | string;

function parseCompetitors(raw: string): RowData[] {
  try {
    const arr = JSON.parse(raw || "[]") as RawCompetitor[];
    return arr.map((c, i) => ({
      id: `competitor-${i}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: typeof c === "string" ? c : (c.name ?? ""),
      positioningNote: typeof c === "string" ? "" : (c.positioningNote ?? ""),
    }));
  } catch {
    return [];
  }
}

export function CompetitorsSection({
  competitorList,
  competitiveAdvantages,
  thingsNeverDo,
  onFieldChange,
  errors,
}: CompetitorsSectionProps) {
  // Local state so "Add another" works immediately
  // ALWAYS show at least one empty row so input fields are visible
  const [localCompetitors, setLocalCompetitors] = useState<RowData[]>(() => {
    const parsed = parseCompetitors(competitorList);
    if (parsed.length === 0) {
      return [{ id: crypto.randomUUID(), name: "", positioningNote: "" }];
    }
    return parsed;
  });

  const handleCompetitorsChange = (rows: RowData[]) => {
    setLocalCompetitors(rows);
    onFieldChange("competitorList", JSON.stringify(rows.map((r) => ({ name: r.name, positioningNote: r.positioningNote }))));
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
          <input
            type="hidden"
            name="competitorList"
            value={JSON.stringify(localCompetitors.map((r) => ({ name: r.name, positioningNote: r.positioningNote })))}
          />
          <FieldError messages={errors?.competitorList} />
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
            onBlur={(e) => onFieldChange("competitiveAdvantages", e.target.value)}
          />
          <FieldError messages={errors?.competitiveAdvantages} />
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
            onBlur={(e) => onFieldChange("thingsNeverDo", e.target.value)}
          />
          <FieldError messages={errors?.thingsNeverDo} />
        </div>
      </div>
    </SectionWrapper>
  );
}
