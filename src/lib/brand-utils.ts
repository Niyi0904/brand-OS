import type { BrandBrain } from "@prisma/client";

/**
 * Computes the completeness percentage of a BrandBrain record.
 * Counts non-null, non-empty fields out of the total Brand Brain fields.
 * Uses the M2 9-section structure for calculation.
 */
export function computeBrandBrainCompleteness(brandBrain: BrandBrain | null): number {
  if (!brandBrain) return 0;

  const fields: (keyof BrandBrain)[] = [
    // Section 1: Brand identity
    "tagline", "websiteUrl", "industry",
    // Section 2: Mission & values
    "missionStatement", "coreValues", "brandPromise",
    // Section 3: Voice & tone
    "voiceAdjectives", "toneDescription", "writingStyleNotes", "thingsToAvoid",
    // Section 4: Target audience
    "primaryAudience", "audienceDemographics", "audiencePainPoints", "audienceVocabulary",
    // Section 5: Products & services
    "productList", "pricingTier", "keyDifferentiators",
    // Section 6: Competitors
    "competitorList", "competitiveAdvantages", "thingsNeverDo",
    // Section 7: SEO & keywords
    "primaryKeywords", "secondaryKeywords", "topicsToOwn", "topicsToAvoid",
    // Section 8: FAQs
    "faqList",
    // Section 9: Additional context
    "freeformNotes", "contentExamples", "brandStory",
  ];

  const filled = fields.filter((field) => {
    const value = brandBrain[field];
    return value !== null && value !== "" && value !== undefined;
  });

  return Math.round((filled.length / fields.length) * 100);
}

/**
 * Computes the completion state for each of the 9 sections.
 * Returns an array of { sectionId, state } objects.
 */
export function computeSectionCompletionStates(brandBrain: BrandBrain | null): SectionCompletionState[] {
  if (!brandBrain) {
    return SECTION_DEFINITIONS.map((s) => ({ sectionId: s.id, state: "empty" as const }));
  }

  return SECTION_DEFINITIONS.map((section) => {
    const filledCount = section.fields.filter((field) => {
      const value = brandBrain[field as keyof BrandBrain];
      return value !== null && value !== "" && value !== undefined;
    }).length;

    let state: "empty" | "partial" | "complete";
    if (filledCount === 0) {
      state = "empty";
    } else if (filledCount >= section.fields.length) {
      state = "complete";
    } else {
      state = "partial";
    }

    return { sectionId: section.id, state };
  });
}

export interface SectionCompletionState {
  sectionId: string;
  state: "empty" | "partial" | "complete";
}

export const SECTION_DEFINITIONS = [
  { id: "brand-identity", fields: ["tagline", "websiteUrl", "industry", "foundedYear"] },
  { id: "mission-values", fields: ["missionStatement", "coreValues", "brandPromise"] },
  { id: "voice-tone", fields: ["voiceAdjectives", "toneDescription", "writingStyleNotes", "thingsToAvoid"] },
  { id: "target-audience", fields: ["primaryAudience", "audienceDemographics", "audiencePainPoints", "audienceVocabulary"] },
  { id: "products-services", fields: ["productList", "pricingTier", "keyDifferentiators"] },
  { id: "competitors", fields: ["competitorList", "competitiveAdvantages", "thingsNeverDo"] },
  { id: "seo-keywords", fields: ["primaryKeywords", "secondaryKeywords", "topicsToOwn", "topicsToAvoid"] },
  { id: "faqs", fields: ["faqList"] },
  { id: "additional-context", fields: ["freeformNotes", "contentExamples", "brandStory"] },
] as const;

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