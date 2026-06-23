import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  Building2,
  Calendar,
  CheckCircle2,
  MessageSquare,
  Shield,
  Sparkles,
  Zap,
  Layers,
  Users,
  LineChart,
  Workflow,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const capabilities = [
  {
    icon: <Brain />,
    title: "Brand Brain",
    description: "One source of truth for every brand — voice, audience, offer, and strategy — that every AI employee inherits automatically.",
  },
  {
    icon: <Bot />,
    title: "AI Employees",
    description: "Specialist marketing roles (content, SEO, ads, analytics) that produce brand-aware work without repeated briefing.",
  },
  {
    icon: <Workflow />,
    title: "Campaign Workflows",
    description: "Turn business objectives into structured campaign plans with AI-assisted briefs, content calendars, and publishing pipelines.",
  },
  {
    icon: <BarChart3 />,
    title: "Performance Signals",
    description: "Real-time operational metrics, trend detection, and next-step recommendations across every brand you manage.",
  },
  {
    icon: <Users />,
    title: "Team Collaboration",
    description: "Invite team members, assign AI employees to brands, and maintain a shared operating layer for every client.",
  },
  {
    icon: <LineChart />,
    title: "Analytics & Insights",
    description: "Aggregated performance dashboards, content effectiveness scoring, and brand health monitoring.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Set your Brand Brain",
    description: "Define brand identity, voice, audience, products, and competitors in one place. This becomes the shared context for everything.",
    icon: <Brain />,
  },
  {
    step: "02",
    title: "Deploy AI Employees",
    description: "Activate specialist AI roles — strategist, copywriter, SEO analyst, social manager — each reading from the same brand memory.",
    icon: <Bot />,
  },
  {
    step: "03",
    title: "Execute & Iterate",
    description: "Generate campaigns, content, and analyses. Every output is on-brand by default, so you spend less time editing and more time scaling.",
    icon: <Zap />,
  },
];

