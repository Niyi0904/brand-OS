"use client";

import { useCallback, useRef, useState } from "react";
import type { SaveState } from "@/components/ui/saved-indicator";

export type { SaveState };

const SAVE_DEBOUNCE_MS = 300;
const SAVED_FADE_MS = 3000;
const OPTIMISTIC_SAVED_MS = 200;

export function useSectionAutoSave(sectionId: string, slug: string) {
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const optimisticRef = useRef<ReturnType<typeof setTimeout>>();
  const pendingDataRef = useRef<FormData | null>(null);
  const isSavingRef = useRef(false);

  const save = useCallback(
    async (formData: FormData) => {
      // Dispatch progress tracking events for all fields in the form data
      for (const [key, value] of formData.entries()) {
        if (key !== "slug" && typeof value === "string") {
          window.dispatchEvent(
            new CustomEvent("brain-field-change", {
              detail: { fieldId: key, value },
            })
          );
        }
      }

      if (isSavingRef.current) {
        // Queue the save if one is in-flight
        pendingDataRef.current = formData;
        return;
      }

      isSavingRef.current = true;
      setSaveState("saving");

      // Optimistic: show "Saved" after 200ms
      optimisticRef.current = setTimeout(() => {
        setSaveState("saved");
      }, OPTIMISTIC_SAVED_MS);

      try {
        const response = await fetch(`/api/brand-brain/${sectionId}`, {
          method: "POST",
          body: formData,
        });

        clearTimeout(optimisticRef.current);

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          if (process.env.NODE_ENV === "development") {
            console.warn(`Auto-save failed (${response.status}):`, error);
          }
          if (response.status === 401) {
            window.location.href = `/auth/signin?returnUrl=/dashboard/brands/${slug}/settings`;
            return;
          }
          throw new Error(error.error || "Save failed");
        }

        setSaveState("saved");

        // Auto-fade after 3s
        timerRef.current = setTimeout(() => {
          setSaveState("idle");
        }, SAVED_FADE_MS);

        // Process any queued save
        if (pendingDataRef.current) {
          const queued = pendingDataRef.current;
          pendingDataRef.current = null;
          setTimeout(() => save(queued), 100);
        }
      } catch {
        clearTimeout(optimisticRef.current);
        setSaveState("error");
        // Retry after 2s
        timerRef.current = setTimeout(() => {
          setSaveState("idle");
        }, 2000);
      } finally {
        isSavingRef.current = false;
      }
    },
    [sectionId, slug]
  );

  const debouncedSave = useCallback(
    (formData: FormData) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        save(formData);
      }, SAVE_DEBOUNCE_MS);
    },
    [save]
  );

  const cancelPending = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    pendingDataRef.current = null;
  }, []);

  return { saveState, save: debouncedSave, immediateSave: save, cancelPending };
}