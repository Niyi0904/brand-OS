"use client";

import { useSectionAutoSave } from "../use-section-auto-save";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AutoGrowTextarea } from "@/components/ui/auto-grow-textarea";
import { RepeatingRow } from "@/components/ui/repeating-row";

interface CompetitorsSectionProps {
  slug: string;
  competitorList: string;
  competitiveAdvantages: string;
  thingsNeverDo: string;
}

export function CompetitorsSection({
  slug,
  competitorList,
  competitiveAdvantages,
  thingsNeverDo,
}: CompetitorsSectionProps) {
  const { save } = useSectionAutoSave("competitors", slug);

  const competitors = (() => {
    try {
      return JSON.parse(competitorList || "[]");
    } catch {
      return [];
    }
  })();

  interface CompetitorRow {
    id: string;
    name: string;
    positioningNote: string;
    [key: string]: string;
  }
  const normalizedCompetitors = competitors.map((c: any, i: number) => ({
    id: `competitor-${i}-${Date.now()}`,
    name: typeof c === "string" ? c : c.name || "",
    positioningNote: typeof c === "string" ? "" : c.positioningNote || "",
  }));

  return (
    <SectionWrapper
      title="Competitors"
      subtext="Who they're up against. The AI uses this to position the brand correctly and avoid endorsing competitors."
      completionState={
        normalizedCompetitors.length > 0 || competitiveAdvantages || thingsNeverDo
          ? normalizedCompetitors.length > 0 && (competitiveAdvantages || thingsNeverDo)
            ? "complete"
            : "partial"
          : "empty"
      }
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="mos-label text-sm font-medium">Competitors</label>
          <RepeatingRow
            rows={normalizedCompetitors as any[]}
            onChange={(rows) => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("competitorList", JSON.stringify(rows.map((r) => ({ name: r.name, positioningNote: r.positioningNote }))));
              save(fd);
            }}
            maxRows={5}
            fields={[
              { id: "name", label: "Name", placeholder: "Competitor name" },
              { id: "positioningNote", label: "Positioning", placeholder: "How they position themselves", type: "textarea" },
            ]}
            itemLabel="competitor"
            onBlur={() => {
              const fd = new FormData();
              fd.set("slug", slug);
              fd.set("competitorList", JSON.stringify(normalizedCompetitors.map((r: { name: string; positioningNote: string }) => ({ name: r.name, positioningNote: r.positioningNote }))));
              save(fd);
            }}
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