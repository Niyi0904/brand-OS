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
  if (brandBrain.tagline) identityParts.push(`Tagline: ${sanitizeBrandField(brandBrain.tagline)}`);
  if (brandBrain.websiteUrl) identityParts.push(`Website: ${sanitizeBrandField(brandBrain.websiteUrl)}`);
  if (brandBrain.industry) identityParts.push(`Industry: ${sanitizeBrandField(brandBrain.industry)}`);
  if (brandBrain.foundedYear) identityParts.push(`Founded: ${sanitizeBrandField(String(brandBrain.foundedYear))}`);
  if (identityParts.length > 0) {
    sections.push(`## Brand Identity\n${identityParts.join("\n")}`);
  }

  // Section 2: Mission & values
  const missionVal = brandBrain.missionStatement || brandBrain.mission;
  if (missionVal) sections.push(`## Mission\n${sanitizeBrandField(missionVal)}`);

  if (brandBrain.vision) sections.push(`## Vision\n${sanitizeBrandField(brandBrain.vision)}`);

  const valuesData = tryParseJsonArray(brandBrain.coreValues);
  if (valuesData.length > 0) {
    sections.push(`## Core Values\n${valuesData.map((v: string) => `- ${sanitizeBrandField(v)}`).join("\n")}`);
  } else if (brandBrain.values) {
    sections.push(`## Values\n${sanitizeBrandField(brandBrain.values)}`);
  }

  if (brandBrain.brandPromise) sections.push(`## Brand Promise\n${sanitizeBrandField(brandBrain.brandPromise)}`);

  // Section 3: Voice & tone
  const voiceTags = tryParseJsonArray(brandBrain.voiceAdjectives);
  if (voiceTags.length > 0) {
    sections.push(`## Voice Adjectives\n${voiceTags.map((v: string) => `- ${sanitizeBrandField(v)}`).join("\n")}`);
  } else if (brandBrain.toneOfVoice) {
    sections.push(`## Tone of Voice\n${sanitizeBrandField(brandBrain.toneOfVoice)}`);
  }

  const toneDesc = brandBrain.toneDescription || brandBrain.toneOfVoice;
  if (toneDesc && !brandBrain.voiceAdjectives) sections.push(`## Tone Description\n${sanitizeBrandField(toneDesc)}`);

  const writingStyle = brandBrain.writingStyleNotes || brandBrain.writingStyle;
  if (writingStyle) sections.push(`## Writing Style\n${sanitizeBrandField(writingStyle)}`);

  if (brandBrain.thingsToAvoid) sections.push(`## Things to Avoid\n${sanitizeBrandField(brandBrain.thingsToAvoid)}`);

  // Section 4: Target audience
  const audienceDesc = brandBrain.primaryAudience || brandBrain.targetAudience;
  if (audienceDesc) sections.push(`## Target Audience\n${sanitizeBrandField(audienceDesc)}`);

  if (brandBrain.customerPersonas) sections.push(`## Customer Personas\n${sanitizeBrandField(brandBrain.customerPersonas)}`);
  if (brandBrain.audienceDemographics) sections.push(`## Audience Demographics\n${sanitizeBrandField(brandBrain.audienceDemographics)}`);
  if (brandBrain.audiencePainPoints) sections.push(`## Audience Pain Points\n${sanitizeBrandField(brandBrain.audiencePainPoints)}`);
  if (brandBrain.audienceVocabulary) sections.push(`## Audience Vocabulary\n${sanitizeBrandField(brandBrain.audienceVocabulary)}`);

  // Section 5: Products & services
  const productsData = tryParseJsonArray(brandBrain.productList);
  if (productsData.length > 0) {
    const lines = productsData.map((p: any) => {
      if (typeof p === "string") return `- ${sanitizeBrandField(p)}`;
      return `- ${sanitizeBrandField(p.name || "Product")}: ${sanitizeBrandField(p.oneLiner || "")}`;
    });
    sections.push(`## Products & Services\n${lines.join("\n")}`);
  } else if (brandBrain.products) {
    sections.push(`## Products\n${sanitizeBrandField(brandBrain.products)}`);
  }

  if (brandBrain.services) sections.push(`## Services\n${sanitizeBrandField(brandBrain.services)}`);
  if (brandBrain.pricingTier) sections.push(`## Pricing Tier\n${sanitizeBrandField(brandBrain.pricingTier)}`);
  if (brandBrain.keyDifferentiators) sections.push(`## Key Differentiators\n${sanitizeBrandField(brandBrain.keyDifferentiators)}`);

  // Section 6: Competitors
  const compData = tryParseJsonArray(brandBrain.competitorList);
  if (compData.length > 0) {
    const lines = compData.map((c: any) => {
      if (typeof c === "string") return `- ${sanitizeBrandField(c)}`;
      return `- ${sanitizeBrandField(c.name || "Competitor")}: ${sanitizeBrandField(c.positioningNote || "")}`;
    });
    sections.push(`## Competitors\n${lines.join("\n")}`);
  } else if (brandBrain.competitors) {
    sections.push(`## Competitors\n${sanitizeBrandField(brandBrain.competitors)}`);
  }

  if (brandBrain.competitiveAdvantages) sections.push(`## Competitive Advantages\n${sanitizeBrandField(brandBrain.competitiveAdvantages)}`);
  if (brandBrain.thingsNeverDo) sections.push(`## Things We Never Do\n${sanitizeBrandField(brandBrain.thingsNeverDo)}`);

  // Section 7: SEO & keywords
  const primaryKw = tryParseJsonArray(brandBrain.primaryKeywords);
  if (primaryKw.length > 0) {
    sections.push(`## Primary Keywords\n${primaryKw.map((k: string) => `- ${sanitizeBrandField(k)}`).join("\n")}`);
  } else if (brandBrain.seoKeywords) {
    sections.push(`## SEO Keywords\n${sanitizeBrandField(brandBrain.seoKeywords)}`);
  }

  const secondaryKw = tryParseJsonArray(brandBrain.secondaryKeywords);
  if (secondaryKw.length > 0) {
    sections.push(`## Secondary Keywords\n${secondaryKw.map((k: string) => `- ${sanitizeBrandField(k)}`).join("\n")}`);
  }

  if (brandBrain.topicsToOwn) sections.push(`## Topics to Own\n${sanitizeBrandField(brandBrain.topicsToOwn)}`);
  if (brandBrain.topicsToAvoid) sections.push(`## Topics to Avoid\n${sanitizeBrandField(brandBrain.topicsToAvoid)}`);

  if (brandBrain.brandColors) sections.push(`## Brand Colors\n${sanitizeBrandField(brandBrain.brandColors)}`);
  if (brandBrain.typography) sections.push(`## Typography\n${sanitizeBrandField(brandBrain.typography)}`);

  // Section 8: FAQs
  const faqData = tryParseJsonArray(brandBrain.faqList);
  if (faqData.length > 0) {
    const lines = faqData.map((faq: any, i: number) => {
      if (typeof faq === "string") return `Q: ${sanitizeBrandField(faq)}`;
      return `Q${i + 1}: ${sanitizeBrandField(faq.question || "")}\nA: ${sanitizeBrandField(faq.answer || "")}`;
    });
    sections.push(`## FAQs\n${lines.join("\n\n")}`);
  } else if (brandBrain.faqs) {
    sections.push(`## FAQs\n${sanitizeBrandField(brandBrain.faqs)}`);
  }

  // Section 9: Additional context
  if (brandBrain.freeformNotes) sections.push(`## Notes\n${sanitizeBrandField(brandBrain.freeformNotes)}`);
  if (brandBrain.contentExamples) sections.push(`## Content Examples\n${sanitizeBrandField(brandBrain.contentExamples)}`);
  if (brandBrain.brandStory) sections.push(`## Brand Story\n${sanitizeBrandField(brandBrain.brandStory)}`);

  if (brandBrain.preferredPlatforms) sections.push(`## Preferred Platforms\n${sanitizeBrandField(brandBrain.preferredPlatforms)}`);
  if (brandBrain.businessInfo) sections.push(`## Business Information\n${sanitizeBrandField(brandBrain.businessInfo)}`);
  if (brandBrain.locations) sections.push(`## Locations\n${sanitizeBrandField(brandBrain.locations)}`);
  if (brandBrain.goals) sections.push(`## Goals\n${sanitizeBrandField(brandBrain.goals)}`);
  if (brandBrain.marketingStrategy) sections.push(`## Marketing Strategy\n${sanitizeBrandField(brandBrain.marketingStrategy)}`);
  if (brandBrain.offers) sections.push(`## Offers\n${sanitizeBrandField(brandBrain.offers)}`);
  if (brandBrain.brandRules) sections.push(`## Brand Rules\n${sanitizeBrandField(brandBrain.brandRules)}`);

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