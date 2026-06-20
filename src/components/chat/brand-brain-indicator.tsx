"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BrandBrainIndicatorProps {
  brandName: string;
  brandId: string;
}

export function BrandBrainIndicator({ brandName, brandId }: BrandBrainIndicatorProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="hidden lg:block">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setExpanded(!expanded)}
        className="gap-2 px-3 py-1.5"
        aria-expanded={expanded}
        aria-label="Brand Brain indicator"
      >
        <span className="h-2 w-2 rounded-full bg-[var(--color-green)]" />
        <span className="text-xs text-[var(--color-text-secondary)]">
          Working for: {brandName}
        </span>
        <span className="text-xs text-[var(--color-text-tertiary)]">· Brand Brain active</span>
        {expanded ? (
          <ChevronDown className="h-3 w-3 text-[var(--color-text-tertiary)]" />
        ) : (
          <ChevronRight className="h-3 w-3 text-[var(--color-text-tertiary)]" />
        )}
      </Button>
    </div>
  );
}