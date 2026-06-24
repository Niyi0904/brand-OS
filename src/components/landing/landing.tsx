"use client";

import { useEffect } from "react";

import type { BrandLandingBrain } from "./brand/brand-context";
import { buildLandingNarrative } from "./narrative/buildNarrative";
import { generateBrandTheme, injectBrandTheme } from "./brand/brand-themes";
import { ScrollProvider } from "./scroll/ScrollProvider";
import { Hero } from "./sections/Hero";
import { ProblemSection } from "./sections/Problem";
import { SolutionSection } from "./sections/Solution";
import { ProductSection } from "./sections/Product";
import { ProofSection } from "./sections/Proof";
import { CTASection } from "./sections/CTA";

interface LandingPageProps {
  brand: BrandLandingBrain;
}

export function LandingPage({ brand }: LandingPageProps) {
  const narrative = buildLandingNarrative(brand);
  const theme = generateBrandTheme(brand);

  useEffect(() => {
    injectBrandTheme(theme);
  }, [theme]);

  return (
    <ScrollProvider>
      <Hero brand={brand} narrative={narrative.hero} />
      <ProblemSection narrative={narrative.problem} />
      <SolutionSection narrative={narrative.solution} />
      <ProductSection narrative={narrative.product} />
      <ProofSection narrative={narrative.proof} />
      <CTASection narrative={narrative.cta} />
    </ScrollProvider>
  );
}
