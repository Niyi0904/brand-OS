"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

import { useBrandStore } from "@/lib/stores/brand-store";

/**
 * Full-screen loading overlay shown while a brand switch is in-flight.
 * Prevents user interaction and shows the target brand name.
 */
export function BrandSwitchOverlay() {
  const isSwitching = useBrandStore((s) => s.isSwitching);
  const currentBrand = useBrandStore((s) => s.currentBrand);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isSwitching) {
      setVisible(true);
      setReady(false);
      // Small delay so the overlay can animate in before content clears
      const t = setTimeout(() => setReady(true), 80);
      return () => clearTimeout(t);
    }

    if (visible) {
      setReady(false);
      const t = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(t);
    }
  }, [isSwitching, visible]);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-label={`Switching to ${currentBrand?.name ?? "workspace"}`}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center backdrop-blur-sm transition-all duration-200 ${
        ready
          ? "bg-black/40 opacity-100"
          : "bg-black/0 opacity-0"
      }`}
      style={{ pointerEvents: isSwitching ? "auto" : "none" }}
    >
      <div
        className={`flex flex-col items-center gap-6 rounded-2xl px-10 py-12 shadow-2xl transition-all duration-300 ${
          ready
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-4 opacity-0"
        }`}
        style={{
          background: "var(--color-surface-1, #1a1a2e)",
          border: "1px solid var(--color-border, #2a2a4a)",
          minWidth: "280px",
        }}
      >
        {/* Brand avatar placeholder */}
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background: currentBrand?.accentColour
              ? `${currentBrand.accentColour}22`
              : "var(--color-surface-3)",
          }}
        >
          <Sparkles
            className="h-7 w-7"
            style={{
              color: currentBrand?.accentColour ?? "var(--brand-accent)",
            }}
          />
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            Switching workspace
          </p>
          <p className="mt-1 text-lg font-semibold text-[var(--color-text-primary)]">
            {currentBrand?.name ?? "..."}
          </p>
        </div>

        {/* Spinner */}
        <div className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 animate-bounce rounded-full"
            style={{
              backgroundColor: currentBrand?.accentColour ?? "var(--brand-accent)",
              animationDelay: "0ms",
            }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full"
            style={{
              backgroundColor: currentBrand?.accentColour ?? "var(--brand-accent)",
              animationDelay: "150ms",
            }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full"
            style={{
              backgroundColor: currentBrand?.accentColour ?? "var(--brand-accent)",
              animationDelay: "300ms",
            }}
          />
        </div>
      </div>
    </div>
  );
}
