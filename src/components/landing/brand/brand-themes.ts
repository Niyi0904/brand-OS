import type { BrandLandingBrain, BrandTheme } from "./brand-context";

export function generateBrandTheme(brain: BrandLandingBrain): BrandTheme {
  return {
    accent: brain.brandColors.primary,
    accentStrong: brain.brandColors.secondary,
    gradient: `from-[${brain.brandColors.primary}] to-[${brain.brandColors.secondary}]`,
    tone: brain.toneOfVoice,
  };
}

export function injectBrandTheme(theme: BrandTheme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--brand-accent", theme.accent);
  root.style.setProperty("--brand-accent-strong", theme.accentStrong);
}
