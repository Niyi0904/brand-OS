import { redirect, notFound } from "next/navigation";
import { ArrowLeft, Brain, CheckCircle2, Megaphone, Palette, Save, Search, Target, Users } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeBrandBrainCompleteness } from "@/lib/brand-utils";
import { serializeBrandForPrompt } from "@/lib/brand-context-serializer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateBrandBrainAction, type SettingsActionState } from "./actions";
import { SettingsForm } from "./settings-form";

type SectionConfig = {
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: { id: string; label: string; placeholder: string }[];
};

const sections: SectionConfig[] = [
  {
    title: "Core identity",
    description: "The durable facts every employee should know before producing work.",
    icon: <Brain className="h-4 w-4" />,
    fields: [
      { id: "mission", label: "Mission", placeholder: "What the brand exists to do" },
      { id: "vision", label: "Vision", placeholder: "What the brand is building toward" },
      { id: "values", label: "Values", placeholder: "Principles that guide decisions" },
    ],
  },
  {
    title: "Audience",
    description: "The people, segments, and buying context the brand serves.",
    icon: <Users className="h-4 w-4" />,
    fields: [
      { id: "targetAudience", label: "Target audience", placeholder: "Primary customer segment" },
      { id: "customerPersonas", label: "Customer personas", placeholder: "Personas, motivations, objections" },
      { id: "products", label: "Products", placeholder: "Products and services" },
    ],
  },
  {
    title: "Brand voice",
    description: "How the brand sounds, looks, and behaves in public.",
    icon: <Palette className="h-4 w-4" />,
    fields: [
      { id: "toneOfVoice", label: "Tone of voice", placeholder: "Professional, friendly, bold" },
      { id: "writingStyle", label: "Writing style", placeholder: "Copy rules and examples" },
      { id: "brandColors", label: "Brand colors", placeholder: "Primary palette and usage notes" },
      { id: "typography", label: "Typography", placeholder: "Font and type guidance" },
    ],
  },
  {
    title: "Market position",
    description: "Competitive context, search priorities, and channel choices.",
    icon: <Search className="h-4 w-4" />,
    fields: [
      { id: "competitors", label: "Competitors", placeholder: "Main competitors and alternatives" },
      { id: "seoKeywords", label: "SEO keywords", placeholder: "Priority keywords and themes" },
      { id: "preferredPlatforms", label: "Preferred platforms", placeholder: "Instagram, LinkedIn, TikTok" },
    ],
  },
  {
    title: "Marketing strategy",
    description: "Goals, offers, and business context for campaign decisions.",
    icon: <Target className="h-4 w-4" />,
    fields: [
      { id: "marketingStrategy", label: "Marketing strategy", placeholder: "Go-to-market approach" },
      { id: "goals", label: "Goals", placeholder: "Marketing goals and objectives" },
      { id: "offers", label: "Offers", placeholder: "Current offers and promotions" },
      { id: "businessInfo", label: "Business information", placeholder: "Business model, pricing, operations" },
    ],
  },
  {
    title: "Rules and support",
    description: "Operational details that prevent off-brand or inaccurate AI output.",
    icon: <Megaphone className="h-4 w-4" />,
    fields: [
      { id: "locations", label: "Locations", placeholder: "Business locations and regions" },
      { id: "faqs", label: "FAQs", placeholder: "Common customer questions" },
      { id: "brandRules", label: "Brand rules", placeholder: "Rules and guidelines AI must follow" },
    ],
  },
];

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
  const promptPreview = serializeBrandForPrompt(brain);
  const brainFields = brain
    ? Object.fromEntries(
        Object.entries(brain).filter(([, value]) => typeof value === "string" || value === null)
      ) as Record<string, string | null>
    : null;
  const promptPreviewText = typeof promptPreview === "string" ? promptPreview : JSON.stringify(promptPreview, null, 2);

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-[1fr_320px]">
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" asChild>
              <a href="/dashboard/brands" aria-label="Back to brands">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <div>
              <div className="mos-pill mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium">
                Brand Brain: {brand.name}
              </div>
              <h1 className="text-3xl font-semibold leading-tight">Configure Brand Brain</h1>
              <p className="mos-muted mt-2 max-w-2xl text-sm leading-6">
                Maintain the context layer that MarketingOS injects into AI employee work.
              </p>
            </div>
          </div>
        </div>

        <SettingsForm slug={slug} sections={sections} brain={brainFields} logoUrl={brand.logo} />
      </section>

      <aside className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Context quality</CardTitle>
            <CardDescription>Useful AI output depends on complete, current inputs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-semibold">{completeness}</span>
                <span className="mos-muted mb-2 text-sm">/100</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--color-surface-3)]">
                <div className="h-full rounded-full bg-[var(--brand-accent)]" style={{ width: `${completeness}%` }} />
              </div>
            </div>
            <StatusRow label="Identity" value={brain?.mission ? "Complete" : "Incomplete"} />
            <StatusRow label="Audience" value={brain?.targetAudience ? "Strong" : "Needs work"} />
            <StatusRow label="Offers" value={brain?.offers ? "Current" : "Needs refresh"} warning={!brain?.offers} />
            <StatusRow label="FAQs" value={brain?.faqs ? "Complete" : "Sparse"} warning={!brain?.faqs} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI prompt preview</CardTitle>
            <CardDescription>What employees see before every task.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="mos-panel max-h-80 overflow-auto rounded-lg p-4 text-xs leading-5 text-[var(--color-text-secondary)]">
              {promptPreviewText || "No brand context yet."}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review checklist</CardTitle>
            <CardDescription>Before asking employees for production work.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ChecklistItem label="Current offer is accurate" checked={!!brain?.offers} />
            <ChecklistItem label="Audience objections are captured" checked={!!brain?.customerPersonas} />
            <ChecklistItem label="Voice examples are up to date" checked={!!brain?.toneOfVoice} />
            <ChecklistItem label="Restricted claims are listed" checked={!!brain?.brandRules} />
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function StatusRow({ label, value, warning = false }: { label: string; value: string; warning?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="mos-muted">{label}</span>
      <span className={warning ? "mos-warning-pill rounded-full px-2 py-0.5 text-xs" : "mos-success-pill rounded-full px-2 py-0.5 text-xs"}>
        {value}
      </span>
    </div>
  );
}

function ChecklistItem({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className={`h-4 w-4 ${checked ? "text-[var(--color-positive)]" : "text-[var(--color-text-tertiary)]"}`} />
      <span className={`text-sm ${checked ? "mos-muted" : "mos-subtle"}`}>{label}</span>
    </div>
  );
}