import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Bot, Brain, Calendar, Shield, Sparkles, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

const features: FeatureCardProps[] = [
  {
    icon: <Bot />,
    title: "AI Employees",
    description: "Specialist marketing roles that work from the selected Brand Brain.",
  },
  {
    icon: <Brain />,
    title: "Brand Brain",
    description: "Centralized company context that prevents repeated briefing.",
  },
  {
    icon: <BarChart3 />,
    title: "Performance Signals",
    description: "Operational metrics, trends, and next-step recommendations.",
  },
  {
    icon: <Calendar />,
    title: "Content Planning",
    description: "Campaign and publishing workflows built around brand context.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="relative min-h-[88vh] overflow-hidden border-b mos-divider">
        <ProductBackdrop />

        <header className="relative z-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="mos-icon-tile flex h-10 w-10 items-center justify-center rounded-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold">MarketingOS</span>
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              <Link href="#features" className="mos-muted text-sm hover:text-[var(--color-text-primary)]">
                Features
              </Link>
              <Link href="/dashboard" className="mos-muted text-sm hover:text-[var(--color-text-primary)]">
                Dashboard
              </Link>
              <Link href="#about" className="mos-muted text-sm hover:text-[var(--color-text-primary)]">
                About
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-end px-4 pb-14 pt-20 sm:px-6 lg:min-h-[calc(88vh-80px)] lg:px-8">
          <div className="max-w-3xl">
            <div className="mos-pill mb-5 inline-flex rounded-full px-3 py-1 text-xs font-medium">
              AI marketing operating system
            </div>
            <h1 className="text-5xl font-semibold leading-none sm:text-6xl lg:text-7xl">
              MarketingOS
            </h1>
            <p className="mos-muted mt-6 max-w-2xl text-lg leading-8">
              Manage multiple brands, maintain one source of strategic truth, and give every AI employee the context it needs to produce useful marketing work.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Start workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">View product</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </section>

      <section id="about" className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <div className="mos-pill mb-4 inline-flex rounded-full px-3 py-1 text-xs font-medium">Built for real operators</div>
          <h2 className="text-3xl font-semibold leading-tight">Brand context becomes marketing infrastructure.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <ProofPoint icon={<Shield />} title="Consistent" description="Every task starts from shared brand memory." />
          <ProofPoint icon={<Zap />} title="Fast" description="Less rebriefing, more useful execution." />
          <ProofPoint icon={<Sparkles />} title="Specialized" description="Roles match strategy, content, SEO, sales, and analytics." />
        </div>
      </section>

      <footer className="border-t mos-divider">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <div className="mos-icon-tile flex h-8 w-8 items-center justify-center rounded-md">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-semibold">MarketingOS</span>
          </div>
          <p className="mos-subtle text-sm">Copyright 2026 MarketingOS. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

function ProductBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-80">
      <div className="absolute inset-x-4 top-24 mx-auto hidden max-w-6xl lg:block">
        <div className="mos-card ml-auto w-[720px] overflow-hidden">
          <div className="grid grid-cols-[190px_1fr]">
            <div className="border-r p-4 mos-divider">
              <div className="mb-5 h-8 w-28 rounded bg-[var(--color-surface-3)]" />
              <div className="space-y-2">
                {["Dashboard", "Brands", "AI Employees", "Campaigns", "Analytics"].map((item, index) => (
                  <div key={item} className={index === 1 ? "rounded-lg bg-[var(--color-surface-3)] px-3 py-2 text-sm" : "mos-subtle px-3 py-2 text-sm"}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="h-4 w-36 rounded bg-[var(--color-surface-3)]" />
                  <div className="mt-2 h-3 w-52 rounded bg-[var(--color-surface-2)]" />
                </div>
                <div className="h-9 w-28 rounded-md bg-[var(--brand-accent)]" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[92, 64, 78].map((value) => (
                  <div key={value} className="mos-panel p-4">
                    <div className="h-3 w-16 rounded bg-[var(--color-surface-3)]" />
                    <div className="mt-5 text-3xl font-semibold">{value}%</div>
                  </div>
                ))}
              </div>
              <div className="mos-panel mt-4 flex h-44 items-end gap-2 p-4">
                {[54, 84, 62, 112, 78, 136, 104, 156].map((height, index) => (
                  <div key={index} className="flex flex-1 items-end">
                    <div className="w-full rounded-t bg-[var(--brand-accent)]" style={{ height: `${height}px` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="mos-card mos-card-hover p-5">
      <div className="mos-icon-tile mb-4 flex h-11 w-11 items-center justify-center rounded-lg [&_svg]:h-5 [&_svg]:w-5">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mos-muted mt-2 text-sm leading-6">{description}</p>
    </div>
  );
}

function ProofPoint({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="mos-panel p-4">
      <div className="mb-3 text-[var(--brand-accent-strong)] [&_svg]:h-5 [&_svg]:w-5">{icon}</div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mos-muted mt-2 text-xs leading-5">{description}</p>
    </div>
  );
}
