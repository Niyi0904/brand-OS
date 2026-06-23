import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeBrandBrainCompleteness } from "@/lib/brand-utils";
import { serializeBrandForPrompt } from "@/lib/brand-context-serializer";
import { Button } from "@/components/ui/button";
import { SettingsForm } from "./settings-form";

type SettingsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BrandSettingsPage({ params }: SettingsPageProps) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const brand = await prisma.brand.findFirst({
    where: { slug, userId: session.user.id },
    include: { brandBrain: true },
  });

  if (!brand) notFound();

  const brain = brand.brandBrain;
  const completeness = computeBrandBrainCompleteness(brain);
  const promptPreviewText = serializeBrandForPrompt(brain);

  // Convert brain to plain object for the form — ALL M2 fields included
  const brainData: Record<string, string | null> = brain ? {
    // Section 1: Brand identity
    tagline: brain.tagline || "",
    websiteUrl: brain.websiteUrl || "",
    industry: brain.industry || "",
    foundedYear: brain.foundedYear ? String(brain.foundedYear) : "",
    // Section 2: Mission & values
    missionStatement: brain.missionStatement || "",
    coreValues: brain.coreValues || "",
    brandPromise: brain.brandPromise || "",
    // Section 3: Voice & tone
    voiceAdjectives: brain.voiceAdjectives || "",
    toneDescription: brain.toneDescription || "",
    writingStyleNotes: brain.writingStyleNotes || "",
    thingsToAvoid: brain.thingsToAvoid || "",
    // Section 4: Target audience
    primaryAudience: brain.primaryAudience || "",
    audienceDemographics: brain.audienceDemographics || "",
    audiencePainPoints: brain.audiencePainPoints || "",
    audienceVocabulary: brain.audienceVocabulary || "",
    // Section 5: Products & services
    productList: brain.productList || "",
    pricingTier: brain.pricingTier || "",
    keyDifferentiators: brain.keyDifferentiators || "",
    // Section 6: Competitors
    competitorList: brain.competitorList || "",
    competitiveAdvantages: brain.competitiveAdvantages || "",
    thingsNeverDo: brain.thingsNeverDo || "",
    // Section 7: SEO & keywords
    primaryKeywords: brain.primaryKeywords || "",
    secondaryKeywords: brain.secondaryKeywords || "",
    topicsToOwn: brain.topicsToOwn || "",
    topicsToAvoid: brain.topicsToAvoid || "",
    // Section 8: FAQs
    faqList: brain.faqList || "",
    // Section 9: Additional context
    freeformNotes: brain.freeformNotes || "",
    contentExamples: brain.contentExamples || "",
    brandStory: brain.brandStory || "",
  } : {};

  return (
    <div className="mx-auto w-full max-w-7xl">
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" asChild aria-label="Back to brands">
              <Link href="/dashboard/brands">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <div className="mos-pill mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium">
                Brand Brain: {brand.name}
              </div>
              <h1 className="text-3xl font-semibold leading-tight text-[var(--color-text-primary)]">Configure Brand Brain</h1>
              <p className="mos-muted mt-2 max-w-2xl text-sm leading-6">
                Fill this in once. Your AI employees will read it automatically before every response.
              </p>
            </div>
          </div>
        </div>

        <SettingsForm
          slug={slug}
          brandName={brand.name}
          brain={brainData}
          logoUrl={brand.logo}
          accentColour={brand.accentColour}
        />
      </section>

      <aside className="mt-6 space-y-6">
        <div className="mos-card p-5">
          <div className="mb-2 flex items-end gap-2">
            <span className="text-5xl font-semibold text-[var(--color-text-primary)]">{completeness}</span>
            <span className="mos-muted mb-2 text-sm">/100</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--color-surface-3)]">
            <div
              className="h-full rounded-full bg-[var(--brand-accent)]"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>

        <div className="mos-card p-5">
          <h3 className="mb-2 text-sm font-medium text-[var(--color-text-primary)]">AI prompt preview</h3>
          <p className="mos-muted mb-4 text-xs">What employees see before every task.</p>
          <pre className="mos-panel max-h-80 overflow-auto rounded-lg p-4 text-xs leading-5 text-[var(--color-text-secondary)]">
            {promptPreviewText || "No brand context yet."}
          </pre>
        </div>
      </aside>
    </div>
  );
}

