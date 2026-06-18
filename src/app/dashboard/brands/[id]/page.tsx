import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, CheckCircle2, Megaphone, Palette, Save, Search, Target, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type BrandDetailPageProps = {
  params: {
    id: string;
  };
};

type FieldConfig = {
  id: string;
  label: string;
  placeholder: string;
};

type SectionConfig = {
  title: string;
  description: string;
  icon: ReactNode;
  fields: FieldConfig[];
};

const sections: SectionConfig[] = [
  {
    title: "Core identity",
    description: "The durable facts every employee should know before producing work.",
    icon: <Brain />,
    fields: [
      { id: "mission", label: "Mission", placeholder: "What the brand exists to do" },
      { id: "vision", label: "Vision", placeholder: "What the brand is building toward" },
      { id: "values", label: "Values", placeholder: "Principles that guide decisions" },
    ],
  },
  {
    title: "Audience",
    description: "The people, segments, and buying context the brand serves.",
    icon: <Users />,
    fields: [
      { id: "targetAudience", label: "Target audience", placeholder: "Primary customer segment" },
      { id: "customerPersonas", label: "Customer personas", placeholder: "Personas, motivations, objections" },
      { id: "products", label: "Products", placeholder: "Products and services" },
    ],
  },
  {
    title: "Brand voice",
    description: "How the brand sounds, looks, and behaves in public.",
    icon: <Palette />,
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
    icon: <Search />,
    fields: [
      { id: "competitors", label: "Competitors", placeholder: "Main competitors and alternatives" },
      { id: "seoKeywords", label: "SEO keywords", placeholder: "Priority keywords and themes" },
      { id: "preferredPlatforms", label: "Preferred platforms", placeholder: "Instagram, LinkedIn, TikTok" },
    ],
  },
  {
    title: "Marketing strategy",
    description: "Goals, offers, and business context for campaign decisions.",
    icon: <Target />,
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
    icon: <Megaphone />,
    fields: [
      { id: "locations", label: "Locations", placeholder: "Business locations and regions" },
      { id: "faqs", label: "FAQs", placeholder: "Common customer questions" },
      { id: "brandRules", label: "Brand rules", placeholder: "Rules and guidelines AI must follow" },
    ],
  },
];

export default function BrandDetailPage({ params }: BrandDetailPageProps) {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-[1fr_320px]">
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/brands" aria-label="Back to brands">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="mos-pill mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium">
                Brand Brain: {params.id}
              </div>
              <h1 className="text-3xl font-semibold leading-tight">Configure Brand Brain</h1>
              <p className="mos-muted mt-2 max-w-2xl text-sm leading-6">
                Maintain the context layer that MarketingOS injects into AI employee work.
              </p>
            </div>
          </div>
          <Button>
            <Save className="h-4 w-4" />
            Save changes
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {sections.map((section) => (
            <BrandSection key={section.title} section={section} />
          ))}
        </div>
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
                <span className="text-5xl font-semibold">88</span>
                <span className="mos-muted mb-2 text-sm">/100</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--color-surface-3)]">
                <div className="h-full w-[88%] rounded-full bg-[var(--brand-accent)]" />
              </div>
            </div>
            <StatusRow label="Identity" value="Complete" />
            <StatusRow label="Audience" value="Strong" />
            <StatusRow label="Offers" value="Needs refresh" warning />
            <StatusRow label="FAQs" value="Sparse" warning />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review checklist</CardTitle>
            <CardDescription>Before asking employees for production work.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ChecklistItem label="Current offer is accurate" />
            <ChecklistItem label="Audience objections are captured" />
            <ChecklistItem label="Voice examples are up to date" />
            <ChecklistItem label="Restricted claims are listed" />
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function BrandSection({ section }: { section: SectionConfig }) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-3 flex items-center gap-3">
          <div className="mos-icon-tile flex h-10 w-10 items-center justify-center rounded-lg [&_svg]:h-4 [&_svg]:w-4">
            {section.icon}
          </div>
          <div>
            <CardTitle>{section.title}</CardTitle>
            <CardDescription>{section.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {section.fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input id={field.id} placeholder={field.placeholder} />
          </div>
        ))}
      </CardContent>
    </Card>
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

function ChecklistItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="h-4 w-4 text-[var(--color-positive)]" />
      <span className="mos-muted text-sm">{label}</span>
    </div>
  );
}
