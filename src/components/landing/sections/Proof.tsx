"use client";

import { motion } from "framer-motion";
import { Bot, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollSection } from "../scroll/ScrollSection";
import { fadeUp, cardStagger, cardReveal } from "../motion/presets";
import type { LandingNarrative } from "../brand/brand-context";

interface ProofProps {
  narrative: LandingNarrative["proof"];
}

export function ProofSection({ narrative }: ProofProps) {
  const hasTestimonials = narrative.items.some((i) => i.quote && i.author);

  return (
    <>
      <ScrollSection>
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 w-full">
            <motion.div
              variants={cardStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]"
            >
              <div>
                <motion.div variants={fadeUp} className="mos-pill mb-4 inline-flex rounded-full px-3 py-1 text-xs font-medium">
                  AI-powered workflows
                </motion.div>
                <motion.h2 variants={fadeUp} className="text-3xl font-semibold leading-tight sm:text-4xl">
                  Every AI employee starts with full brand context
                </motion.h2>
                <motion.p variants={fadeUp} className="mos-muted mt-4 text-base leading-7">
                  No more copy-pasting brand guidelines into every brief. Your Brand Brain stores voice, audience, products, and strategy — and every AI specialist reads it automatically.
                </motion.p>
                <motion.ul variants={cardStagger} className="mt-6 space-y-3">
                  {[
                    "Content strategist that knows your tone",
                    "SEO analyst that understands your market",
                    "Social manager briefed on your campaigns",
                    "Copywriter aligned with your brand voice",
                  ].map((item) => (
                    <motion.li key={item} variants={fadeUp} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-positive)]" />
                      <span className="mos-muted">{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
                <motion.div variants={fadeUp} className="mt-8">
                  <Button asChild>
                    <Link href="/auth/signup">
                      Start building
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </div>

              <motion.div variants={cardReveal} className="mos-card p-6">
                <div className="flex items-center gap-3 border-b pb-4 mos-divider">
                  <div className="mos-icon-tile flex h-10 w-10 items-center justify-center rounded-lg">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Content Strategist</p>
                    <p className="mos-subtle text-xs">Reading from Brand Brain</p>
                  </div>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="rounded-lg bg-[var(--color-surface-2)] p-4">
                    <p className="text-sm leading-6 text-[var(--color-text-primary)]">
                      Based on the brand brain, I recommend a Q3 campaign focusing on the primary audience. The voice analysis shows &ldquo;warm authority&rdquo; performs best with this demographic.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="mos-pill rounded-full px-2 py-0.5 text-xs">Brand-aligned</span>
                    <span className="mos-success-pill rounded-full px-2 py-0.5 text-xs">Context: 94%</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </ScrollSection>

      {hasTestimonials && (
        <ScrollSection>
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 w-full">
            <motion.div
              variants={cardStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="mx-auto max-w-2xl text-center"
            >
              <motion.div variants={fadeUp} className="mos-pill mb-4 inline-flex rounded-full px-3 py-1 text-xs font-medium">
                {narrative.pill}
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-3xl font-semibold leading-tight sm:text-4xl">
                {narrative.title}
              </motion.h2>
              <motion.p variants={fadeUp} className="mos-muted mt-4 text-lg leading-7">
                {narrative.description}
              </motion.p>
            </motion.div>

            <motion.div
              variants={cardStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="mt-12 grid gap-6 md:grid-cols-3"
            >
              {narrative.items.filter((i) => i.quote && i.author).map((item) => (
                <motion.div key={item.author} variants={cardReveal} className="mos-card p-6 flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Sparkles
                        key={i}
                        className="h-3.5 w-3.5 text-[var(--brand-accent-strong)]"
                        fill="var(--brand-accent-strong)"
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-6 mos-muted flex-1">&ldquo;{item.quote}&rdquo;</p>
                  <div className="mt-4 border-t pt-4 mos-divider">
                    <p className="text-sm font-semibold">{item.author}</p>
                    <p className="mos-subtle text-xs">{item.role}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </ScrollSection>
      )}
    </>
  );
}