const testimonials = [
  {
    quote: "MarketingOS transformed how we manage our 12 brands. Each AI employee already knows the brand voice before we ask for anything.",
    author: "Sarah Chen",
    role: "Head of Marketing, Bloom Agency",
  },
  {
    quote: "We stopped repeating ourselves in briefs. The Brand Brain captures everything once, and every output just works.",
    author: "Marcus Adeyemi",
    role: "Brand Director, Stellar Studios",
  },
  {
    quote: "The AI employees feel like actual team members who've been briefed. It's the closest thing to hiring without hiring.",
    author: "Priya Kapoor",
    role: "Founder, Kapoor Creative",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* ─── Hero ─── */}
      <section className="relative min-h-[90vh] overflow-hidden border-b mos-divider">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,156,255,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(124,156,255,0.08),transparent_50%)]" />
        </div>

        <header className="relative z-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="mos-icon-tile flex h-10 w-10 items-center justify-center rounded-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold">MarketingOS</span>
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              <Link href="#capabilities" className="mos-muted text-sm hover:text-[var(--color-text-primary)] transition-colors">
                Capabilities
              </Link>
              <Link href="#how-it-works" className="mos-muted text-sm hover:text-[var(--color-text-primary)] transition-colors">
                How it works
              </Link>
              <Link href="/dashboard" className="mos-muted text-sm hover:text-[var(--color-text-primary)] transition-colors">
                Dashboard
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

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-4 pb-16 pt-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:pb-20 lg:pt-20 lg:px-8">
          <div className="max-w-2xl">
            <div className="mos-pill mb-5 inline-flex rounded-full px-3 py-1 text-xs font-medium">
              AI-Powered Brand & Marketing Operating System
            </div>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              One brand memory.
              <br />
              <span className="text-[var(--brand-accent-strong)]">Infinite AI execution.</span>
            </h1>
            <p className="mos-muted mt-6 max-w-xl text-base leading-7 sm:text-lg">
              MarketingOS gives every brand a strategic brain that specialist AI employees inherit.
              Manage multiple brands, stop repeating briefs, and produce on-brand marketing work at scale.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Start your workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">View product</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-4 text-sm mos-muted">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[var(--color-positive)]" />
                No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[var(--color-positive)]" />
                14-day free trial
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[var(--color-positive)]" />
                Cancel anytime
              </span>
            </div>
          </div>

          {/* Hero mockup */}
          <div className="mt-12 lg:mt-0 lg:ml-12 lg:w-[480px] shrink-0">
            <div className="mos-card overflow-hidden">
              <div className="grid grid-cols-[160px_1fr]">
                <div className="border-r p-4 mos-divider">
                  <div className="mb-4 h-6 w-20 rounded bg-[var(--color-surface-3)]" />
                  <div className="space-y-2">
                    {["Dashboard", "Brands", "AI Employees", "Campaigns", "Analytics"].map((item, i) => (
                      <div
                        key={item}
                        className={i === 1 ? "rounded-lg bg-[var(--color-surface-3)] px-3 py-2 text-sm" : "mos-subtle px-3 py-2 text-sm"}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <div className="h-4 w-32 rounded bg-[var(--color-surface-3)]" />
                      <div className="mt-2 h-3 w-44 rounded bg-[var(--color-surface-2)]" />
                    </div>
                    <div className="h-8 w-24 rounded-md bg-[var(--brand-accent)]" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[92, 64, 78].map((v) => (
                      <div key={v} className="mos-panel p-3">
                        <div className="h-2 w-12 rounded bg-[var(--color-surface-3)]" />
                        <div className="mt-3 text-2xl font-semibold">{v}%</div>
                      </div>
                    ))}
                  </div>
                  <div className="mos-panel mt-3 flex h-32 items-end gap-2 p-3">
                    {[54, 84, 62, 112, 78, 136, 104, 156].map((h, i) => (
                      <div key={i} className="flex flex-1 items-end">
                        <div className="w-full rounded-t bg-[var(--brand-accent)]" style={{ height: `${h}px` }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Social proof ─── */}
      <section className="border-b mos-divider">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] mos-subtle mb-6">
            Trusted by marketing teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {["Agency A", "Brand Co", "Studio X", "Global Inc", "Creative Lab", "Media Group"].map((name) => (
              <span key={name} className="text-sm font-semibold text-[var(--color-text-tertiary)] tracking-wide">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Capabilities ─── */}
      <section id="capabilities" className="border-b mos-divider">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mos-pill mb-4 inline-flex rounded-full px-3 py-1 text-xs font-medium">
              Everything you need
            </div>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
              The operating system for AI-driven marketing teams
            </h2>
            <p className="mos-muted mt-4 text-lg leading-7">
              From brand strategy to campaign execution, MarketingOS connects context, people, and AI in one workspace.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((cap) => (
              <div key={cap.title} className="mos-card mos-card-hover p-6">
                <div className="mos-icon-tile mb-4 flex h-11 w-11 items-center justify-center rounded-lg [&_svg]:h-5 [&_svg]:w-5">
                  {cap.icon}
                </div>
                <h3 className="text-lg font-semibold">{cap.title}</h3>
                <p className="mos-muted mt-2 text-sm leading-6">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section id="how-it-works" className="border-b mos-divider">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mos-pill mb-4 inline-flex rounded-full px-3 py-1 text-xs font-medium">
              Three-step workflow
            </div>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
              From setup to execution in minutes
            </h2>
            <p className="mos-muted mt-4 text-lg leading-7">
              No complex configuration. Define your brand once and let AI do the rest.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {howItWorks.map((item) => (
              <div key={item.step} className="relative">
                <div className="mos-card p-6">
                  <span className="text-4xl font-bold text-[var(--color-text-tertiary)]">{item.step}</span>
                  <div className="mos-icon-tile mt-4 flex h-11 w-11 items-center justify-center rounded-lg [&_svg]:h-5 [&_svg]:w-5">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mos-muted mt-2 text-sm leading-6">{item.description}</p>
                </div>
                {item.step !== "03" && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 text-[var(--color-text-tertiary)]">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI in action ─── */}
      <section className="border-b mos-divider">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <div className="mos-pill mb-4 inline-flex rounded-full px-3 py-1 text-xs font-medium">
                AI-powered workflows
              </div>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Every AI employee starts with full brand context
              </h2>
              <p className="mos-muted mt-4 text-base leading-7">
                No more copy-pasting brand guidelines into every brief. Your Brand Brain stores voice, audience, products, and strategy — and every AI specialist reads it automatically.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Content strategist that knows your tone",
                  "SEO analyst that understands your market",
                  "Social manager briefed on your campaigns",
                  "Copywriter aligned with your brand voice",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-positive)]" />
                    <span className="mos-muted">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/auth/signup">
                    Start building
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mos-card p-6">
              <div className="flex items-center gap-3 border-b pb-4 mos-divider">
                <div className="mos-icon-tile flex h-10 w-10 items-center justify-center rounded-lg">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Content Strategist</p>
                  <p className="mos-subtle text-xs">Reading from Bloom Studio Brand Brain</p>
                </div>
              </div>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg bg-[var(--color-surface-2)] p-4">
                  <p className="text-sm leading-6 text-[var(--color-text-primary)]">
                    Based on the Bloom Studio brand brain, I recommend a Q3 campaign focused on the premium skincare line, targeting women 30-45 interested in sustainable beauty. The voice analysis shows "warm authority" performs best with this audience.
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="mos-pill rounded-full px-2 py-0.5 text-xs">Brand-aligned</span>
                  <span className="mos-success-pill rounded-full px-2 py-0.5 text-xs">Context: 94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="border-b mos-divider">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mos-pill mb-4 inline-flex rounded-full px-3 py-1 text-xs font-medium">
              Testimonials
            </div>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Loved by marketing operators
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.author} className="mos-card p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Sparkles key={i} className="h-3.5 w-3.5 text-[var(--brand-accent-strong)]" fill="var(--brand-accent-strong)" />
                  ))}
                </div>
                <p className="text-sm leading-6 mos-muted">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 border-t pt-4 mos-divider">
                  <p className="text-sm font-semibold">{t.author}</p>
                  <p className="mos-subtle text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mos-card mx-auto max-w-3xl p-10 text-center sm:p-14">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl mos-icon-tile">
              <Sparkles className="h-7 w-7" />
            </div>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Ready to give every brand a memory?
            </h2>
            <p className="mos-muted mx-auto mt-4 max-w-lg text-base leading-7">
              Start your 14-day free trial. No credit card required. Set up your first Brand Brain in under 5 minutes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Start your workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">Explore the product</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t mos-divider">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <div className="mos-icon-tile flex h-8 w-8 items-center justify-center rounded-md">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-semibold">MarketingOS</span>
          </div>
          <nav className="flex flex-wrap items-center gap-6 text-sm">
            <Link href="#capabilities" className="mos-muted hover:text-[var(--color-text-primary)] transition-colors">
              Capabilities
            </Link>
            <Link href="#how-it-works" className="mos-muted hover:text-[var(--color-text-primary)] transition-colors">
              How it works
            </Link>
            <Link href="/auth/signin" className="mos-muted hover:text-[var(--color-text-primary)] transition-colors">
              Sign in
            </Link>
          </nav>
          <p className="mos-subtle text-sm">Copyright 2026 MarketingOS. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
