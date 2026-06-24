"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

/* ============================================================
   MARKETING OS — Full Landing Page
   All sections, all copy, no placeholders.
   ============================================================ */

// ─── Reveal Hook ────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    const children = el.querySelectorAll(".lp-reveal");
    children.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ─── Pricing Toggle ─────────────────────────────────────────
function PricingToggle({
  annual,
  setAnnual,
}: {
  annual: boolean;
  setAnnual: (v: boolean) => void;
}) {
  return (
    <div className="lp-pricing-toggle">
      <button
        onClick={() => setAnnual(false)}
        className={`lp-pricing-toggle-btn ${!annual ? "active" : ""}`}
      >
        Monthly
      </button>
      <button
        onClick={() => setAnnual(true)}
        className={`lp-pricing-toggle-btn ${annual ? "active" : ""}`}
      >
        Annual{" "}
        <span className="lp-pricing-save" style={{ marginLeft: 8 }}>
          Save 20%
        </span>
      </button>
    </div>
  );
}

// ─── FAQ Item ────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`lp-faq-item ${open ? "open" : ""}`}>
      <button className="lp-faq-question" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span className="lp-faq-chevron">▾</span>
      </button>
      <div className="lp-faq-answer">
        <div className="lp-faq-answer-inner">{a}</div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────
