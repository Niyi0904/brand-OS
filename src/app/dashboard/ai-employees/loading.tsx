export default function AIEmployeesLoading() {
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
            <div className="h-4 w-24 animate-pulse rounded bg-[var(--color-surface-3)]" />
            <div className="h-4 w-32 animate-pulse rounded bg-[var(--color-surface-3)]" />
            <div className="h-8 w-16 animate-pulse rounded bg-[var(--color-surface-3)]" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="mos-card p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 animate-pulse rounded-lg bg-[var(--color-surface-3)]" />
                <div className="space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-[var(--color-surface-3)]" />
                  <div className="h-3 w-24 animate-pulse rounded bg-[var(--color-surface-3)]" />
                </div>
              </div>
              <div className="h-12 animate-pulse rounded bg-[var(--color-surface-3)]" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-16 animate-pulse rounded bg-[var(--color-surface-3)]" />
                <div className="h-16 animate-pulse rounded bg-[var(--color-surface-3)]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}