"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  employeeId: string;
  brandId: string;
  conversationId?: string;
  placeholder: string;
  onSend?: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({
  employeeId,
  brandId,
  conversationId,
  placeholder,
  onSend,
  disabled = false,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_CHARS = 4000;
  const WARN_CHARS = 3500;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    onSend?.(trimmed);
    setValue("");
    setCharCount(0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_CHARS) {
      setValue(newValue);
      setCharCount(newValue.length);
    }
  };

  const showCounter = charCount >= WARN_CHARS;

  return (
    <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)] p-4">
      <div className="mx-auto max-w-[860px]">
        <div className="relative flex items-end gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 transition-colors focus-within:border-[var(--brand-accent)]">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none disabled:cursor-not-allowed disabled:text-[var(--color-text-tertiary)]"
            style={{ minHeight: "24px", maxHeight: "200px" }}
          />
          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={!value.trim() || disabled}
            className="h-9 w-9 shrink-0 rounded-lg transition-colors"
            style={{
              backgroundColor: value.trim() ? "var(--brand-accent)" : "var(--color-surface-3)",
              color: value.trim() ? "var(--color-bg)" : "var(--color-text-tertiary)",
            }}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-1 flex justify-between">
          <p className="text-xs text-[var(--color-text-tertiary)]">
            Press Enter to send, Shift+Enter for new line
          </p>
          {showCounter && (
            <p className={`text-xs ${charCount >= MAX_CHARS ? "text-[var(--color-red)]" : "text-[var(--color-text-tertiary)]"}`}>
              {charCount}/{MAX_CHARS}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}