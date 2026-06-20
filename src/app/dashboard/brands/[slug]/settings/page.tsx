import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeBrandBrainCompleteness, computeSectionCompletionStates } from "@/lib/brand-utils";
import { serializeBrandForPrompt } from "@/lib/brand-context-serializer";
import { SavedIndicator } from "@/components/ui/saved-indicator";
import { SectionSkeleton } from "@/components/ui/skeleton-shimmer";
import { BrandIdentitySection } from "./sections/brand-identity-section";
import { MissionValuesSection } from "./sections/mission-values-section";
import { VoiceToneSection } from "./sections/voice-tone-section";
import { TargetAudienceSection } from "./sections/target-audience-section";
import { ProductsServicesSection } from "./sections/products-services-section";
import { CompetitorsSection } from "./sections/competitors-section";
import { SeoKeywordsSection } from "./sections/seo-keywords-section";
import { FaqsSection } from "./sections/faqs-section";
import { AdditionalContextSection } from "./sections/additional-context-section";

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
  const sectionStates = computeSectionCompletionStates(brain);
  const promptPreview = serializeBrandForPrompt(brain);
  const promptPreviewText = typeof promptPreview === "string" ? promptPreview : JSON.stringify(promptPreview, null, 2);

  const stateMap = Object.fromEntries(sectionStates.map((s) => [s.sectionId, s.state]));

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-[1fr_320px]">
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <a
              href="/dashboard/brands"
              className="mos-button-ghost inline-flex h-10 w-10 items-center justify-center rounded-lg"
              aria-label="Back to brands"
            >
              ←
            </a>
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
          <div className="flex items-center gap-3">
            <SavedIndicator state="idle" />
            <button
              type="button"
              className="mos-button-ghost inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium"
            >
              Preview context
            </button>
            <button
              type="button"
              disabled
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium text-[var(--color-text-tertiary)]"
            >
              Import from doc
              <span className="rounded-full bg-[var(--color-surface-3)] px-2 py-0.5 text-[10px] font-medium">Coming soon</span>
            </button>
          </div>
        </div>

        <BrandIdentitySection
          slug={slug}
          brandName={brand.name}
          tagline={brain?.tagline ?? ""}
          websiteUrl={brain?.websiteUrl ?? ""}
          industry={brain?.industry ?? ""}
          foundedYear={brain?.foundedYear?.toString() ?? ""}
          logo={brand.logo ?? ""}
        />
        <MissionValuesSection
          slug={slug}
          missionStatement={brain?.missionStatement ?? ""}
          coreValues={brain?.coreValues ?? ""}
          brandPromise={brain?.brandPromise ?? ""}
        />
        <VoiceToneSection
          slug={slug}
          voiceAdjectives={brain?.voiceAdjectives ?? ""}
          toneDescription={brain?.toneDescription ?? ""}
          writingStyleNotes={brain?.writingStyleNotes ?? ""}
          thingsToAvoid={brain?.thingsToAvoid ?? ""}
        />
        <TargetAudienceSection
          slug={slug}
          primaryAudience={brain?.primaryAudience ?? ""}
          audienceDemographics={brain?.audienceDemographics ?? ""}
          audiencePainPoints={brain?.audiencePainPoints ?? ""}
          audienceVocabulary={brain?.audienceVocabulary ?? ""}
        />
        <ProductsServicesSection
          slug={slug}
          productList={brain?.productList ?? ""}
          pricingTier={brain?.pricingTier ?? ""}
          keyDifferentiators={brain?.keyDifferentiators ?? ""}
        />
        <CompetitorsSection
          slug={slug}
          competitorList={brain?.competitorList ?? ""}
          competitiveAdvantages={brain?.competitiveAdvantages ?? ""}
          thingsNeverDo={brain?.thingsNeverDo ?? ""}
        />
        <SeoKeywordsSection
          slug={slug}
          primaryKeywords={brain?.primaryKeywords ?? ""}
          secondaryKeywords={brain?.secondaryKeywords ?? ""}
          topicsToOwn={brain?.topicsToOwn ?? ""}
          topicsToAvoid={brain?.topicsToAvoid ?? ""}
        />
        <FaqsSection slug={slug} faqList={brain?.faqList ?? ""} />
        <AdditionalContextSection
          slug={slug}
          freeformNotes={brain?.freeformNotes ?? ""}
          contentExamples={brain?.contentExamples ?? ""}
          brandStory={brain?.brandStory ?? ""}
        />
      </section>

      <aside className="space-y-6">
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

        <div className="mos-card p-5">
          <h3 className="mb-4 text-sm font-medium text-[var(--color-text-primary)]">Review checklist</h3>
          <div className="space-y-3">
            <ChecklistItem label="Current offer is accurate" checked={!!brain?.offers} />
            <ChecklistItem label="Audience objections are captured" checked={!!brain?.customerPersonas} />
            <ChecklistItem label="Voice examples are up to date" checked={!!brain?.toneOfVoice} />
            <ChecklistItem label="Restricted claims are listed" checked={!!brain?.brandRules} />
          </div>
        </div>
      </aside>
    </div>
  );
}

function ChecklistItem({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`inline-flex h-4 w-4 items-center justify-center ${checked ? "text-[var(--color-green)]" : "text-[var(--color-text-tertiary)]"}`}>
        {checked ? "✓" : "○"}
      </span>
      <span className={`text-sm ${checked ? "mos-muted" : "mos-subtle"}`}>{label}</span>
    </div>
  );
}