"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Bot, 
  BrainCircuit, 
  ChevronDown, 
  MessageSquare, 
  Target, 
  Check, 
  ChevronRight,
  Sparkles,
  Command,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ============================================================
   MARKETING OS — Workspace Intelligence Landing Page
   ============================================================ */

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
            e.target.style.opacity = "1";
            e.target.style.transform = "translateY(0)";
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    const children = el.querySelectorAll(".lp-reveal");
    children.forEach((c) => {
      (c as HTMLElement).style.opacity = "0";
      (c as HTMLElement).style.transform = "translateY(24px)";
      (c as HTMLElement).style.transition = "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
      obs.observe(c);
    });
    return () => obs.disconnect();
  }, []);
  return ref;
}

export function MarketingLanding() {
  const [scrolled, setScrolled] = useState(false);
  const problemRef = useReveal();
  const solutionRef = useReveal();
  const employeesRef = useReveal();
  const ctaRef = useReveal();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="lp-root font-sans">
      {/* ── NAV ─────────────────────────────────────────── */}
      <nav
        className="lp-nav"
        style={{
          background: scrolled
            ? "rgba(12, 11, 9, 0.85)"
            : "rgba(12, 11, 9, 0.4)",
          borderBottomColor: scrolled ? "rgba(255,255,255,0.06)" : "transparent"
        }}
      >
        <div className="lp-container" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" className="lp-nav-logo group">
            <Image
              src="/logo.png"
              alt="MarketingOS"
              width={140}
              height={32}
              priority
              style={{ height: 26, width: "auto" }}
              className="transition-opacity group-hover:opacity-100"
            />
          </Link>
          <ul className="lp-nav-links">
            <li><a href="#problem">The Friction</a></li>
            <li><a href="#solution">Brand Brain</a></li>
            <li><a href="#employees">AI Team</a></li>
          </ul>
          <div className="lp-nav-actions">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex text-[var(--text-secondary)]">
              <Link href="/auth/signin">Sign in</Link>
            </Button>
            <Button size="sm" asChild className="h-8">
              <Link href="/auth/signup">
                Start free trial
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-container" style={{ width: "100%" }}>
          <div className="lp-hero-inner">
            <div 
              className="lp-reveal inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-[var(--accent-border)] bg-[var(--accent-subtle)] text-[0.75rem] font-medium text-[var(--accent-strong)]"
              style={{ transitionDelay: "0ms" }}
            >
              <Sparkles className="h-3 w-3" />
              Now in public beta
            </div>

            <h1 className="lp-display lp-hero-headline lp-reveal" style={{ transitionDelay: "100ms" }}>
              Context is everything.<br />
              <span className="italic-accent">Automate it.</span>
            </h1>

            <p className="lp-subheading lp-hero-sub lp-reveal" style={{ transitionDelay: "200ms" }}>
              Stop pasting brand guidelines into generic chat windows. Build a living Brand Brain once, and deploy specialist AI employees who already know your voice, audience, and strategy.
            </p>

            <div className="lp-hero-actions lp-reveal" style={{ transitionDelay: "300ms" }}>
              <Button size="lg" className="h-12 px-6 text-base" asChild>
                <Link href="/auth/signup">
                  Deploy your workspace
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" className="h-12 px-6 text-base bg-[var(--surface-3)]" asChild>
                <Link href="/dashboard">
                  View demo workspace
                </Link>
              </Button>
            </div>
            
            {/* Minimal App Mockup */}
            <div className="lp-hero-mockup-wrapper lp-reveal" style={{ transitionDelay: "400ms" }}>
              <div className="lp-hero-mockup flex flex-col">
                {/* Mockup Header */}
                <div className="h-12 border-b border-[var(--border)] bg-[var(--surface-2)] flex items-center px-4 gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)]" />
                  </div>
                  <div className="mx-auto flex h-6 items-center rounded-md border border-[var(--border)] bg-[var(--surface-3)] px-3 text-[0.6875rem] text-[var(--text-tertiary)] w-[240px] justify-center gap-2">
                    <Command className="h-3 w-3" /> marketing-os.app
                  </div>
                </div>
                {/* Mockup Body */}
                <div className="flex flex-1">
                  {/* Sidebar */}
                  <div className="w-48 border-r border-[var(--border)] bg-[var(--surface-1)] p-3 flex flex-col gap-1">
                    <div className="h-6 w-24 bg-[var(--surface-3)] rounded mb-4" />
                    <div className="h-5 w-full bg-[var(--surface-3)] rounded" />
                    <div className="h-5 w-[80%] bg-[var(--surface-2)] rounded" />
                    <div className="h-5 w-[90%] bg-[var(--surface-2)] rounded" />
                  </div>
                  {/* Main Content Area */}
                  <div className="flex-1 p-8 bg-[var(--surface-1)] relative overflow-hidden">
                    <div className="h-8 w-48 bg-[var(--surface-3)] rounded mb-6" />
                    <div className="flex gap-4 mb-8">
                      <div className="h-24 w-1/3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)]" />
                      <div className="h-24 w-1/3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)]" />
                      <div className="h-24 w-1/3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)]" />
                    </div>
                    <div className="h-40 w-full bg-[var(--surface-2)] rounded-xl border border-[var(--border)] flex items-end p-4">
                       <div className="h-8 w-[20%] bg-[var(--accent)]/20 rounded mr-2" />
                       <div className="h-16 w-[20%] bg-[var(--accent)]/40 rounded mr-2" />
                       <div className="h-12 w-[20%] bg-[var(--accent)]/30 rounded mr-2" />
                       <div className="h-24 w-[20%] bg-[var(--accent)]/60 rounded mr-2" />
                       <div className="h-32 w-[20%] bg-[var(--accent)] rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── PROBLEM ─────────────────────────────────────── */}
      <section id="problem" className="lp-section lp-problem" ref={problemRef}>
        <div className="lp-container">
          <div className="lp-problem-header lp-reveal">
            <div className="lp-label mb-4">The Friction</div>
            <h2 className="lp-heading mb-4">AI without context is just noise.</h2>
            <p className="lp-body">
              General-purpose AI chat requires you to constantly re-explain who you are, what you sell, and who you're talking to. The result? Generic output that sounds like a robot wrote it.
            </p>
          </div>

          <div className="lp-problem-cards">
            {[
              {
                icon: <MessageSquare />,
                title: "Repetitive Prompts",
                desc: "Pasting the same 'Target Audience' paragraph into ChatGPT for the 100th time today."
              },
              {
                icon: <Target />,
                title: "Generic Tone",
                desc: "Outputs that use words like 'unleash' and 'elevate' because the AI doesn't know your brand's actual voice."
              },
              {
                icon: <Bot />,
                title: "Juggling Tools",
                desc: "Switching between a doc for strategy, a chat window for generation, and an editor for fixing."
              },
              {
                icon: <BrainCircuit />,
                title: "Context Loss",
                desc: "Starting a new chat and realizing the AI forgot the campaign strategy you agreed on yesterday."
              }
            ].map((item, i) => (
              <div key={i} className="lp-problem-card lp-reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="lp-problem-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ─────────────────────────────────────── */}
      <section id="solution" className="lp-section lp-solution" ref={solutionRef}>
        <div className="lp-container">
          <div className="lp-solution-header lp-reveal">
            <div className="lp-label mb-4">The Brand Brain</div>
            <h2 className="lp-heading mb-4">Define it once.<br />Use it everywhere.</h2>
            <p className="lp-body">
              The Brand Brain is the core memory of your workspace. You define your tone, target audience, value propositions, and rules. Every AI employee automatically loads this context before they generate a single word.
            </p>
          </div>

          <div className="lp-solution-layout">
            <div className="lp-solution-brain lp-reveal">
              <div className="lp-brain-title">Memory core active</div>
              
              <div className="lp-brain-field">
                <div className="lp-brain-field-dot" />
                <div className="lp-brain-field-label">Voice</div>
                <div className="lp-brain-field-value">Authoritative but approachable. No jargon. Short sentences.</div>
              </div>
              <div className="lp-brain-field">
                <div className="lp-brain-field-dot" />
                <div className="lp-brain-field-label">Audience</div>
                <div className="lp-brain-field-value">Series A founders, technical buyers, marketing directors.</div>
              </div>
              <div className="lp-brain-field">
                <div className="lp-brain-field-dot" />
                <div className="lp-brain-field-label">Value Prop</div>
                <div className="lp-brain-field-value">We cut deployment times from weeks to minutes.</div>
              </div>
              <div className="lp-brain-field">
                <div className="lp-brain-field-dot" />
                <div className="lp-brain-field-label">Avoid Words</div>
                <div className="lp-brain-field-value">"Synergy", "Unleash", "Game-changer", "Revolutionary"</div>
              </div>
            </div>

            <ul className="lp-solution-points">
              {[
                { title: "System-level injection", desc: "The Brand Brain is injected at the system level for every prompt. You never have to manually attach guidelines again." },
                { title: "Multi-brand support", desc: "Managing 5 clients? Switch workspaces instantly. The AI dynamically swaps its brain for the active brand." },
                { title: "Living documentation", desc: "As your brand evolves, update the Brain. The entire AI team instantly adapts to the new positioning." }
              ].map((pt, i) => (
                <li key={i} className="lp-solution-point lp-reveal" style={{ transitionDelay: `${i * 150}ms` }}>
                  <div className="lp-solution-point-icon"><Check /></div>
                  <div>
                    <h3>{pt.title}</h3>
                    <p>{pt.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── AI EMPLOYEES ─────────────────────────────────── */}
      <section id="employees" className="lp-section lp-employees" ref={employeesRef}>
        <div className="lp-container">
          <div className="lp-employees-header lp-reveal">
            <div className="lp-label mb-4">Specialist Architecture</div>
            <h2 className="lp-heading mb-4">Meet your new team.</h2>
            <p className="lp-body">
              Instead of one generic chatbot, you get a roster of specialist AI Employees. Each is pre-prompted with deep domain expertise and inherits your Brand Brain automatically.
            </p>
          </div>

          <div className="lp-employees-grid">
            {[
              {
                role: "Content Director",
                name: "Alex",
                cls: "lp-emp-content",
                desc: "Expert in narrative structure, long-form blogs, and editorial calendars. Writes to be read, not skimmed."
              },
              {
                role: "Performance Marketer",
                name: "Sam",
                cls: "lp-emp-mktg",
                desc: "Obsessed with CTR and conversions. Writes crisp ad copy, landing page hooks, and email sequences."
              },
              {
                role: "SEO Strategist",
                name: "Taylor",
                cls: "lp-emp-seo",
                desc: "Focuses on intent, semantic richness, and structure. Optimizes briefs and audits existing copy."
              }
            ].map((emp, i) => (
              <div key={i} className={`lp-employee-card ${emp.cls} lp-reveal`} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="lp-employee-avatar"><Bot /></div>
                <div className="lp-employee-role">{emp.role}</div>
                <h3>{emp.name}</h3>
                <p className="desc">{emp.desc}</p>
                <div className="mt-6 flex items-center text-[0.8125rem] font-medium text-[var(--emp-color)]">
                  Inherits Brand Brain <ChevronRight className="h-3 w-3 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="lp-section lp-cta" ref={ctaRef}>
        <div className="lp-container">
          <div className="lp-cta-inner lp-reveal">
            <h2 className="lp-display">Stop prompting.<br/>Start directing.</h2>
            <p className="mt-6 text-lg text-[var(--text-secondary)]">
              Join the beta today and build your first Brand Brain for free.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-8 text-[1.0625rem]" asChild>
                <Link href="/auth/signup">
                  Deploy MarketingOS
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-inner">
            <Image
              src="/logo.png"
              alt="MarketingOS"
              width={140}
              height={32}
              style={{ height: 20, width: "auto", opacity: 0.5, filter: "grayscale(1) brightness(1.5)" }}
            />
            <p>© {new Date().getFullYear()} MarketingOS. A concept interface.</p>
            <div className="lp-footer-links">
              <Link href="#">Terms</Link>
              <Link href="#">Privacy</Link>
              <Link href="#">Twitter</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
