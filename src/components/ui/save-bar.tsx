"use client";
import React from "react";
import { Check, Loader2 } from "lucide-react";
import type { SaveState } from "@/app/dashboard/brands/[slug]/settings/use-brand-brain-form";
type SaveBarProps = { isDirty: boolean; saveState: SaveState; isPending: boolean; };
export function SaveBar({ isDirty, saveState, isPending }: SaveBarProps): React.ReactElement | null {
  if (!isDirty && saveState === "idle") return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t px-6 py-4"
      style={{ backgroundColor: "var(--color-surface-1)", borderColor: "var(--color-border)" }}>
      <span className="text-sm text-[var(--color-text-secondary)]">
        {isDirty && saveState === "idle" && "You have unsaved changes"}
        {saveState === "saving" && <span className="flex items-center gap-2"><Loader2 className="h-3 w-3 animate-spin" />Saving…</span>}
        {saveState === "saved" && <span className="flex items-center gap-2 text-green-400"><Check className="h-3 w-3" />Saved</span>}
        {saveState === "error" && <span style={{ color: "var(--color-danger)" }}>Save failed — please try again</span>}
      </span>
      <button type="submit" disabled={isPending || saveState === "saving"}
        className="rounded-md px-4 py-2 text-sm font-medium transition-opacity disabled:opacity-50"
        style={{ backgroundColor: "var(--brand-accent)", color: "#ffffff" }}>
        {isPending || saveState === "saving" ? "Saving…" : "Save now"}
      </button>
    </div>
  );
}
