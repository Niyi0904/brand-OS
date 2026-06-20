"use client";

import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
  onBlur?: () => void;
  disabled?: boolean;
}

export function TagInput({
  tags,
  onChange,
  maxTags,
  placeholder = "Type and press Enter",
  onBlur,
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;
      if (maxTags !== undefined && tags.length >= maxTags) return;
      if (tags.includes(trimmed)) return;
      onChange([...tags, trimmed]);
      setInputValue("");
    },
    [tags, onChange, maxTags]
  );

  const removeTag = useCallback(
    (index: number) => {
      onChange(tags.filter((_, i) => i !== index));
    },
    [tags, onChange]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    } else if (e.key === "Escape") {
      setInputValue("");
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const atMax = maxTags !== undefined && tags.length >= maxTags;

  return (
    <div
      className={`flex min-h-[44px] flex-wrap items-center gap-1.5 rounded-md border px-2 py-1.5 text-sm transition-[border-color] duration-150 ${
        disabled
          ? "cursor-not-allowed border-[var(--color-border)] bg-[var(--color-surface-2)] opacity-50"
          : focused
            ? "border-[var(--brand-accent)]"
            : "border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
      } ${disabled ? "" : "cursor-text"}`}
      onClick={handleContainerClick}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        // If there's text in the input, add it as a tag on blur
        if (inputValue.trim()) {
          addTag(inputValue);
        }
        onBlur?.();
      }}
    >
      {tags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className="animate-chip-enter inline-flex items-center gap-1 rounded-md border border-[var(--color-border-hover)] bg-[var(--color-surface-3)] px-2 py-0.5 text-xs text-[var(--color-text-primary)]"
        >
          <span>{tag}</span>
          {!disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="inline-flex items-center justify-center text-[var(--color-text-tertiary)] transition-colors duration-100 hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          )}
        </span>
      ))}
      {!atMax && (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="min-w-[60px] flex-1 border-none bg-transparent py-0.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none disabled:cursor-not-allowed"
          aria-label={placeholder}
        />
      )}
      {atMax && (
        <span className="px-1 text-xs text-[var(--color-text-tertiary)]">
          Maximum {maxTags} items
        </span>
      )}
    </div>
  );
}