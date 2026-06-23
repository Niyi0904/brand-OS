export default function BillingLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="h-6 w-24 animate-pulse rounded bg-[var(--color-surface-3)]" />
        <div className="h-4 w-48 animate-pulse rounded bg-[var(--color-surface-3)]" />
      </div>
      <div className="mos-card p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-5 w-32 animate-pulse rounded bg-[var(--color-surface-3)]" />
              <div className="h-8 w-24 animate-pulse rounded bg-[var(--color-surface-3)]" />
            </div>
            <div className="h-6 w-20 animate-pulse rounded-full bg-[var(--color-surface-3)]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 animate-pulse rounded bg-[var(--color-surface-3)]" />
            <div className="h-12 animate-pulse rounded bg-[var(--color-surface-3)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
