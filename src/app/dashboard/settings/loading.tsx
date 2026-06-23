export default function SettingsLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="space-y-2">
        <div className="h-5 w-32 animate-pulse rounded bg-[var(--color-surface-3)]" />
        <div className="h-8 w-56 animate-pulse rounded bg-[var(--color-surface-3)]" />
        <div className="h-4 w-96 animate-pulse rounded bg-[var(--color-surface-3)]" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <div className="flex gap-1 lg:flex-col">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-[var(--color-surface-3)]" />
          ))}
        </div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="mos-card p-6">
              <div className="space-y-4">
                <div className="h-5 w-40 animate-pulse rounded bg-[var(--color-surface-3)]" />
                <div className="h-4 w-64 animate-pulse rounded bg-[var(--color-surface-3)]" />
                <div className="h-10 w-full animate-pulse rounded bg-[var(--color-surface-3)]" />
                <div className="h-10 w-full animate-pulse rounded bg-[var(--color-surface-3)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
