"use client";

import { useSectionAutoSave } from "../use-section-auto-save";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { RepeatingRow } from "@/components/ui/repeating-row";

interface FaqsSectionProps {
  slug: string;
  faqList: string;
}

export function FaqsSection({ slug, faqList }: FaqsSectionProps) {
  const { save } = useSectionAutoSave("faqs", slug);

  const faqs = (() => {
    try {
      return JSON.parse(faqList || "[]");
    } catch {
      return [];
    }
  })();

  interface FaqRow {
    id: string;
    question: string;
    answer: string;
    [key: string]: string;
  }
  const normalizedFaqs = faqs.map((f: any, i: number) => ({
    id: `faq-${i}-${Date.now()}`,
    question: typeof f === "string" ? f : f.question || "",
    answer: typeof f === "string" ? "" : f.answer || "",
  }));

  return (
    <SectionWrapper
      title="FAQs"
      subtext="Questions customers actually ask. The AI uses these for accuracy when addressing common objections."
      completionState={normalizedFaqs.length > 0 ? "complete" : "empty"}
    >
      <div className="space-y-2">
        <label className="mos-label text-sm font-medium">Frequently asked questions</label>
          <RepeatingRow
            rows={normalizedFaqs as any[]}
          onChange={(rows) => {
            const fd = new FormData();
            fd.set("slug", slug);
            fd.set("faqList", JSON.stringify(rows.map((r: any) => ({ question: r.question, answer: r.answer }))));
            save(fd);
          }}
          maxRows={15}
          fields={[
            { id: "question", label: "Question", placeholder: "What do customers ask?" },
            { id: "answer", label: "Answer", placeholder: "How the brand responds", type: "textarea" },
          ]}
          itemLabel="faq"
          onBlur={() => {
            const fd = new FormData();
            fd.set("slug", slug);
            fd.set("faqList", JSON.stringify(normalizedFaqs.map((r: any) => ({ question: r.question, answer: r.answer }))));
            save(fd);
          }}
        />
      </div>
    </SectionWrapper>
  );
}