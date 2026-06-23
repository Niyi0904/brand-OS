"use client";

import { useEffect, useState } from "react";
import { EMPLOYEE_SUGGESTED_PROMPTS } from "@/lib/ai-employees/default-employees";
import { EmployeeAvatar } from "./EmployeeAvatar";

interface SuggestedPromptsProps {
  employeeSlug: string | null;
  employeeName: string;
  employeeIcon: string | null;
  employeeAccent: string | null;
  brandName: string;
  onSelect: (prompt: string) => void;
}

export function SuggestedPrompts({
  employeeSlug,
  employeeName,
  employeeIcon,
  employeeAccent,
  brandName,
  onSelect,
}: SuggestedPromptsProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Stagger animation on mount
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const prompts = employeeSlug
    ? EMPLOYEE_SUGGESTED_PROMPTS[employeeSlug] || []
    : [];

  if (prompts.length === 0) return null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
      <div className="mx-auto max-w-[640px] text-center">
        <div className="mb-4 flex justify-center">
          <EmployeeAvatar
            name={employeeName}
            icon={employeeIcon}
            accentColor={employeeAccent}
            size={40}
          />
        </div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
          {employeeName} is ready to work
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Start a conversation about {brandName}. The more context you provide in
          your Brand Brain, the better the output.
        </p>
      </div>

      <div className="mt-8 grid w-full max-w-[640px] grid-cols-1 gap-3 sm:grid-cols-2">
        {prompts.map((prompt: string, index: number) => {
          const displayPrompt = prompt.replace(
            /\[Brand Name\]/g,
            brandName
          );
          return (
            <button
              key={index}
              onClick={() => onSelect(displayPrompt)}
              className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)] p-4 text-left transition-all duration-150 hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-2)] focus:outline-2 focus:outline-[var(--brand-accent)]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
                transition: `all 200ms ease-out ${index * 60}ms`,
              }}
            >
              <div className="mb-2">
                <EmployeeAvatar
                  name={employeeName}
                  icon={employeeIcon}
                  accentColor={employeeAccent}
                  size={20}
                />
              </div>
              <p className="line-clamp-2 text-sm font-medium text-[var(--color-text-primary)]">
                {displayPrompt}
              </p>
              <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">
                Try this
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}