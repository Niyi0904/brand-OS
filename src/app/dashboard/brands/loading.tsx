export default function BrandsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="h-5 w-32 animate-pulse rounded bg-[var(--color-surface-3)]" />
          <div className="h-8 w-48 animate-pulse rounded bg-[var(--color-surface-3)]" />
          <div className="h-4 w-72 animate-pulse rounded bg-[var(--color-surface-3)]" />
        </div>
        <div className="h-10 w-36 animate-pulse rounded bg-[var(--color-surface-3)]" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="mos-card p-6">
            <div className="space-y-3">
              <div className="h-4 w-24 animate-pulse rounded bg-[var(--color-surface-3)]" />
              <div className="h-4 w-32 animate-pulse rounded bg-[var(--color-surface-3)]" />
              <div className="h-8 w-16 animate-pulse rounded bg-[var(--color-surface-3)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}