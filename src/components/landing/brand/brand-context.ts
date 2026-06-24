export interface BrandLandingBrain {
  brandName: string;
  toneOfVoice: string;
  audience: string;
  valueProposition: string;
  painPoints: {
    primary: string;
    secondary?: string;
  };
  competitors: string[];
  brandColors: {
    primary: string;
    secondary: string;
  };
  tagline: string;
  useCases: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  type: "agency" | "creator" | "enterprise" | "default";
  features?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  howItWorks?: Array<{
    step: string;
    title: string;
    description: string;
  }>;
  testimonials?: Array<{
    quote: string;
    author: string;
    role: string;
  }>;
  socialProof?: string[];
}

export interface LandingNarrative {
  hero: {
    pill: string;
    headline: string;
    headlineAccent: string;
    subtext: string;
  };
  problem: {
    pill: string;
    title: string;
    description: string;
    items?: string[];
  };
  solution: {
    pill: string;
    title: string;
    description: string;
    steps?: Array<{
      step: string;
      title: string;
      description: string;
    }>;
  };
  product: {
    pill: string;
    title: string;
    description: string;
    features: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
  };
  proof: {
    pill: string;
    title: string;
    description: string;
    items: Array<{
      quote?: string;
      author?: string;
      role?: string;
      title?: string;
      description?: string;
    }>;
  };
  cta: {
    pill: string;
    title: string;
    description: string;
    buttonText: string;
    buttonSubtext?: string[];
  };
}

export interface BrandTheme {
  accent: string;
  accentStrong: string;
  gradient: string;
  tone: string;
}

export const CTA_MAP: Record<string, string> = {
  agency: "Scale all client brands instantly",
  creator: "Automate your content engine",
  enterprise: "Standardize brand operations",
  default: "Start your 14-day free trial",
};
