"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { ScrollSection } from "../scroll/ScrollSection";
import { fadeUp, cardStagger } from "../motion/presets";
import type { LandingNarrative } from "../brand/brand-context";

interface CTAProps {
  narrative: LandingNarrative["cta"];
}

export function CTASection({ narrative }: CTAProps) {
  return (
    <ScrollSection opacityRange={[0, 0.2, 1, 1]} yRange={[80, 0, 0]}>
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 w-full">
        <motion.div
          variants={cardStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mos-card mx-auto max-w-3xl p-10 text-center sm:p-14"
        >
          <motion.div
            variants={fadeUp}
            className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl mos-icon-tile"
          >
            <Sparkles className="h-7 w-7" />
          </motion.div>

          <motion.h2 variants={fadeUp} className="text-3xl font-semibold leading-tight sm:text-4xl">
            {narrative.title}
          </motion.h2>

          <motion.p variants={fadeUp} className="mos-muted mx-auto mt-4 max-w-lg text-base leading-7">
            {narrative.description}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button size="lg" asChild>
              <Link href="/auth/signup">
                {narrative.buttonText}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard">Explore the product</Link>
            </Button>
          </motion.div>

          {narrative.buttonSubtext && (
            <motion.div
              variants={fadeUp}
              className="mt-6 flex items-center justify-center gap-4 text-sm mos-muted"
            >
              {narrative.buttonSubtext.map((text) => (
                <span key={text} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-positive)]" />
                  {text}
                </span>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </ScrollSection>
  );
}
