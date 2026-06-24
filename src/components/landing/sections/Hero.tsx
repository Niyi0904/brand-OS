"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { fadeUp, fadeIn, scaleIn } from "../motion/presets";
import type { BrandLandingBrain, LandingNarrative } from "../brand/brand-context";

interface HeroProps {
  brand: BrandLandingBrain;
  narrative: LandingNarrative["hero"];
}

export function Hero({ brand, narrative }: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden border-b mos-divider flex items-center">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,156,255,0.15),transparent_50%)]"
          style={{
            backgroundImage: `radial-gradient(ellipse at top right, ${brand.brandColors.primary}26, transparent 50%)`,
          }}
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(124,156,255,0.08),transparent_50%)]"
          style={{
            backgroundImage: `radial-gradient(ellipse at bottom left, ${brand.brandColors.primary}14, transparent 50%)`,
          }}
        />
      </div>

      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt={brand.brandName}
              width={400}
              height={80}
              priority
              className="h-10 w-auto"
            />
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

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-4 pb-16 pt-24 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:pb-20 lg:pt-28 lg:px-8">
        <div className="max-w-2xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mos-pill mb-5 inline-flex rounded-full px-3 py-1 text-xs font-medium"
          >
            {narrative.pill}
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
          >
            {narrative.headline}
            <br />
            <span
              className="text-[var(--brand-accent-strong)]"
              style={{ color: brand.brandColors.secondary }}
            >
              {narrative.headlineAccent}
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mos-muted mt-6 max-w-xl text-base leading-7 sm:text-lg"
          >
            {narrative.subtext}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button size="lg" asChild>
              <Link href="/auth/signup">
                Start your workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard">View product</Link>
            </Button>
          </motion.div>

          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="mt-8 flex items-center gap-4 text-sm mos-muted"
          >
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
          </motion.div>
        </div>

        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="mt-12 lg:mt-0 lg:ml-12 lg:w-[480px] shrink-0"
        >
          <div className="mos-card overflow-hidden">
            <div className="grid grid-cols-[160px_1fr]">
              <div className="border-r p-4 mos-divider">
                <div className="mb-4 h-6 w-20 rounded bg-[var(--color-surface-3)]" />
                <div className="space-y-2">
                  {["Dashboard", "Brands", "AI Employees", "Campaigns", "Analytics"].map((item, i) => (
                    <div
                      key={item}
                      className={
                        i === 1
                          ? "rounded-lg bg-[var(--color-surface-3)] px-3 py-2 text-sm"
                          : "mos-subtle px-3 py-2 text-sm"
                      }
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
                  <div className="h-8 w-24 rounded-md" style={{ backgroundColor: brand.brandColors.primary }} />
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
                      <div
                        className="w-full rounded-t"
                        style={{
                          height: `${h}px`,
                          backgroundColor: brand.brandColors.primary,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
