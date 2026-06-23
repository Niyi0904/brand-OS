"use client";

import type { Brand } from "@/lib/brand-context-provider";

type BrandAvatarProps = {
  brand: Brand;
  size?: 24 | 32 | 40;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  if (parts.length === 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const sizeMap = {
  24: { container: "h-6 w-6", text: "text-[0.625rem]" },
  32: { container: "h-8 w-8", text: "text-[0.6875rem]" },
  40: { container: "h-10 w-10", text: "text-[0.8125rem]" },
} as const;

export function BrandAvatar({ brand, size = 32 }: BrandAvatarProps) {
  const { container, text } = sizeMap[size];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full ${container} ${text} font-medium text-white shrink-0`}
      style={{ background: brand.accentColour || "var(--brand-accent, #7c6ff7)" }}
      aria-hidden="true"
    >
      {getInitials(brand.name)}
    </span>
  );
}
