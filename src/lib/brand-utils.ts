import type { BrandBrain } from "@prisma/client";

/**
 * Computes the completeness percentage of a BrandBrain record.
 * Counts non-null, non-empty fields out of the total 21 Brand Brain fields.
 */
export function computeBrandBrainCompleteness(brandBrain: BrandBrain | null): number {
  if (!brandBrain) return 0;

  const fields: (keyof BrandBrain)[] = [
    "mission", "vision", "values",
    "targetAudience", "customerPersonas",
    "products", "services",
    "toneOfVoice", "brandColors", "typography",
    "competitors", "seoKeywords", "goals",
    "preferredPlatforms", "writingStyle",
    "marketingStrategy", "offers", "businessInfo",
    "locations", "faqs", "brandRules",
  ];

  const filled = fields.filter((field) => {
    const value = brandBrain[field];
    return value !== null && value !== "" && value !== undefined;
  });

  return Math.round((filled.length / fields.length) * 100);
}

/**
 * Returns a human-readable label for a completeness score range.
 */
export function getCompletenessLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 40) return "Needs work";
  return "Sparse";
}

/**
 * Returns a color token for a completeness score.
 */
export function getCompletenessColor(score: number): string {
  if (score >= 90) return "var(--color-positive)";
  if (score >= 70) return "var(--brand-accent)";
  if (score >= 40) return "var(--color-warning)";
  return "var(--color-danger)";
}