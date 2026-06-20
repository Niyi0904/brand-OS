"use client";

import { Check, AlertCircle } from "lucide-react";

export type SaveState = "idle" | "saving" | "saved" | "error";

interface SavedIndicatorProps {
  state: SaveState;
}

export function SavedIndicator({ state }: SavedIndicatorProps) {
  if (state === "idle") return null;

  return (
    <div
      aria-live="polite"
      className="animate-fade-in inline-flex items-center gap-1 text-xs"
    >
      {state === "saving" && (
        <span className="text-[var(--color-text-tertiary)]">Saving...</span>
      )}
      {state === "saved" && (
        <span className="inline-flex items-center gap-1 text-[var(--color-green)]">
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Saved</span>
        </span>
      )}
      {state === "error" && (
        <span
          className="inline-flex items-center gap-1 text-[var(--color-red)]"
          role="alert"
        >
          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Save failed — check your connection</span>
        </span>
      )}
    </div>
  );
}