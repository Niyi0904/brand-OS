"use client";

import type { ReactNode } from "react";
import { motion, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useScrollProgress } from "./useScrollProgress";

interface ScrollSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div";
  opacityRange?: [number, number, number, number];
  yRange?: [number, number, number];
  scaleRange?: [number, number, number];
}

export function ScrollSection({
  children,
  className,
  id,
  as = "section",
  opacityRange = [0, 0.2, 0.8, 1],
  yRange = [60, 0, -20],
  scaleRange,
}: ScrollSectionProps) {
  const { ref, scrollYProgress } = useScrollProgress();

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], opacityRange);
  const y = useTransform(scrollYProgress, [0, 0.2, 1], yRange);
  const defaultRange: [number, number, number] = [1, 1, 1];
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 1],
    scaleRange ?? defaultRange
  );

  const MotionTag = as === "div" ? motion.div : motion.section;

  return (
    <MotionTag
      ref={ref}
      id={id}
      style={{ opacity, y, scale }}
      className={cn(
        "min-h-screen flex items-center border-b mos-divider",
        className
      )}
    >
      {children}
    </MotionTag>
  );
}

export function PinnedSection({ children }: { children: ReactNode }) {
  return (
    <div className="sticky top-0 h-screen flex items-center overflow-hidden">
      {children}
    </div>
  );
}
