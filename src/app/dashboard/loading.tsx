import { Sparkles } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="mos-card overflow-hidden">
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_260px] lg:p-7">
            <div className="space-y-4">
              <div className="h-5 w-32 animate-pulse rounded bg-[var(--color-surface-3)]" />
              <div className="h-10 w-3/4 animate-pulse rounded bg-[var(--color-surface-3)]" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-[var(--color-surface-3)]" />
            </div>
            <div className="mos-panel p-5">
              <div className="h-4 w-24 animate-pulse rounded bg-[var(--color-surface-3)]" />
              <div className="mt-5 h-12 w-20 animate-pulse rounded bg-[var(--color-surface-3)]" />
              <div className="mt-4 h-2 animate-pulse rounded-full bg-[var(--color-surface-3)]" />
            </div>
          </div>
        </div>
        <div className="mos-card p-6">
          <div className="space-y-4">
            <div className="h-5 w-32 animate-pulse rounded bg-[var(--color-surface-3)]" />
            <div className="h-4 w-48 animate-pulse rounded bg-[var(--color-surface-3)]" />
            <div className="h-16 animate-pulse rounded bg-[var(--color-surface-3)]" />
            <div className="h-16 animate-pulse rounded bg-[var(--color-surface-3)]" />
            <div className="h-16 animate-pulse rounded bg-[var(--color-surface-3)]" />
          </div>
        </div>
      </div>
    </div>
  );
}