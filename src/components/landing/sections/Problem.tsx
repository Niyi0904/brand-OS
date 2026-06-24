"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { ScrollSection } from "../scroll/ScrollSection";
import { fadeUp, stagger } from "../motion/presets";
import type { LandingNarrative } from "../brand/brand-context";

interface ProblemProps {
  narrative: LandingNarrative["problem"];
}

export function ProblemSection({ narrative }: ProblemProps) {
  return (
    <ScrollSection>
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 w-full">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={fadeUp} className="mos-pill mb-4 inline-flex rounded-full px-3 py-1 text-xs font-medium">
            {narrative.pill}
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl"
          >
            {narrative.title}
          </motion.h2>

          <motion.p variants={fadeUp} className="mos-muted mt-6 text-lg leading-7 max-w-2xl mx-auto">
            {narrative.description}
          </motion.p>

          {narrative.items && (
            <motion.ul variants={stagger} className="mt-10 space-y-4 text-left max-w-xl mx-auto">
              {narrative.items.map((item) => (
                <motion.li
                  key={item}
                  variants={fadeUp}
                  className="flex items-start gap-3 text-sm"
                >
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-accent)]" />
                  <span className="mos-muted">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </motion.div>
      </div>
    </ScrollSection>
  );
}
