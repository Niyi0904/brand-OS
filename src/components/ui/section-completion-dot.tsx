"use client";

interface SectionCompletionDotProps {
  state: "empty" | "partial" | "complete";
  sectionName: string;
}

export function SectionCompletionDot({ state, sectionName }: SectionCompletionDotProps) {
  const stateLabel = state === "complete" ? "complete" : state === "partial" ? "partial" : "empty";

  const baseClasses = "inline-block h-2 w-2 rounded-full transition-[background-color,border-color] duration-300 ease";
  const stateClasses = {
    empty: "border-[1.5px] border-[var(--color-border-hover)] bg-transparent",
    partial: "bg-[var(--color-amber)] opacity-80",
    complete: "bg-[var(--color-green)]",
  };

  return (
    <span
      className={`${baseClasses} ${stateClasses[state]}`}
      aria-label={`${sectionName}: ${stateLabel}`}
      role="status"
    />
  );
}