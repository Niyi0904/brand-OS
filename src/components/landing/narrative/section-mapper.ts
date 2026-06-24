import type { LandingNarrative } from "../brand/brand-context";

export const SECTION_ORDER = [
  "hero",
  "problem",
  "solution",
  "product",
  "proof",
  "cta",
] as const;

export type SectionKey = (typeof SECTION_ORDER)[number];

export function mapNarrativeToSections(narrative: LandingNarrative): Array<{
  key: SectionKey;
  data: LandingNarrative[keyof LandingNarrative];
}> {
  return SECTION_ORDER.map((key) => ({
    key,
    data: narrative[key],
  }));
}
