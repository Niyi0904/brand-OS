"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Bot,
  BarChart3,
  Users,
  LineChart,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import { ScrollSection } from "../scroll/ScrollSection";
import { fadeUp, cardStagger, cardReveal } from "../motion/presets";
import type { LandingNarrative } from "../brand/brand-context";

const featureIcons: LucideIcon[] = [
  Brain,
  Bot,
  Workflow,
  BarChart3,
  Users,
  LineChart,
];

interface ProductProps {
  narrative: LandingNarrative["product"];
}

export function ProductSection({ narrative }: ProductProps) {
  return (
    <ScrollSection id="capabilities">
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
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {narrative.features.map((feature, i) => {
            const Icon = featureIcons[i] || Brain;
            return (
              <motion.div
                key={feature.title}
                variants={cardReveal}
                className="mos-card mos-card-hover p-6"
              >
                <div className="mos-icon-tile mb-4 flex h-11 w-11 items-center justify-center rounded-lg [&_svg]:h-5 [&_svg]:w-5">
                  <Icon />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mos-muted mt-2 text-sm leading-6">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </ScrollSection>
  );
}
