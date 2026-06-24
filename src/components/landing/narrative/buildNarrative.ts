import type { BrandLandingBrain, LandingNarrative } from "../brand/brand-context";
import { CTA_MAP } from "../brand/brand-context";

export function buildLandingNarrative(brain: BrandLandingBrain): LandingNarrative {
  const ctaText = CTA_MAP[brain.type] || CTA_MAP.default;

  return {
    hero: {
      pill: `${brain.brandName} — ${brain.tagline}`,
      headline: `One ${brain.brandName} memory.`,
      headlineAccent: "Infinite AI execution.",
      subtext: brain.valueProposition.length > 80
        ? brain.valueProposition
        : `${brain.brandName} gives every brand a strategic brain that specialist AI employees inherit. Manage multiple brands, stop repeating briefs, and produce on-brand marketing work at scale.`,
    },
    problem: {
      pill: "The problem",
      title: `Stop repeating ${brain.painPoints.primary}`,
      description: `Every time you brief a writer, strategist, or designer, you repeat the same brand context. ${brain.brandName} eliminates this by making brand memory a shared layer that every AI employee inherits automatically.`,
    },
    solution: {
      pill: "How it works",
      title: `${brain.brandName} now thinks for you`,
      description: "No complex configuration. Define your brand once and let AI do the rest.",
      steps: brain.howItWorks || [
        { step: "01", title: "Set your Brand Brain", description: "Define brand identity, voice, audience, products, and competitors in one place." },
        { step: "02", title: "Deploy AI Employees", description: "Activate specialist AI roles reading from the same brand memory." },
        { step: "03", title: "Execute & Iterate", description: "Generate campaigns, content, and analyses. Every output is on-brand by default." },
      ],
    },
    product: {
      pill: "Everything you need",
      title: "The operating system for AI-driven marketing teams",
      description: `From brand strategy to campaign execution, ${brain.brandName} connects context, people, and AI in one workspace.`,
      features: brain.features || [
        { title: "Brand Brain", description: "One source of truth for every brand that every AI employee inherits." },
        { title: "AI Employees", description: "Specialist marketing roles producing brand-aware work without repeated briefing." },
        { title: "Campaign Workflows", description: "Structured campaign plans with AI-assisted briefs and publishing pipelines." },
        { title: "Performance Signals", description: "Real-time metrics, trend detection, and recommendations." },
        { title: "Team Collaboration", description: "Invite team members and maintain a shared operating layer." },
        { title: "Analytics & Insights", description: "Content effectiveness scoring and brand health monitoring." },
      ],
    },
    proof: {
      pill: "Real results",
      title: "Loved by marketing operators",
      description: `See how teams use ${brain.brandName} to transform their marketing operations.`,
      items: brain.testimonials?.map(t => ({
        quote: t.quote,
        author: t.author,
        role: t.role,
      })) || brain.useCases.map(u => ({
        title: u.title,
        description: u.description,
      })),
    },
    cta: {
      pill: "Get started",
      title: `Ready to give every brand a ${brain.brandName} memory?`,
      description: `Start your 14-day free trial. No credit card required. Set up your first Brand Brain in under 5 minutes.`,
      buttonText: ctaText,
      buttonSubtext: ["No credit card", "14-day free trial", "Cancel anytime"],
    },
  };
}
