"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { ArrowUp, Square } from "lucide-react";

interface ChatInputProps {
  placeholder: string;
  onSend: (message: string) => void;
  onStop: () => void;
  disabled?: boolean;
  isStreaming?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function ChatInput({
  placeholder,
  onSend,
  onStop,
  disabled = false,
  isStreaming = false,
  value: externalValue,
  onValueChange,
}: ChatInputProps) {
  const [internalValue, setInternalValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const value = externalValue !== undefined ? externalValue : internalValue;
  const setValue = onValueChange || setInternalValue;

  const MAX_CHARS = 4000;
  const WARN_CHARS = 3800;
  const charCount = value.length;
  const showCounter = charCount >= WARN_CHARS;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled || isStreaming) return;

    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isStreaming) {
        onStop();
      } else {
        handleSubmit();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_CHARS) {
      setValue(newValue);
    }
  };

  return (
    <div className="relative border-t border-[var(--color-border)] bg-[var(--color-bg)]">
      {/* Top fade gradient */}
      <div
        className="pointer-events-none absolute -top-8 left-0 right-0 h-8"
        style={{
          background: "linear-gradient(transparent, var(--color-bg))",
        }}
      />

      <div className="p-4 pt-3">
        <div className="relative flex items-end gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-1)] p-3 transition-colors focus-within:border-[var(--brand-accent)]">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none disabled:cursor-not-allowed disabled:text-[var(--color-text-tertiary)]"
            style={{ minHeight: "32px", maxHeight: "160px" }}
            aria-label={placeholder}
          />
          <button
            onClick={isStreaming ? onStop : handleSubmit}
            disabled={!isStreaming && (!value.trim() || disabled)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all"
            style={{
              backgroundColor: isStreaming
                ? "var(--color-red)"
                : value.trim()
                  ? "var(--brand-accent)"
                  : "var(--color-surface-3)",
              color: value.trim() || isStreaming ? "white" : "var(--color-text-tertiary)",
            }}
            aria-label={isStreaming ? "Stop generating" : "Send message"}
          >
            {isStreaming ? (
              <Square className="h-4 w-4 fill-current" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="mt-1 flex justify-between px-1">
          <p className="text-xs text-[var(--color-text-tertiary)]">
            Enter to send · Shift+Enter for new line
          </p>
          {showCounter && (
            <p
              className={`text-xs ${
                charCount >= MAX_CHARS
                  ? "text-[var(--color-red)]"
                  : "text-[var(--color-text-tertiary)]"
              }`}
            >
              {charCount}/{MAX_CHARS}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}