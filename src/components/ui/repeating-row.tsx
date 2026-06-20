"use client";

import { useState, useCallback } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";

interface FieldConfig {
  id: string;
  label: string;
  placeholder: string;
  type?: "text" | "textarea";
}

interface RowData {
  id: string;
  [key: string]: string;
}

interface RepeatingRowProps {
  rows: RowData[];
  onChange: (rows: RowData[]) => void;
  maxRows: number;
  fields: FieldConfig[];
  itemLabel: string;
  onBlur?: () => void;
}

export function RepeatingRow({
  rows,
  onChange,
  maxRows,
  fields,
  itemLabel,
  onBlur,
}: RepeatingRowProps) {
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());

  const addRow = useCallback(() => {
    if (rows.length >= maxRows) return;
    const newRow: RowData = { id: crypto.randomUUID() };
    fields.forEach((f) => (newRow[f.id] = ""));
    onChange([...rows, newRow]);
  }, [rows, onChange, maxRows, fields]);

  const removeRow = useCallback(
    (id: string) => {
      setAnimatingIds((prev) => new Set(prev).add(id));
      setTimeout(() => {
        onChange(rows.filter((r) => r.id !== id));
        setAnimatingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 150);
    },
    [rows, onChange]
  );

  const updateRow = useCallback(
    (id: string, fieldId: string, value: string) => {
      onChange(
        rows.map((r) => (r.id === id ? { ...r, [fieldId]: value } : r))
      );
    },
    [rows, onChange]
  );

  const atMax = rows.length >= maxRows;

  return (
    <div className="space-y-2">
      {rows.map((row) => {
        const isAnimatingOut = animatingIds.has(row.id);
        return (
          <div
            key={row.id}
            className={`flex items-start gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)] p-3 ${
              isAnimatingOut
                ? "animate-row-collapse overflow-hidden"
                : "animate-row-expand"
            }`}
          >
            <div className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center text-[var(--color-text-tertiary)] transition-colors duration-150 hover:text-[var(--color-text-secondary)]">
              <GripVertical className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              {fields.map((field) => (
                <div key={field.id} className="flex-1">
                  {field.type === "textarea" ? (
                    <textarea
                      value={row[field.id] || ""}
                      onChange={(e) => updateRow(row.id, field.id, e.target.value)}
                      onBlur={onBlur}
                      placeholder={field.placeholder}
                      rows={2}
                      className="mos-input min-h-[40px] w-full resize-y rounded-md px-3 py-2 text-sm transition-[border-color] duration-150 focus-visible:border-[var(--brand-accent)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]"
                      aria-label={field.label}
                    />
                  ) : (
                    <input
                      type="text"
                      value={row[field.id] || ""}
                      onChange={(e) => updateRow(row.id, field.id, e.target.value)}
                      onBlur={onBlur}
                      placeholder={field.placeholder}
                      className="mos-input h-10 w-full rounded-md px-3 text-sm transition-[border-color] duration-150 focus-visible:border-[var(--brand-accent)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]"
                      aria-label={field.label}
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => removeRow(row.id)}
              className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center text-[var(--color-text-tertiary)] transition-colors duration-150 hover:text-[var(--color-red)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]"
              aria-label={`Remove ${itemLabel}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
      {!atMax ? (
        <button
          type="button"
          onClick={addRow}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm text-[var(--color-text-secondary)] transition-all duration-150 hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Add another</span>
        </button>
      ) : (
        <p className="px-1 text-xs text-[var(--color-text-tertiary)]">
          Maximum {maxRows} {itemLabel.toLowerCase()}s added
        </p>
      )}
    </div>
  );
}