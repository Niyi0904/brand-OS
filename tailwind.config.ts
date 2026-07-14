import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Font Families ───────────────────────────────────────────────────────
      fontFamily: {
        sans:    ["Geist", "system-ui", "-apple-system", "sans-serif"],
        display: ["Instrument Serif", "Georgia", "serif"],
        mono:    ["Geist Mono", "Fira Code", "monospace"],
      },

      // ── Color Palette ────────────────────────────────────────────────────────
      colors: {
        // Radix/Shadcn compat
        border:      "hsl(var(--border-hsl) / <alpha-value>)",
        input:       "hsl(var(--input-hsl) / <alpha-value>)",
        ring:        "hsl(var(--ring))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent-hsl))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // MOS design tokens as Tailwind colors
        mos: {
          bg:          "var(--bg)",
          surface1:    "var(--surface-1)",
          surface2:    "var(--surface-2)",
          surface3:    "var(--surface-3)",
          surface4:    "var(--surface-4)",
          accent:      "var(--accent)",
          "accent-strong": "var(--accent-strong)",
          positive:    "var(--positive)",
          warning:     "var(--warning)",
          danger:      "var(--danger)",
          ai:          "var(--ai-action)",
        },
      },

      // ── Border Radius ────────────────────────────────────────────────────────
      borderRadius: {
        "2xl": "var(--radius-2xl)",
        xl:    "var(--radius-xl)",
        lg:    "var(--radius-lg)",
        md:    "var(--radius-md)",
        sm:    "var(--radius-sm)",
        xs:    "var(--radius-xs)",
      },

      // ── Spacing Extensions ───────────────────────────────────────────────────
      spacing: {
        "4.5": "1.125rem",
        "13":  "3.25rem",
        "15":  "3.75rem",
        "18":  "4.5rem",
        "22":  "5.5rem",
        "26":  "6.5rem",
      },

      // ── Font Sizes ───────────────────────────────────────────────────────────
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
        xs:    ["0.75rem",   { lineHeight: "1.125rem" }],
        sm:    ["0.8125rem", { lineHeight: "1.25rem" }],
        base:  ["0.875rem",  { lineHeight: "1.5rem" }],
        md:    ["0.9375rem", { lineHeight: "1.5rem" }],
        lg:    ["1.0625rem", { lineHeight: "1.625rem" }],
        xl:    ["1.1875rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.375rem",  { lineHeight: "1.875rem" }],
        "3xl": ["1.75rem",   { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem",   { lineHeight: "2.75rem" }],
        "5xl": ["3rem",      { lineHeight: "3.5rem" }],
        "6xl": ["3.75rem",   { lineHeight: "4.25rem" }],
      },

      // ── Letter Spacing ───────────────────────────────────────────────────────
      letterSpacing: {
        tighter: "-0.04em",
        tight:   "-0.02em",
        snug:    "-0.01em",
        normal:  "0em",
        wide:    "0.02em",
        wider:   "0.06em",
        widest:  "0.10em",
      },

      // ── Box Shadows (mapped to CSS vars) ─────────────────────────────────────
      boxShadow: {
        xs:    "var(--shadow-xs)",
        sm:    "var(--shadow-sm)",
        md:    "var(--shadow-md)",
        lg:    "var(--shadow-lg)",
        xl:    "var(--shadow-xl)",
        float: "var(--shadow-float)",
      },

      // ── Keyframes ────────────────────────────────────────────────────────────
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to:   { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to:   { height: "0", opacity: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(3px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          from: { opacity: "1", transform: "translateY(0)" },
          to:   { opacity: "0", transform: "translateY(3px)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96) translateY(-4px)" },
          to:   { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "skeleton-shimmer": {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "ai-pulse": {
          "0%, 80%, 100%": { opacity: "0.25", transform: "scale(0.8)" },
          "40%":           { opacity: "1",    transform: "scale(1)" },
        },
        "chip-enter": {
          from: { transform: "scale(0.82)", opacity: "0" },
          to:   { transform: "scale(1)",    opacity: "1" },
        },
        "chip-exit": {
          from: { transform: "scale(1)",    opacity: "1" },
          to:   { transform: "scale(0.82)", opacity: "0" },
        },
        "spin-smooth": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
      },

      // ── Animation Utilities ──────────────────────────────────────────────────
      animation: {
        "accordion-down":   "accordion-down 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        "accordion-up":     "accordion-up 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        "fade-in":          "fade-in 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-out":         "fade-out 200ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "scale-in":         "scale-in 180ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up":         "slide-up 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-down":       "slide-down 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "skeleton-shimmer": "skeleton-shimmer 1.8s ease-in-out infinite",
        "ai-pulse":         "ai-pulse 1.4s ease-in-out infinite",
        "chip-enter":       "chip-enter 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "chip-exit":        "chip-exit 100ms cubic-bezier(0.45, 0, 0.55, 1) forwards",
        "spin-smooth":      "spin-smooth 1s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
