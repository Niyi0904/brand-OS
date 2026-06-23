"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ContextIndicatorProps {
  brandName: string;
  brandSlug: string;
  isBrainSparse: boolean;
  brainSummary: {
    tagline?: string | null;
    industry?: string | null;
    voiceAdjectives?: string | null;
    primaryAudience?: string | null;
    primaryKeywords?: string | null;
  };
}

export function ContextIndicator({
  brandName,
  brandSlug,
  isBrainSparse,
  brainSummary,
}: ContextIndicatorProps) {
  const [expanded, setExpanded] = useState(false);

  const dotColor = isBrainSparse ? "var(--amber)" : "var(--green)";
  const statusText = isBrainSparse
    ? "Brand Brain incomplete"
    : "Brand Brain active";

  return (
    <div className="w-full">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left transition-colors hover:bg-[var(--color-surface-1)]"
        aria-expanded={expanded}
        aria-controls="context-indicator-panel"
        aria-label="Brand Brain context indicator"
      >
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: dotColor }}
        />
        <span className="text-xs text-[var(--color-text-secondary)]">
          Working for: {brandName}
        </span>
        <span className="text-xs text-[var(--color-text-tertiary)]">
          · {statusText}
        </span>
        <span className="ml-auto text-[var(--color-text-tertiary)]">
          {expanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </span>
      </button>

      {expanded && (
        <div
          id="context-indicator-panel"
          className="mx-3 mt-1 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] p-4"
          style={{
            animation: "expandIn 200ms ease-out",
          }}
        >
          <div className="space-y-3">
            {brainSummary.tagline && (
              <div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Tagline
                </span>
                <p className="mt-0.5 text-sm text-[var(--color-text-primary)]">
                  {brainSummary.tagline}
                </p>
              </div>
            )}
            {brainSummary.industry && (
              <div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Industry
                </span>
                <p className="mt-0.5 text-sm text-[var(--color-text-primary)]">
                  {brainSummary.industry}
                </p>
              </div>
            )}
            {brainSummary.voiceAdjectives && (
              <div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Voice
                </span>
                <p className="mt-0.5 text-sm text-[var(--color-text-primary)]">
                  {brainSummary.voiceAdjectives}
                </p>
              </div>
            )}
            {brainSummary.primaryAudience && (
              <div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Target Audience
                </span>
                <p className="mt-0.5 text-sm text-[var(--color-text-primary)]">
                  {brainSummary.primaryAudience}
                </p>
              </div>
            )}
            {brainSummary.primaryKeywords && (
              <div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Keywords
                </span>
                <p className="mt-0.5 text-sm text-[var(--color-text-primary)]">
                  {brainSummary.primaryKeywords}
                </p>
              </div>
            )}
            {!brainSummary.tagline &&
              !brainSummary.industry &&
              !brainSummary.voiceAdjectives &&
              !brainSummary.primaryAudience && (
                <p className="text-sm text-[var(--color-text-tertiary)]">
                  No Brand Brain data yet. Fill in your brand details to get
                  better AI responses.
                </p>
              )}
          </div>
          <div className="mt-3 flex justify-end">
            <Link
              href={`/dashboard/brands/${brandSlug}/settings`}
              className="text-xs font-medium transition-colors hover:underline"
              style={{ color: "var(--brand-accent)" }}
            >
              Edit Brand Brain
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}