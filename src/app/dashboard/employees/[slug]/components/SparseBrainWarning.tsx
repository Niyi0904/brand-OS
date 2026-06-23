"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";

interface SparseBrainWarningProps {
  brandName: string;
  brandSlug: string;
  isSparse: boolean;
}

export function SparseBrainWarning({
  brandName,
  brandSlug,
  isSparse,
}: SparseBrainWarningProps) {
  const [dismissed, setDismissed] = useState(false);

  // Check sessionStorage on mount
  useEffect(() => {
    const key = `sparse-brain-dismissed-${brandSlug}`;
    const stored = sessionStorage.getItem(key);
    if (stored === "true") {
      setDismissed(true);
    }
  }, [brandSlug]);

  if (!isSparse || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    const key = `sparse-brain-dismissed-${brandSlug}`;
    sessionStorage.setItem(key, "true");
  };

  return (
    <div
      className="mx-6 mb-2 flex items-center gap-3 rounded-lg border px-4 py-3"
      style={{
        backgroundColor: "rgba(251, 191, 36, 0.1)",
        borderColor: "rgba(251, 191, 36, 0.3)",
      }}
      role="alert"
    >
      <p className="flex-1 text-sm text-[var(--color-text-primary)]">
        Your Brand Brain for{" "}
        <span className="font-medium">{brandName}</span> is incomplete — the
        more you fill in, the better your results.
      </p>
      <Link
        href={`/dashboard/brands/${brandSlug}/settings`}
        className="whitespace-nowrap text-sm font-medium transition-colors hover:underline"
        style={{ color: "var(--brand-accent)" }}
      >
        Complete Brand Brain
      </Link>
      <button
        onClick={handleDismiss}
        className="flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-[var(--color-surface-2)]"
        aria-label="Dismiss warning"
      >
        <X className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" />
      </button>
    </div>
  );
}