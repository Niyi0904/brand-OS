import type { Metadata } from "next";
import { MarketingLanding } from "@/components/landing/MarketingLanding";

export const metadata: Metadata = {
  title: "MarketingOS — The Operating System for AI Marketing Teams",
  description:
    "Build a Brand Brain once. Every AI employee reads it automatically. Stop pasting brand context into every AI prompt — MarketingOS gives your AI the brand knowledge it needs before every response.",
  keywords: [
    "AI marketing",
    "brand brain",
    "marketing AI",
    "brand consistency",
    "AI employees",
    "multi-brand marketing",
    "marketing operating system",
  ],
  openGraph: {
    title: "MarketingOS — The Operating System for AI Marketing Teams",
    description:
      "Stop re-explaining your brand to AI. Build the Brand Brain once, and every AI employee reads it automatically — for every brand, every session.",
    type: "website",
  },
};

export default function Home() {
  return <MarketingLanding />;
}
