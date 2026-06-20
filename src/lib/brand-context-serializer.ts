import type { BrandBrain } from "@prisma/client";

/**
 * Serializes a BrandBrain record into a structured string for AI system prompts.
 * This is the single source of truth for how brand context is injected into AI employee prompts.
 * Reads both M1 legacy fields and M2 spec fields, preferring M2 fields when available.
 */
export function serializeBrandForPrompt(brandBrain: BrandBrain | null): string {
  if (!brandBrain) return "";

  const sections: string[] = [];

  // Section 1: Brand identity
  const identityParts: string[] = [];
  if (brandBrain.tagline) identityParts.push(`Tagline: ${brandBrain.tagline}`);
  if (brandBrain.websiteUrl) identityParts.push(`Website: ${brandBrain.websiteUrl}`);
  if (brandBrain.industry) identityParts.push(`Industry: ${brandBrain.industry}`);
  if (brandBrain.foundedYear) identityParts.push(`Founded: ${brandBrain.foundedYear}`);
  if (identityParts.length > 0) {
    sections.push(`## Brand Identity\n${identityParts.join("\n")}`);
  }

  // Section 2: Mission & values
  const missionVal = brandBrain.missionStatement || brandBrain.mission;
  if (missionVal) sections.push(`## Mission\n${missionVal}`);

  if (brandBrain.vision) sections.push(`## Vision\n${brandBrain.vision}`);

  const valuesData = tryParseJsonArray(brandBrain.coreValues);
  if (valuesData.length > 0) {
    sections.push(`## Core Values\n${valuesData.map((v: string) => `- ${v}`).join("\n")}`);
  } else if (brandBrain.values) {
    sections.push(`## Values\n${brandBrain.values}`);
  }

  if (brandBrain.brandPromise) sections.push(`## Brand Promise\n${brandBrain.brandPromise}`);

  // Section 3: Voice & tone
  const voiceTags = tryParseJsonArray(brandBrain.voiceAdjectives);
  if (voiceTags.length > 0) {
    sections.push(`## Voice Adjectives\n${voiceTags.map((v: string) => `- ${v}`).join("\n")}`);
  } else if (brandBrain.toneOfVoice) {
    sections.push(`## Tone of Voice\n${brandBrain.toneOfVoice}`);
  }

  const toneDesc = brandBrain.toneDescription || brandBrain.toneOfVoice;
  if (toneDesc && !brandBrain.voiceAdjectives) sections.push(`## Tone Description\n${toneDesc}`);

  const writingStyle = brandBrain.writingStyleNotes || brandBrain.writingStyle;
  if (writingStyle) sections.push(`## Writing Style\n${writingStyle}`);

  if (brandBrain.thingsToAvoid) sections.push(`## Things to Avoid\n${brandBrain.thingsToAvoid}`);

  // Section 4: Target audience
  const audienceDesc = brandBrain.primaryAudience || brandBrain.targetAudience;
  if (audienceDesc) sections.push(`## Target Audience\n${audienceDesc}`);

  if (brandBrain.customerPersonas) sections.push(`## Customer Personas\n${brandBrain.customerPersonas}`);
  if (brandBrain.audienceDemographics) sections.push(`## Audience Demographics\n${brandBrain.audienceDemographics}`);
  if (brandBrain.audiencePainPoints) sections.push(`## Audience Pain Points\n${brandBrain.audiencePainPoints}`);
  if (brandBrain.audienceVocabulary) sections.push(`## Audience Vocabulary\n${brandBrain.audienceVocabulary}`);

  // Section 5: Products & services
  const productsData = tryParseJsonArray(brandBrain.productList);
  if (productsData.length > 0) {
    const lines = productsData.map((p: any) => {
      if (typeof p === "string") return `- ${p}`;
      return `- ${p.name || "Product"}: ${p.oneLiner || ""}`;
    });
    sections.push(`## Products & Services\n${lines.join("\n")}`);
  } else if (brandBrain.products) {
    sections.push(`## Products\n${brandBrain.products}`);
  }

  if (brandBrain.services) sections.push(`## Services\n${brandBrain.services}`);
  if (brandBrain.pricingTier) sections.push(`## Pricing Tier\n${brandBrain.pricingTier}`);
  if (brandBrain.keyDifferentiators) sections.push(`## Key Differentiators\n${brandBrain.keyDifferentiators}`);

  // Section 6: Competitors
  const compData = tryParseJsonArray(brandBrain.competitorList);
  if (compData.length > 0) {
    const lines = compData.map((c: any) => {
      if (typeof c === "string") return `- ${c}`;
      return `- ${c.name || "Competitor"}: ${c.positioningNote || ""}`;
    });
    sections.push(`## Competitors\n${lines.join("\n")}`);
  } else if (brandBrain.competitors) {
    sections.push(`## Competitors\n${brandBrain.competitors}`);
  }

  if (brandBrain.competitiveAdvantages) sections.push(`## Competitive Advantages\n${brandBrain.competitiveAdvantages}`);
  if (brandBrain.thingsNeverDo) sections.push(`## Things We Never Do\n${brandBrain.thingsNeverDo}`);

  // Section 7: SEO & keywords
  const primaryKw = tryParseJsonArray(brandBrain.primaryKeywords);
  if (primaryKw.length > 0) {
    sections.push(`## Primary Keywords\n${primaryKw.map((k: string) => `- ${k}`).join("\n")}`);
  } else if (brandBrain.seoKeywords) {
    sections.push(`## SEO Keywords\n${brandBrain.seoKeywords}`);
  }

  const secondaryKw = tryParseJsonArray(brandBrain.secondaryKeywords);
  if (secondaryKw.length > 0) {
    sections.push(`## Secondary Keywords\n${secondaryKw.map((k: string) => `- ${k}`).join("\n")}`);
  }

  if (brandBrain.topicsToOwn) sections.push(`## Topics to Own\n${brandBrain.topicsToOwn}`);
  if (brandBrain.topicsToAvoid) sections.push(`## Topics to Avoid\n${brandBrain.topicsToAvoid}`);

  if (brandBrain.brandColors) sections.push(`## Brand Colors\n${brandBrain.brandColors}`);
  if (brandBrain.typography) sections.push(`## Typography\n${brandBrain.typography}`);

  // Section 8: FAQs
  const faqData = tryParseJsonArray(brandBrain.faqList);
  if (faqData.length > 0) {
    const lines = faqData.map((faq: any, i: number) => {
      if (typeof faq === "string") return `Q: ${faq}`;
      return `Q${i + 1}: ${faq.question || ""}\nA: ${faq.answer || ""}`;
    });
    sections.push(`## FAQs\n${lines.join("\n\n")}`);
  } else if (brandBrain.faqs) {
    sections.push(`## FAQs\n${brandBrain.faqs}`);
  }

  // Section 9: Additional context
  if (brandBrain.freeformNotes) sections.push(`## Notes\n${brandBrain.freeformNotes}`);
  if (brandBrain.contentExamples) sections.push(`## Content Examples\n${brandBrain.contentExamples}`);
  if (brandBrain.brandStory) sections.push(`## Brand Story\n${brandBrain.brandStory}`);

  if (brandBrain.preferredPlatforms) sections.push(`## Preferred Platforms\n${brandBrain.preferredPlatforms}`);
  if (brandBrain.businessInfo) sections.push(`## Business Information\n${brandBrain.businessInfo}`);
  if (brandBrain.locations) sections.push(`## Locations\n${brandBrain.locations}`);
  if (brandBrain.goals) sections.push(`## Goals\n${brandBrain.goals}`);
  if (brandBrain.marketingStrategy) sections.push(`## Marketing Strategy\n${brandBrain.marketingStrategy}`);
  if (brandBrain.offers) sections.push(`## Offers\n${brandBrain.offers}`);
  if (brandBrain.brandRules) sections.push(`## Brand Rules\n${brandBrain.brandRules}`);

  return sections.join("\n\n");
}

/**
 * Tries to parse a JSON array string. Returns [] on failure.
 */
function tryParseJsonArray(value: string | null | undefined): any[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Sanitizes brand brain text fields to prevent prompt injection.
 * Strips markdown headers, limits length, and removes control characters.
 */
export function sanitizeBrandField(value: string, maxLength = 2000): string {
  return value
    .replace(/^#{1,6}\s+/gm, "") // strip markdown headers
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "") // strip control chars
    .trim()
    .slice(0, maxLength);
}