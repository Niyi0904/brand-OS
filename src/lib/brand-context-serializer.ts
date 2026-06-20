import type { BrandBrain } from "@prisma/client";

/**
 * Serializes a BrandBrain record into a structured string for AI system prompts.
 * This is the single source of truth for how brand context is injected into AI employee prompts.
 */
export function serializeBrandForPrompt(brandBrain: BrandBrain | null): string {
  if (!brandBrain) return "";

  const sections: string[] = [];

  if (brandBrain.mission) sections.push(`## Mission\n${brandBrain.mission}`);
  if (brandBrain.vision) sections.push(`## Vision\n${brandBrain.vision}`);
  if (brandBrain.values) sections.push(`## Values\n${brandBrain.values}`);
  if (brandBrain.targetAudience) sections.push(`## Target Audience\n${brandBrain.targetAudience}`);
  if (brandBrain.customerPersonas) sections.push(`## Customer Personas\n${brandBrain.customerPersonas}`);
  if (brandBrain.products) sections.push(`## Products\n${brandBrain.products}`);
  if (brandBrain.services) sections.push(`## Services\n${brandBrain.services}`);
  if (brandBrain.toneOfVoice) sections.push(`## Tone of Voice\n${brandBrain.toneOfVoice}`);
  if (brandBrain.brandColors) sections.push(`## Brand Colors\n${brandBrain.brandColors}`);
  if (brandBrain.typography) sections.push(`## Typography\n${brandBrain.typography}`);
  if (brandBrain.competitors) sections.push(`## Competitors\n${brandBrain.competitors}`);
  if (brandBrain.seoKeywords) sections.push(`## SEO Keywords\n${brandBrain.seoKeywords}`);
  if (brandBrain.goals) sections.push(`## Goals\n${brandBrain.goals}`);
  if (brandBrain.preferredPlatforms) sections.push(`## Preferred Platforms\n${brandBrain.preferredPlatforms}`);
  if (brandBrain.writingStyle) sections.push(`## Writing Style\n${brandBrain.writingStyle}`);
  if (brandBrain.marketingStrategy) sections.push(`## Marketing Strategy\n${brandBrain.marketingStrategy}`);
  if (brandBrain.offers) sections.push(`## Offers\n${brandBrain.offers}`);
  if (brandBrain.businessInfo) sections.push(`## Business Information\n${brandBrain.businessInfo}`);
  if (brandBrain.locations) sections.push(`## Locations\n${brandBrain.locations}`);
  if (brandBrain.faqs) sections.push(`## FAQs\n${brandBrain.faqs}`);
  if (brandBrain.brandRules) sections.push(`## Brand Rules\n${brandBrain.brandRules}`);

  return sections.join("\n\n");
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