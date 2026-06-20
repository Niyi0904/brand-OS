"use client";

import { useRef, useEffect, type TextareaHTMLAttributes } from "react";

interface AutoGrowTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
}

export function AutoGrowTextarea({ minRows = 3, className = "", ...props }: AutoGrowTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, minRows * 20 + 24)}px`;
  };

  useEffect(() => {
    resize();
  }, [props.value]);

  return (
    <textarea
      ref={textareaRef}
      className={`mos-input min-h-[80px] w-full resize-y rounded-md px-3.5 py-3 text-sm leading-relaxed transition-[border-color] duration-150 focus-visible:border-[var(--brand-accent)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)] disabled:cursor-not-allowed disabled:opacity-50 [resize:vertical] ${className}`}
      onInput={resize}
      rows={minRows}
      {...props}
    />
  );
}