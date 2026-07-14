"use client";

import { useState } from "react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { RepeatingRow, type RowData } from "@/components/ui/repeating-row";
import { FieldError } from "@/components/ui/field-error";

interface FaqsSectionProps {
  faqList: string;
  onFieldChange: (field: string, value: string) => void;
  errors?: Partial<Record<string, string[]>>;
}

type RawFaq = { question?: string; answer?: string } | string;

function parseFaqs(raw: string): RowData[] {
  try {
    const arr = JSON.parse(raw || "[]") as RawFaq[];
    return arr.map((f, i) => ({
      id: `faq-${i}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      question: typeof f === "string" ? f : (f.question ?? ""),
      answer: typeof f === "string" ? "" : (f.answer ?? ""),
    }));
  } catch {
    return [];
  }
}

export function FaqsSection({ faqList, onFieldChange, errors }: FaqsSectionProps) {
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
    onFieldChange("faqList", JSON.stringify(rows.map((r) => ({ question: r.question, answer: r.answer }))));
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
        <input
          type="hidden"
          name="faqList"
          value={JSON.stringify(localFaqs.map((r) => ({ question: r.question, answer: r.answer })))}
        />
        <FieldError messages={errors?.faqList} />
      </div>
    </SectionWrapper>
  );
}
