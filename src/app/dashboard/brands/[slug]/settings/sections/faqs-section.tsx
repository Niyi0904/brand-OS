"use client";

import { useState } from "react";
import { useSectionAutoSave } from "../use-section-auto-save";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { RepeatingRow, type RowData } from "@/components/ui/repeating-row";

interface FaqsSectionProps {
  slug: string;
  faqList: string;
}

function parseFaqs(raw: string): RowData[] {
  try {
    const arr = JSON.parse(raw || "[]");
    return arr.map((f: any, i: number) => ({
      id: `faq-${i}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      question: typeof f === "string" ? f : f.question || "",
      answer: typeof f === "string" ? "" : f.answer || "",
    }));
  } catch {
    return [];
  }
}

export function FaqsSection({ slug, faqList }: FaqsSectionProps) {
  const { save } = useSectionAutoSave("faqs", slug);

  // Local state so "Add another" works immediately
  // ALWAYS show at least one empty row so input fields are visible
  const [localFaqs, setLocalFaqs] = useState<RowData[]>(() => {
    const parsed = parseFaqs(faqList);
    if (parsed.length === 0) {
      return [{ id: crypto.randomUUID(), question: "", answer: "" }];
    }
    return parsed;
  });

  const handleFaqsChange = (rows: RowData[]) => {
    setLocalFaqs(rows);
    const fd = new FormData();
    fd.set("slug", slug);
    fd.set("faqList", JSON.stringify(rows.map((r) => ({ question: r.question, answer: r.answer }))));
    save(fd);
  };

  return (
    <SectionWrapper
      title="FAQs"
      subtext="Questions customers actually ask. The AI uses these for accuracy when addressing common objections."
      completionState={localFaqs.length > 0 ? "complete" : "empty"}
    >
      <div className="space-y-2">
        <label className="mos-label text-sm font-medium">Frequently asked questions</label>
        <RepeatingRow
          rows={localFaqs}
          onChange={handleFaqsChange}
          maxRows={15}
          fields={[
            { id: "question", label: "Question", placeholder: "What do customers ask?" },
            { id: "answer", label: "Answer", placeholder: "How the brand responds", type: "textarea" },
          ]}
          itemLabel="faq"
        />
      </div>
    </SectionWrapper>
  );
}