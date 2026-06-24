"use client";

import { useRef } from "react";
import { useScroll, useTransform, type MotionValue } from "framer-motion";

export function useScrollProgress(
  options: {
    offset?: [string, string];
    inputRange?: [number, number];
    outputRange?: [number, number];
  } = {}
) {
  const ref = useRef<HTMLDivElement>(null);
  const offset = options.offset ?? ["start end", "end start"];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  const inputRange = options.inputRange ?? [0, 1];
  const outputRange = options.outputRange ?? [0, 1];

  const progress = useTransform(scrollYProgress, inputRange, outputRange);

  return { ref, progress, scrollYProgress };
}

export function usePinnedProgress() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  return { ref, scrollYProgress };
}
