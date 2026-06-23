export default function BrandSettingsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 py-8">
      <div className="space-y-2">
        <div className="h-5 w-32 animate-pulse rounded bg-[var(--color-surface-3)]" />
        <div className="h-8 w-56 animate-pulse rounded bg-[var(--color-surface-3)]" />
        <div className="h-4 w-72 animate-pulse rounded bg-[var(--color-surface-3)]" />
      </div>
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="mos-card p-6">
            <div className="space-y-4">
              <div className="h-5 w-40 animate-pulse rounded bg-[var(--color-surface-3)]" />
              <div className="h-4 w-64 animate-pulse rounded bg-[var(--color-surface-3)]" />
              <div className="h-10 w-full animate-pulse rounded bg-[var(--color-surface-3)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
