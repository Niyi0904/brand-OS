"use client";

import { useState } from "react";
import { SectionWrapper } from "@/components/ui/section-wrapper";

const PRESET_COLORS = [
  "#7c6ff7",
  "#6366f1",
  "#3b82f6",
  "#06b6d4",
  "#10b981",
  "#84cc16",
  "#eab308",
  "#f97316",
  "#ef4444",
  "#ec4899",
  "#a855f7",
  "#78716c",
];

interface AppearanceSectionProps {
  slug: string;
  accentColour: string;
}

export function AppearanceSection({ slug, accentColour }: AppearanceSectionProps) {
  const [selected, setSelected] = useState(accentColour || "#7c6ff7");

  const handleSelect = (color: string) => {
    setSelected(color);
    const input = document.getElementById("accentColour") as HTMLInputElement | null;
    if (input) input.value = color;
  };

  return (
    <SectionWrapper
      title="Appearance"
      subtext="Choose an accent colour for this brand. It appears in the sidebar, buttons, and highlights."
      completionState={selected !== "#7c6ff7" ? "complete" : "empty"}
    >
      <div className="space-y-4">
        {/* Preset swatches */}
        <div className="flex flex-wrap gap-3">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              title={color}
              onClick={() => handleSelect(color)}
              className="h-8 w-8 rounded-full border-2 transition-all hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]"
              style={{
                backgroundColor: color,
                borderColor: selected === color ? "var(--color-text-primary)" : "transparent",
                boxShadow: selected === color ? `0 0 0 1px ${color}` : "none",
              }}
              aria-label={`Set accent colour to ${color}`}
              aria-pressed={selected === color}
            />
          ))}
        </div>

        {/* Custom color picker */}
        <div className="flex items-center gap-3">
          <label
            htmlFor="accentColour"
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-[var(--color-border)]"
          >
            <input
              id="accentColour"
              name="accentColour"
              type="color"
              value={selected}
              onChange={(e) => handleSelect(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <div
              className="h-5 w-5 rounded-full"
              style={{ backgroundColor: selected }}
            />
          </label>
          <span className="text-sm text-[var(--color-text-secondary)] font-mono">
            {selected}
          </span>
        </div>

        {/* Inline preview */}
        <div
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm"
          style={{
            backgroundColor: `${selected}1a`,
            color: selected,
            border: `1px solid ${selected}4d`,
          }}
        >
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: selected }} />
          <span>Preview</span>
        </div>
      </div>
    </SectionWrapper>
  );
}
