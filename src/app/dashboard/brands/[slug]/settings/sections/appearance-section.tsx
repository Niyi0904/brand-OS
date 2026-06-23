"use client";

import { useSectionAutoSave } from "../use-section-auto-save";
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
  const { saveState } = useSectionAutoSave("appearance", slug);

  return (
    <SectionWrapper
      title="Appearance"
      subtext="Choose an accent colour for this brand. It appears in the sidebar, buttons, and highlights."
      completionState={accentColour ? "complete" : "empty"}
    >
      <div className="space-y-4">
        {/* Preset swatches */}
        <div className="flex flex-wrap gap-3">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              title={color}
              onClick={() => {
                const input = document.getElementById("accentColour") as HTMLInputElement;
                if (input) {
                  input.value = color;
                  input.dispatchEvent(new Event("input", { bubbles: true }));
                }
              }}
              className="h-8 w-8 rounded-full border-2 border-transparent transition-all hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]"
              style={{
                backgroundColor: color,
                borderColor: accentColour === color ? "var(--color-text-primary)" : "transparent",
                boxShadow: accentColour === color ? `0 0 0 1px ${color}` : "none",
              }}
              aria-label={`Set accent colour to ${color}`}
              aria-pressed={accentColour === color}
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
              defaultValue={accentColour || "#7c6ff7"}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              onChange={(e) => {
                // Live preview: update --brand-accent on the preview element
                const preview = document.getElementById("accent-preview");
                if (preview) {
                  preview.style.setProperty("--preview-color", e.target.value);
                }
              }}
            />
            <div
              className="h-5 w-5 rounded-full"
              style={{ backgroundColor: accentColour || "#7c6ff7" }}
            />
          </label>
          <span className="text-sm text-[var(--color-text-secondary)]">
            {accentColour || "#7c6ff7"}
          </span>
        </div>

        {/* Inline preview */}
        {accentColour && (
          <div
            id="accent-preview"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm"
            style={{
              backgroundColor: `color-mix(in srgb, ${accentColour} 10%, transparent)`,
              color: accentColour,
              border: `1px solid color-mix(in srgb, ${accentColour} 30%, transparent)`,
              "--preview-color": accentColour,
            } as React.CSSProperties}
          >
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--preview-color)" }} />
            <span>Preview</span>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
