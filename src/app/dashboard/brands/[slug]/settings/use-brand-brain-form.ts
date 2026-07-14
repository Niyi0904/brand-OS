"use client";

import { useCallback, useRef, useState } from "react";
import type { SettingsActionState } from "./actions";

export type SaveState = "idle" | "saving" | "saved" | "error";
export type BrainFieldMap = Record<string, string>;

type UseBrandBrainFormOptions = {
  initialValues: BrainFieldMap;
};

type UseBrandBrainFormReturn = {
  values: BrainFieldMap;
  isDirty: boolean;
  saveState: SaveState;
  fieldErrors: Partial<Record<string, string[]>>;
  onFieldChange: (field: string, value: string) => void;
  handleActionResult: (result: SettingsActionState) => void;
  markSaving: () => void;
};

export function useBrandBrainForm({
  initialValues,
}: UseBrandBrainFormOptions): UseBrandBrainFormReturn {
  const [values, setValues] = useState<BrainFieldMap>(initialValues);
  const [isDirty, setIsDirty] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string[]>>>({});
  const initialRef = useRef<BrainFieldMap>(initialValues);
  const fadeTimer = useRef<ReturnType<typeof setTimeout>>();

  const onFieldChange = useCallback((field: string, value: string): void => {
    setValues((prev) => {
      const next = { ...prev, [field]: value };
      // isDirty: compare to the initial snapshot (only set dirty if changed)
      const dirty = Object.keys(next).some(
        (k) => next[k] !== (initialRef.current[k] ?? ""),
      );
      setIsDirty(dirty);
      return next;
    });
  }, []);

  const markSaving = useCallback((): void => {
    setSaveState("saving");
  }, []);

  const handleActionResult = useCallback(
    (result: SettingsActionState): void => {
      if (result.errors) {
        setSaveState("error");
        setFieldErrors(result.errors as Partial<Record<string, string[]>>);
        return;
      }
      if (result.message && !result.errors) {
        setSaveState("saved");
        setIsDirty(false);
        setFieldErrors({});
        // Update the initial snapshot so isDirty computes correctly after next edit
        initialRef.current = { ...values };
        clearTimeout(fadeTimer.current);
        fadeTimer.current = setTimeout(() => setSaveState("idle"), 3_000);
      }
    },
    [values],
  );

  return {
    values,
    isDirty,
    saveState,
    fieldErrors,
    onFieldChange,
    handleActionResult,
    markSaving,
  };
}
