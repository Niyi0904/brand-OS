"use client";

import { motion } from "framer-motion";
import { Brain, Bot, Zap } from "lucide-react";

import { ScrollSection } from "../scroll/ScrollSection";
import { fadeUp, cardStagger, cardReveal } from "../motion/presets";
import type { LandingNarrative } from "../brand/brand-context";

const stepIcons = [Brain, Bot, Zap];

interface SolutionProps {
  narrative: LandingNarrative["solution"];
}

export function SolutionSection({ narrative }: SolutionProps) {
  return (
    <ScrollSection id="how-it-works">
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

        {narrative.steps && (
          <motion.div
            variants={cardStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-14 grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto"
          >
            {narrative.steps.map((item, i) => {
              const Icon = stepIcons[i] || Zap;
              return (
                <motion.div key={item.step} variants={cardReveal} className="relative">
                  <div className="mos-card p-6">
                    <span className="text-4xl font-bold text-[var(--color-text-tertiary)]">{item.step}</span>
                    <div className="mos-icon-tile mt-4 flex h-11 w-11 items-center justify-center rounded-lg [&_svg]:h-5 [&_svg]:w-5">
                      <Icon />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                    <p className="mos-muted mt-2 text-sm leading-6">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </ScrollSection>
  );
}
