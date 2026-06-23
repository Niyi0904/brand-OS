"use client";

import { useState } from "react";
import { Copy, Bookmark, RefreshCw, ThumbsDown, Check } from "lucide-react";

interface MessageActionsProps {
  messageId: string;
  content: string;
  onCopy: () => void;
  onSave: () => void;
  onRegenerate: () => void;
  onFeedback: () => void;
}

export function MessageActions({
  messageId,
  content,
  onCopy,
  onSave,
  onRegenerate,
  onFeedback,
}: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSave = async () => {
    try {
      await fetch("/api/library/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, content }),
      });
      setSaved(true);
      onSave();
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // Silently fail for M3
    }
  };

  const handleFeedback = () => {
    setFeedbackGiven(!feedbackGiven);
    onFeedback();
  };

  return (
    <div className="mt-2 flex gap-1">
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]"
        aria-label="Copy message"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-[var(--color-green)]" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
        <span>{copied ? "Copied" : "Copy"}</span>
      </button>

      <button
        onClick={handleSave}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]"
        aria-label="Save to Library"
      >
        <Bookmark
          className={`h-3.5 w-3.5 ${saved ? "fill-current" : ""}`}
        />
        <span>{saved ? "Saved" : "Save"}</span>
      </button>

      <button
        onClick={onRegenerate}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]"
        aria-label="Regenerate response"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        <span>Regenerate</span>
      </button>

      <button
        onClick={handleFeedback}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]"
        aria-label="Flag as unhelpful"
      >
        <ThumbsDown
          className={`h-3.5 w-3.5 ${
            feedbackGiven ? "fill-[var(--color-red)] text-[var(--color-red)]" : ""
          }`}
        />
        <span>Feedback</span>
      </button>
    </div>
  );
}