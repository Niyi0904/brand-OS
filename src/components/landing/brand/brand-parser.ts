import type { Brand, BrandBrain } from "@prisma/client";
import type { BrandLandingBrain } from "./brand-context";

function parseJsonArray(value: string | null | undefined): any[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getUseCasesFromBrain(brandBrain: BrandBrain | null) {
  const products = parseJsonArray(brandBrain?.productList);
  if (products.length > 0) {
    return products.map((p: any) => ({
      title: typeof p === "string" ? p : p.name || "Product",
      description: typeof p === "string" ? "" : p.oneLiner || "",
    }));
  }
  return [];
}

function competitorsFromBrain(brandBrain: BrandBrain | null): string[] {
  const comps = parseJsonArray(brandBrain?.competitorList);
  if (comps.length > 0) {
    return comps.map((c: any) => (typeof c === "string" ? c : c.name || ""));
  }
  return [];
}

function parseColors(raw: string | null | undefined) {
  if (!raw) return { primary: "#7c9cff", secondary: "#a6bdff" };
  const lower = raw.toLowerCase();
  if (lower.includes("primary") || lower.includes("#")) {
    const match = raw.match(/#[a-f0-9]{3,8}/gi);
    if (match && match.length >= 2) return { primary: match[0], secondary: match[1] };
    if (match && match.length === 1) return { primary: match[0], secondary: match[0] };
  }
  return { primary: "#7c9cff", secondary: "#a6bdff" };
}

function inferType(brand: Brand, brandBrain: BrandBrain | null): "agency" | "creator" | "enterprise" | "default" {
  const name = (brand.name || "").toLowerCase();
  const desc = (brand.description || "").toLowerCase();
  const tagline = (brandBrain?.tagline || "").toLowerCase();
  const combined = `${name} ${desc} ${tagline}`;
  if (combined.includes("agency") || combined.includes("client")) return "agency";
  if (combined.includes("creator") || combined.includes("content creator")) return "creator";
  if (combined.includes("enterprise") || combined.includes("organization")) return "enterprise";
  return "default";
}

export function parseBrandBrain(brand: Brand, brandBrain: BrandBrain | null): BrandLandingBrain {
  return {
    brandName: brand.name,
    toneOfVoice: brandBrain?.toneDescription || brandBrain?.toneOfVoice || "Confident, clear, premium",
    audience: brandBrain?.primaryAudience || brandBrain?.targetAudience || "Marketing teams, agency owners, brand managers",
    valueProposition: brandBrain?.brandPromise || brandBrain?.missionStatement || "One brand memory. Infinite AI execution.",
    painPoints: {
      primary: brandBrain?.audiencePainPoints || "repeating brand context in every brief",
      secondary: brandBrain?.thingsToAvoid || undefined,
    },
    competitors: competitorsFromBrain(brandBrain),
    brandColors: parseColors(brandBrain?.brandColors || brand.accentColour),
    tagline: brandBrain?.tagline || "AI-Powered Brand & Marketing Operating System",
    useCases: getUseCasesFromBrain(brandBrain),
    type: inferType(brand, brandBrain),
  };
}

export function createDefaultBrain(): BrandLandingBrain {
  return {
    brandName: "MarketingOS",
    toneOfVoice: "Confident, clear, premium",
    audience: "Marketing teams, agency owners, brand managers",
    valueProposition: "One brand memory. Infinite AI execution.",
    painPoints: {
      primary: "repeating brand context in every brief",
    },
    competitors: ["Traditional agencies", "Freelance marketplaces", "Point solutions"],
    brandColors: {
      primary: "#7c9cff",
      secondary: "#a6bdff",
    },
    tagline: "AI-Powered Brand & Marketing Operating System",
    useCases: [
      { title: "Agencies", description: "Scale all client brands instantly" },
      { title: "Creators", description: "Automate your content engine" },
      { title: "Enterprises", description: "Standardize brand operations" },
    ],
    type: "default",
    features: [
      { title: "Brand Brain", description: "One source of truth for every brand — voice, audience, offer, and strategy — that every AI employee inherits automatically." },
      { title: "AI Employees", description: "Specialist marketing roles (content, SEO, ads, analytics) that produce brand-aware work without repeated briefing." },
      { title: "Campaign Workflows", description: "Turn business objectives into structured campaign plans with AI-assisted briefs, content calendars, and publishing pipelines." },
      { title: "Performance Signals", description: "Real-time operational metrics, trend detection, and next-step recommendations across every brand you manage." },
      { title: "Team Collaboration", description: "Invite team members, assign AI employees to brands, and maintain a shared operating layer for every client." },
      { title: "Analytics & Insights", description: "Aggregated performance dashboards, content effectiveness scoring, and brand health monitoring." },
    ],
    howItWorks: [
      { step: "01", title: "Set your Brand Brain", description: "Define brand identity, voice, audience, products, and competitors in one place. This becomes the shared context for everything." },
      { step: "02", title: "Deploy AI Employees", description: "Activate specialist AI roles — strategist, copywriter, SEO analyst, social manager — each reading from the same brand memory." },
      { step: "03", title: "Execute & Iterate", description: "Generate campaigns, content, and analyses. Every output is on-brand by default, so you spend less time editing and more time scaling." },
    ],
    testimonials: [
      { quote: "MarketingOS transformed how we manage our 12 brands. Each AI employee already knows the brand voice before we ask for anything.", author: "Sarah Chen", role: "Head of Marketing, Bloom Agency" },
      { quote: "We stopped repeating ourselves in briefs. The Brand Brain captures everything once, and every output just works.", author: "Marcus Adeyemi", role: "Brand Director, Stellar Studios" },
      { quote: "The AI employees feel like actual team members who've been briefed. It's the closest thing to hiring without hiring.", author: "Priya Kapoor", role: "Founder, Kapoor Creative" },
    ],
    socialProof: ["Agency A", "Brand Co", "Studio X", "Global Inc", "Creative Lab", "Media Group"],
  };
}
