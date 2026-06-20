"use client";

import { SectionCompletionDot } from "@/components/ui/section-completion-dot";

interface SectionWrapperProps {
  title: string;
  subtext: string;
  completionState: "empty" | "partial" | "complete";
  children: React.ReactNode;
  className?: string;
}

export function SectionWrapper({
  title,
  subtext,
  completionState,
  children,
  className = "",
}: SectionWrapperProps) {
  return (
    <section className={`border-b border-[var(--color-border)] pb-8 pt-8 last:border-b-0 ${className}`}>
      <div className="mb-5 flex items-center gap-3">
        <SectionCompletionDot state={completionState} sectionName={title} />
        <div>
          <h2 className="text-lg font-semibold leading-tight text-[var(--color-text-primary)]">{title}</h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{subtext}</p>
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}