export function MarketingLanding() {
  const [annual, setAnnual] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const problemRef = useReveal();
  const solutionRef = useReveal();
  const howRef = useReveal();
  const employeesRef = useReveal();
  const forRef = useReveal();
  const diffRef = useReveal();
  const proofRef = useReveal();
  const pricingRef = useReveal();
  const faqRef = useReveal();
  const ctaRef = useReveal();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const monthly = { freelancer: 29, agency: 79, enterprise: 249 };
  const prices = annual
    ? {
        freelancer: Math.round(monthly.freelancer * 0.8),
        agency: Math.round(monthly.agency * 0.8),
        enterprise: Math.round(monthly.enterprise * 0.8),
      }
    : monthly;

  return (
    <div className="lp-root">
      {/* ── NAV ─────────────────────────────────────────── */}
      <nav
        className="lp-nav"
        style={{
          background: scrolled
            ? "rgba(8,9,16,0.88)"
            : "rgba(8,9,16,0.72)",
        }}
      >
        <div style={{ maxWidth: 1200, width: "100%", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" className="lp-nav-logo">
            <Image
              src="/logo.png"
              alt="MarketingOS"
              width={400}
              height={80}
              priority
              style={{ height: 120, width: "auto", filter: "brightness(1.4) contrast(1.1)" }}
            />
          </Link>
          <ul className="lp-nav-links">
            <li><a href="#problem">Problem</a></li>
            <li><a href="#solution">Solution</a></li>
            <li><a href="#employees">AI Employees</a></li>
            <li><a href="#pricing">Pricing</a></li>
          </ul>
          <div className="lp-nav-actions">
            <Link href="/auth/signin" className="lp-btn lp-btn-ghost lp-btn-sm">Sign in</Link>
            <Link href="/auth/signup" className="lp-btn lp-btn-primary lp-btn-sm">
              Start free trial
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-bg">
          <div className="lp-hero-grid" />
          <div className="lp-hero-glow-1" />
          <div className="lp-hero-glow-2" />
        </div>
        <div className="lp-container" style={{ width: "100%" }}>
          <div className="lp-hero-inner">
            <div className="lp-tag lp-animate-up lp-animate-up-1">
              <span className="lp-tag-dot" />
              Now in public beta — 14-day free trial
            </div>

            <h1 className="lp-display lp-hero-headline lp-animate-up lp-animate-up-2">
              Your brand context,<br />
              <span className="accent">loaded by default.</span>
            </h1>

            <p className="lp-subheading lp-hero-sub lp-animate-up lp-animate-up-3">
              You stop pasting brand guidelines into every AI prompt.
              Build a Brand Brain once — every AI employee reads it automatically,
              every time.
            </p>

            <div className="lp-hero-actions lp-animate-up lp-animate-up-4">
              <Link href="/auth/signup" className="lp-btn lp-btn-primary lp-btn-lg">
                Build your Brand Brain free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/dashboard" className="lp-btn lp-btn-ghost lp-btn-lg">
                See it in action
              </Link>
            </div>

            <p className="lp-hero-social-proof lp-animate-up lp-animate-up-5">
              Used by <strong>agencies managing 50+ brands</strong>, freelancers with demanding client portfolios,
              and in-house teams who are done with inconsistent copy.
            </p>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ─────────────────────────────────────── */}
      <section id="problem" className="lp-section lp-problem" ref={problemRef}>
        <div className="lp-container">
          <div className="lp-problem-header">
            <div className="lp-section-label">
              <span className="lp-section-label-line" />
              The problem
            </div>
            <h2 className="lp-heading lp-reveal" style={{ marginBottom: 16 }}>
              Every AI session starts from zero.
            </h2>
            <p className="lp-subheading lp-reveal lp-reveal-1" style={{ fontSize: "1.0625rem" }}>
              You know the brand inside out. The AI doesn't. And you pay for that gap every single day.
            </p>
          </div>

          <div className="lp-problem-cards">
            {[
              {
                icon: "📋",
                title: "The copy-paste ritual",
                desc: "You open ChatGPT. You paste the brand deck again. You explain the tone of voice — again. You remind it who the audience is — again. Then you do this 14 more times today, for 14 different clients.",
              },
              {
                icon: "🤖",
                title: "Generic AI output",
                desc: "\"We are excited to announce...\" The AI doesn't know your client's brand is deadpan and direct. It doesn't know they hate exclamation marks. It produces competent, completely wrong content.",
              },
              {
                icon: "💨",
                title: "Context that evaporates",
                desc: "Yesterday's conversation is gone. The nuances you painstakingly explained — the target customer's biggest fear, the messaging hierarchy, the forbidden phrases — all of it vanishes the moment you close the tab.",
              },
              {
                icon: "😬",
                title: "The professional embarrassment",
                desc: "Off-brand content reaches a client. It's not disastrously wrong — just slightly off. The tone is too formal. The CTA doesn't match their offer. You fix it. They notice. It compounds.",
              },
            ].map((card, i) => (
              <div className={`lp-problem-card lp-reveal lp-reveal-${i + 1}`} key={card.title}>
                <div className="lp-problem-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ─────────────────────────────────────── */}
      <section id="solution" className="lp-section lp-solution" ref={solutionRef}>
        <div className="lp-container">
          <div className="lp-solution-header">
            <div className="lp-section-label">
              <span className="lp-section-label-line" />
              The solution
            </div>
            <h2 className="lp-heading lp-reveal" style={{ marginBottom: 16 }}>
              Fill it in once.<br />They read it forever.
            </h2>
            <p className="lp-subheading lp-reveal lp-reveal-1" style={{ fontSize: "1.0625rem" }}>
              The Brand Brain is a structured knowledge store for a brand. Every AI employee on the platform reads it automatically before every response. No prompts to write. No context to paste. No setup per session.
            </p>
          </div>

          <div className="lp-solution-layout">
            {/* Brand Brain visual */}
            <div className="lp-solution-brain lp-reveal">
              <div className="lp-brain-title">Brand Brain · Orvex Studio</div>
              {[
                { label: "Voice & Tone", value: "Deadpan wit. Intelligent. Never corporate. Reads like a smart friend who happens to know design." },
                { label: "Target Audience", value: "Independent creative directors, 28–42, billing over £8k/month. Allergic to fluff." },
                { label: "Mission", value: "Help the best independent creatives work like studios, without the overhead." },
                { label: "Forbidden phrases", value: "\"leverage\", \"synergy\", \"circle back\", \"exciting news\", exclamation marks in B2B copy." },
                { label: "Core offer", value: "Brand identity + positioning strategy. 12-week engagement. Fixed price." },
                { label: "Competitors", value: "Pentagram, DesignStudio, Ragged Edge. Positioned as better value, faster, no account manager layer." },
              ].map((f) => (
                <div className="lp-brain-field" key={f.label}>
                  <div className="lp-brain-field-dot" />
                  <div className="lp-brain-field-label">{f.label}</div>
                  <div className="lp-brain-field-value">{f.value}</div>
                </div>
              ))}
            </div>

            {/* Solution points */}
            <ul className="lp-solution-points">
              {[
                {
                  icon: "🧠",
                  title: "One brain, unlimited output",
                  desc: "A Brand Brain covers every dimension a marketer needs: tone, audience, mission, values, competitors, SEO keywords, messaging hierarchy, and the phrases that are never allowed. You fill it in once per brand.",
                },
                {
                  icon: "👥",
                  title: "AI employees that inherit context",
                  desc: "When you open a conversation with any AI employee — Marketing Director, Content Director, SEO Director — they already know the brand. They've read the Brain. The conversation starts in media res.",
                },
                {
                  icon: "🏢",
                  title: "Unlimited brands, isolated contexts",
                  desc: "Client A never bleeds into Client B. Each brand has its own Brain, its own conversations, its own AI team. Switching brands switches everything. The confusion of managing multiple clients in a single ChatGPT account is gone.",
                },
              ].map((p, i) => (
                <li className={`lp-solution-point lp-reveal lp-reveal-${i + 1}`} key={p.title}>
                  <div className="lp-solution-point-icon">{p.icon}</div>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section id="how" className="lp-section lp-how" ref={howRef}>
        <div className="lp-container">
          <div className="lp-how-header">
            <div className="lp-section-label">
              <span className="lp-section-label-line" />
              How it works
            </div>
            <h2 className="lp-heading lp-reveal" style={{ marginBottom: 16 }}>
              Three steps. Then you're done.
            </h2>
            <p className="lp-subheading lp-reveal lp-reveal-1" style={{ fontSize: "1.0625rem" }}>
              The initial setup is the only setup. After that, every AI conversation starts with full brand context already loaded.
            </p>
          </div>

          <div className="lp-how-steps">
            {[
              {
                num: "01",
                title: "Build the Brand Brain",
                desc: "Fill in the structured brand profile for each client or brand. Tone, audience, mission, competitors, keywords, messaging rules, what to say, what to never say.",
                detail: (
                  <>
                    <strong>Under the hood:</strong> MarketingOS converts your Brand Brain into a rich system prompt that gets injected at the start of every AI conversation for that brand. You never write a system prompt again.
                  </>
                ),
              },
              {
                num: "02",
                title: "Open an AI Employee",
                desc: "Choose which specialist you need — Marketing Director for strategy, Content Director for editorial, SEO Director for keyword work, Creative Director for visual briefs, Analytics Director for performance.",
                detail: (
                  <>
                    <strong>Under the hood:</strong> Each employee has a distinct reasoning framework and output format tuned to their discipline. The Marketing Director thinks in funnels and campaigns. The SEO Director thinks in intent clusters. They're not interchangeable.
                  </>
                ),
              },
              {
                num: "03",
                title: "Get on-brand output instantly",
                desc: "Ask the question you actually need answered. No preamble. No context-setting. No \"remember that this brand is...\" The employee already knows. The output is on-brand from the first token.",
                detail: (
                  <>
                    <strong>Under the hood:</strong> The Brand Brain and employee prompt combine before every API call. Conversation history persists per brand per employee, so context accumulates — each session builds on the last.
                  </>
                ),
              },
            ].map((step, i) => (
              <div
                key={step.num}
                className={`lp-how-step lp-reveal lp-reveal-${i + 1}`}
                data-step={step.num}
              >
                <div className="lp-how-step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                <div className="lp-how-step-detail">{step.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI EMPLOYEES ─────────────────────────────────── */}
      <section id="employees" className="lp-section lp-employees" ref={employeesRef}>
        <div className="lp-container">
          <div className="lp-employees-header">
            <div className="lp-section-label">
              <span className="lp-section-label-line" />
              AI Employees
            </div>
            <h2 className="lp-heading lp-reveal" style={{ marginBottom: 16 }}>
              Meet the team.
            </h2>
            <p className="lp-subheading lp-reveal lp-reveal-1" style={{ fontSize: "1.0625rem" }}>
              Five specialists. Each one trained for their discipline, not a generic chatbot with a different label. They think differently, output differently, and they all know your brand before you say hello.
            </p>
          </div>

          <div className="lp-employees-grid">
            {[
              {
                cls: "lp-emp-mktg",
                emoji: "📊",
                role: "Marketing Director",
                name: "Strategic lead",
                desc: "Runs the room. Turns business objectives into marketing strategy, campaign architecture, and messaging frameworks. The employee you talk to when you're deciding what to do, not just how to say it.",
                outputs: [
                  "Go-to-market strategies",
                  "Campaign briefs & architecture",
                  "Positioning frameworks",
                  "Quarterly marketing plans",
                  "Messaging hierarchies",
                ],
              },
              {
                cls: "lp-emp-content",
                emoji: "✍️",
                role: "Content Director",
                name: "Editorial lead",
                desc: "Executes on the strategy with words. Blog posts, email sequences, social captions, landing page copy — all written in the brand voice, for the specific audience, with the right CTA.",
                outputs: [
                  "Long-form articles & blog posts",
                  "Email sequences (welcome, nurture, sales)",
                  "Social media captions",
                  "Landing page copy",
                  "Content calendars",
                ],
              },
              {
                cls: "lp-emp-seo",
                emoji: "🔍",
                role: "SEO Director",
                name: "Search lead",
                desc: "Keyword strategy, content gap analysis, on-page optimisation, technical SEO audits. Connects search intent to the brand's core messaging — not generic traffic, qualified traffic.",
                outputs: [
                  "Keyword clusters by intent",
                  "Content gap analysis",
                  "On-page SEO briefs",
                  "Meta titles & descriptions",
                  "Internal linking strategy",
                ],
              },
              {
                cls: "lp-emp-creative",
                emoji: "🎨",
                role: "Creative Director",
                name: "Visual lead",
                desc: "Directs creative work without doing it. Briefs designers, writes image prompts, defines visual style, reviews brand consistency. The strategic voice behind every creative decision.",
                outputs: [
                  "Creative briefs for designers",
                  "AI image generation prompts",
                  "Brand style direction",
                  "Campaign concept write-ups",
                  "Visual identity guidelines",
                ],
              },
              {
                cls: "lp-emp-analytics",
                emoji: "📈",
                role: "Analytics Director",
                name: "Performance lead",
                desc: "Reads the numbers, translates them to decisions. Interprets campaign data, identifies what's working, surfaces why it isn't, and tells you exactly what to do next.",
                outputs: [
                  "Performance analysis reports",
                  "A/B test interpretation",
                  "KPI dashboards & metrics",
                  "Funnel drop-off diagnosis",
                  "Channel attribution analysis",
                ],
              },
            ].map((emp, i) => (
              <div
                key={emp.role}
                className={`lp-employee-card ${emp.cls} lp-reveal lp-reveal-${(i % 4) + 1}`}
              >
                <div className="lp-employee-avatar">{emp.emoji}</div>
                <div className="lp-employee-role">{emp.role}</div>
                <h3>{emp.name}</h3>
                <p className="desc">{emp.desc}</p>
                <ul className="lp-employee-outputs">
                  {emp.outputs.map((o) => (
                    <li key={o} className="lp-employee-output">{o}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ─────────────────────────────────── */}
      <section id="for" className="lp-section lp-for" ref={forRef}>
        <div className="lp-container">
          <div className="lp-for-header">
            <div className="lp-section-label">
              <span className="lp-section-label-line" />
              Who it's for
            </div>
            <h2 className="lp-heading lp-reveal" style={{ marginBottom: 16 }}>
              Built for the people managing many brands at once.
            </h2>
            <p className="lp-subheading lp-reveal lp-reveal-1" style={{ fontSize: "1.0625rem" }}>
              If you're managing one brand, any AI tool will do. MarketingOS is for when managing brand context itself is the problem.
            </p>
          </div>

          <div className="lp-for-grid">
            {[
              {
                emoji: "🧑‍💻",
                title: "Freelancers managing multiple clients",
                pain: "You're producing content for 8 clients. Each has a completely different voice, audience, and rules. You spend 20% of your time just re-establishing context before you can do any actual work.",
                benefit: "Build a Brand Brain for each client. When you sit down to work on Client B after a week focused on Client A, the AI already knows everything. You start working in 10 seconds, not 20 minutes.",
              },
              {
                emoji: "🏢",
                title: "Small agencies with large client portfolios",
                pain: "Your team of four manages 30 brands. Junior staff produce content that doesn't quite match brand guidelines. Senior staff spend hours correcting it. The overhead of quality control is silently killing your margins.",
                benefit: "The Brand Brain functions as your agency's single source of brand truth. Any team member, on any brand, gets AI output that's already filtered through the correct brand context — before they've even written a prompt.",
              },
              {
                emoji: "🏗️",
                title: "In-house teams managing multiple brand lines",
                pain: "Your parent company has a B2B brand, a B2C sub-brand, and a new market entry. Three audiences. Three tones. Three sets of messaging rules. Your in-house team is context-switching constantly, and the copy shows it.",
                benefit: "One organisation, multiple isolated Brand Brains. Your B2B and B2C content can't bleed together. Each AI employee speaks in the right voice for the right brand, every time.",
              },
            ].map((card, i) => (
              <div className={`lp-for-card lp-reveal lp-reveal-${i + 1}`} key={card.title}>
                <span className="lp-for-emoji">{card.emoji}</span>
                <h3>{card.title}</h3>
                <div className="lp-for-pain">⚡ {card.pain}</div>
                <p className="lp-for-benefit">✓ {card.benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIFFERENTIATION ──────────────────────────────── */}
      <section id="diff" className="lp-section lp-diff" ref={diffRef}>
        <div className="lp-container">
          <div className="lp-diff-header">
            <div className="lp-section-label">
              <span className="lp-section-label-line" />
              Why not just use...
            </div>
            <h2 className="lp-heading lp-reveal" style={{ marginBottom: 16 }}>
              This isn't a better chatbot.
              It's a different category.
            </h2>
            <p className="lp-subheading lp-reveal lp-reveal-1" style={{ fontSize: "1.0625rem" }}>
              ChatGPT, Jasper, and HubSpot AI are all capable tools. None of them solve the persistent brand context problem across multiple brands with role-specific specialists. That's the gap MarketingOS exists to close.
            </p>
          </div>

          <div className="lp-reveal lp-reveal-2" style={{ overflowX: "auto" }}>
            <table className="lp-diff-table">
              <thead>
                <tr>
                  <th>Capability</th>
                  <th>ChatGPT</th>
                  <th>Jasper</th>
                  <th>HubSpot AI</th>
                  <th>MarketingOS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    cap: "Persistent brand context",
                    chatgpt: <span className="lp-no">Custom instructions only, one profile, resets frequently</span>,
                    jasper: <span className="lp-partial">Style guides per account, limited depth</span>,
                    hubspot: <span className="lp-no">Brand kit in settings, not AI-native</span>,
                    mos: <span className="lp-yes">✓ Full Brand Brain per brand, 20+ fields, injected automatically</span>,
                  },
                  {
                    cap: "Multi-brand management",
                    chatgpt: <span className="lp-no">No. One account, one context.</span>,
                    jasper: <span className="lp-partial">Workspaces, basic separation</span>,
                    hubspot: <span className="lp-no">One brand per portal</span>,
                    mos: <span className="lp-yes">✓ Unlimited isolated brands per organisation</span>,
                  },
                  {
                    cap: "Role-specific AI specialists",
                    chatgpt: <span className="lp-no">Generic assistant</span>,
                    jasper: <span className="lp-no">Templates, not roles</span>,
                    hubspot: <span className="lp-no">Content assistant, single mode</span>,
                    mos: <span className="lp-yes">✓ 5 specialists with distinct reasoning frameworks</span>,
                  },
                  {
                    cap: "Context persists between sessions",
                    chatgpt: <span className="lp-partial">Memory feature, unreliable, manual</span>,
                    jasper: <span className="lp-no">Per-document context only</span>,
                    hubspot: <span className="lp-no">No cross-session memory</span>,
                    mos: <span className="lp-yes">✓ Brand Brain + conversation history, always present</span>,
                  },
                  {
                    cap: "Built for marketing teams",
                    chatgpt: <span className="lp-no">General purpose</span>,
                    jasper: <span className="lp-partial">Marketing-focused but single-brand</span>,
                    hubspot: <span className="lp-partial">CRM-integrated, not brand-first</span>,
                    mos: <span className="lp-yes">✓ Built exclusively for multi-brand marketing workflows</span>,
                  },
                ].map((row) => (
                  <tr key={row.cap}>
                    <td>{row.cap}</td>
                    <td>{row.chatgpt}</td>
                    <td>{row.jasper}</td>
                    <td>{row.hubspot}</td>
                    <td>{row.mos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section id="proof" className="lp-section lp-proof" ref={proofRef}>
        <div className="lp-container">
          <div className="lp-proof-header">
            <div className="lp-section-label">
              <span className="lp-section-label-line" />
              From the people using it
            </div>
            <h2 className="lp-heading lp-reveal" style={{ marginBottom: 0 }}>
              Specific outcomes, not vague praise.
            </h2>
          </div>

          <div className="lp-proof-grid">
            {[
              {
                quote: "We manage 26 clients. Before MarketingOS, onboarding a junior to a new client took two weeks of shadowing just to get the brand voice right. Now I point them at the Brand Brain and they're producing usable content on day one. We cut onboarding time by about 70% and the quality issues that used to reach clients have basically stopped.",
                name: "Sarah Okafor",
                title: "Head of Content, Meridian Agency",
                emoji: "👩🏾‍💼",
                bg: "rgba(124,156,255,0.1)",
              },
              {
                quote: "I'm a freelancer. I was wasting 45 minutes every morning repasting brand context into ChatGPT before I could start real work. I had a 'brand notes' doc in Notion that I copied into every prompt. MarketingOS made that ritual pointless. I reclaimed nearly four hours a week — that's a billable day, every month.",
                name: "Tom Barker",
                title: "Independent brand strategist",
                emoji: "👨‍💻",
                bg: "rgba(167,139,250,0.1)",
              },
              {
                quote: "Our parent brand and our DTC sub-brand had completely different voices — one formal and B2B, one casual and direct-to-consumer. Keeping them separate in AI tools was a nightmare. We'd catch cross-contamination in content before it shipped, but not always. Since building separate Brand Brains, that problem is gone. Zero bleed in six months.",
                name: "Rachel Chen",
                title: "Marketing Director, Lumova Group",
                emoji: "👩‍💼",
                bg: "rgba(52,211,153,0.1)",
              },
            ].map((t, i) => (
              <div className={`lp-testimonial lp-reveal lp-reveal-${i + 1}`} key={t.name}>
                <p className="lp-testimonial-quote">{t.quote}</p>
                <div className="lp-testimonial-author">
                  <div
                    className="lp-testimonial-avatar"
                    style={{ background: t.bg }}
                  >
                    {t.emoji}
                  </div>
                  <div>
                    <div className="lp-testimonial-name">{t.name}</div>
                    <div className="lp-testimonial-title">{t.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────── */}
      <section id="pricing" className="lp-section lp-pricing" ref={pricingRef}>
        <div className="lp-container">
          <div className="lp-pricing-header">
            <div className="lp-section-label">
              <span className="lp-section-label-line" />
              Pricing
            </div>
            <h2 className="lp-heading lp-reveal" style={{ marginBottom: 12 }}>
              Simple pricing. No per-seat surprises.
            </h2>
            <p
              className="lp-reveal lp-reveal-1"
              style={{ color: "rgba(255,255,255,0.48)", fontSize: "0.9375rem" }}
            >
              All plans include a 14-day free trial. No credit card required to start.
            </p>
          </div>

          <PricingToggle annual={annual} setAnnual={setAnnual} />

          <div className="lp-pricing-grid">
            {/* Freelancer */}
            <div className="lp-pricing-tier lp-reveal">
              <div className="lp-tier-name">Freelancer</div>
              <div className="lp-tier-target">For independents managing client brands</div>
              <div className="lp-tier-price">
                <span className="lp-tier-price-amount">${prices.freelancer}</span>
                <span className="lp-tier-price-period">/mo{annual ? " · billed annually" : ""}</span>
              </div>
              <div className="lp-tier-brand-limit">Up to 5 brands</div>
              <ul className="lp-tier-features">
                {[
                  "5 Brand Brains",
                  "All 5 AI Employees",
                  "Unlimited conversations",
                  "Campaign management",
                  "Content planner",
                  "14-day free trial",
                ].map((f) => (
                  <li key={f} className="lp-tier-feature">
                    <span className="lp-tier-feature-check">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="lp-btn lp-btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
                Start free trial
              </Link>
            </div>

            {/* Agency */}
            <div className="lp-pricing-tier popular lp-reveal lp-reveal-1">
              <div className="lp-tier-name">Agency</div>
              <div className="lp-tier-target">For teams managing 10–50 client brands</div>
              <div className="lp-tier-price">
                <span className="lp-tier-price-amount">${prices.agency}</span>
                <span className="lp-tier-price-period">/mo{annual ? " · billed annually" : ""}</span>
              </div>
              <div className="lp-tier-brand-limit">Up to 30 brands · 5 team seats</div>
              <ul className="lp-tier-features">
                {[
                  "30 Brand Brains",
                  "All 5 AI Employees per brand",
                  "5 team member seats",
                  "Role-based access control",
                  "Shared brand context across team",
                  "Campaign management",
                  "Content planner & media library",
                  "Priority support",
                  "14-day free trial",
                ].map((f) => (
                  <li key={f} className="lp-tier-feature">
                    <span className="lp-tier-feature-check">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="lp-btn lp-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                Start free trial
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>

            {/* Enterprise */}
            <div className="lp-pricing-tier lp-reveal lp-reveal-2">
              <div className="lp-tier-name">Enterprise</div>
              <div className="lp-tier-target">For large agencies and in-house marketing orgs</div>
              <div className="lp-tier-price">
                <span className="lp-tier-price-amount">${prices.enterprise}</span>
                <span className="lp-tier-price-period">/mo{annual ? " · billed annually" : ""}</span>
              </div>
              <div className="lp-tier-brand-limit">Unlimited brands · Unlimited seats</div>
              <ul className="lp-tier-features">
                {[
                  "Unlimited Brand Brains",
                  "All 5 AI Employees per brand",
                  "Unlimited team seats",
                  "Advanced role permissions",
                  "Custom AI employee configuration",
                  "SSO / SAML authentication",
                  "Audit logs",
                  "Dedicated onboarding session",
                  "SLA-backed support",
                  "Custom contract available",
                ].map((f) => (
                  <li key={f} className="lp-tier-feature">
                    <span className="lp-tier-feature-check">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="lp-btn lp-btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
                Talk to sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section id="faq" className="lp-section lp-faq" ref={faqRef}>
        <div className="lp-container">
          <div className="lp-faq-header">
            <div className="lp-section-label">
              <span className="lp-section-label-line" />
              Questions
            </div>
            <h2 className="lp-heading lp-reveal" style={{ marginBottom: 0 }}>
              The things people ask before signing up.
            </h2>
          </div>

          <div className="lp-faq-list lp-reveal">
            {[
              {
                q: "How does the Brand Brain actually work — is it just a saved prompt?",
                a: "No. The Brand Brain is a structured database with 20+ distinct fields covering tone, audience, mission, values, competitors, SEO keywords, messaging hierarchy, brand rules, and more. Before every AI conversation, MarketingOS compiles that data into a rich context block and injects it into the system prompt automatically. The AI employee never sees a blank slate — it sees the brand. It's architecturally different from saving a custom instruction or pasting into a prompt.",
              },
              {
                q: "Is my brand data secure? Who can see what I enter into the Brand Brain?",
                a: "Your Brand Brain data is stored in a dedicated database row scoped to your organisation. No other user or organisation can access it. MarketingOS does not use your Brand Brain data to train AI models. Data is encrypted at rest and in transit. For Enterprise customers, we offer data processing agreements and can discuss additional contractual requirements.",
              },
              {
                q: "Does MarketingOS replace my existing tools — ChatGPT, Notion, HubSpot?",
                a: "Not necessarily. MarketingOS solves a specific problem: persistent brand context across multiple brands with role-specific AI employees. If you still want to use ChatGPT for other purposes, nothing stops that. The value of MarketingOS is specifically in the AI conversations where brand accuracy matters. Most teams use it alongside, not instead of, their other tools.",
              },
              {
                q: "What happens if the AI still gets the brand wrong?",
                a: "You update the Brand Brain. If you notice the AI making an error — using a tone that doesn't fit, referencing the wrong audience, missing a key message — that's a signal that the Brain needs a new field or a clearer instruction. The Brain is a living document. The more specific you make it, the more accurate the output becomes. Most teams get to consistent output within two or three refinement cycles.",
              },
              {
                q: "How does it handle multiple brands? Is there any risk of cross-contamination?",
                a: "Each brand has a completely isolated Brand Brain, isolated conversation history, and isolated AI employee contexts. Switching brands in the UI switches everything — the AI has no memory of the previous brand's context. The technical architecture enforces separation at the database level. Cross-contamination is architecturally prevented, not just editorially managed.",
              },
              {
                q: "Is there a free trial? Do I need a credit card?",
                a: "Yes, all plans include a 14-day free trial. No credit card is required to start. You can build Brand Brains, work with all five AI employees, and evaluate the output quality in full before committing. If you decide not to continue, your account simply expires — no charge, no retention pressure.",
              },
              {
                q: "How is this different from using ChatGPT's custom instructions or memory?",
                a: "Custom instructions in ChatGPT are a single text block with no structure, no per-brand isolation, and unreliable persistence. Memory is experimental and can be toggled off. Neither supports multi-brand separation. MarketingOS's Brand Brain is a structured, per-brand database that gets injected deterministically before every conversation. It doesn't forget. It doesn't mix brands. And it's not a workaround — it's the entire architecture.",
              },
              {
                q: "Can I add my own team members, and what access do they have?",
                a: "On Agency and Enterprise plans, you can invite team members with role-based permissions. Owners can edit Brand Brains and manage billing. Admins can manage content and run AI conversations. Members can use AI employees and view brand data. Sensitive brand information can be marked restricted so junior team members can work with the AI output without seeing the underlying strategy. Enterprise plans support custom permission configurations and SSO.",
              },
            ].map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section className="lp-section lp-final-cta" ref={ctaRef}>
        <div className="lp-final-cta-bg" />
        <div className="lp-container">
          <div className="lp-final-cta-inner">
            <div className="lp-section-label" style={{ justifyContent: "center" }}>
              <span className="lp-section-label-line" />
              Ready
            </div>
            <h2 className="lp-heading lp-reveal" style={{ marginBottom: 20, fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              Stop re-explaining your brand to AI.<br />
              <span className="lp-gradient-text">Build the Brain once.</span>
            </h2>
            <p
              className="lp-subheading lp-reveal lp-reveal-1"
              style={{ fontSize: "1.0625rem", maxWidth: 520, margin: "0 auto 40px" }}
            >
              Your first Brand Brain takes about 20 minutes to fill in. After that, every AI conversation starts on-brand — for that brand, every time.
            </p>
            <div className="lp-reveal lp-reveal-2" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/auth/signup" className="lp-btn lp-btn-primary lp-btn-lg">
                Start your free trial — no card needed
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/auth/signin" className="lp-btn lp-btn-ghost lp-btn-lg">
                Already have an account? Sign in
              </Link>
            </div>
            <p className="lp-reveal lp-reveal-3" style={{ marginTop: 24, fontSize: "0.8125rem", color: "rgba(255,255,255,0.3)" }}>
              14-day free trial · No credit card · Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-inner">
            <div style={{ display: "flex", alignItems: "center" }}>
              <Image
                src="/logo.png"
                alt="MarketingOS"
                width={180}
                height={40}
                style={{ height: 120, width: "auto", filter: "brightness(1.3)", opacity: 0.88 }}
              />
            </div>
            <nav className="lp-footer-links">
              <a href="#problem">Problem</a>
              <a href="#solution">Solution</a>
              <a href="#employees">AI Employees</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
              <Link href="/auth/signin">Sign in</Link>
            </nav>
            <p className="lp-footer-copy">© 2026 MarketingOS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
