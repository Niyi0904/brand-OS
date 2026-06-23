export default function EmployeeChatLoading() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg)]">
      {/* History panel skeleton */}
      <aside className="hidden w-[260px] flex-col border-r border-[var(--color-border)] bg-[var(--color-surface-1)] md:flex">
        <div className="p-4">
          <div className="h-4 w-20 animate-pulse rounded bg-[var(--color-surface-3)]" />
        </div>
        <div className="flex-1 space-y-2 px-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 rounded-md px-3 py-2">
              <div className="h-6 w-6 animate-pulse rounded-full bg-[var(--color-surface-3)]" />
              <div className="flex-1 space-y-1">
                <div className="h-3 w-3/4 animate-pulse rounded bg-[var(--color-surface-3)]" />
                <div className="h-2 w-1/4 animate-pulse rounded bg-[var(--color-surface-3)]" />
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main content skeleton */}
      <main className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-[var(--color-border)] px-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--color-surface-3)]" />
            <div className="space-y-1">
              <div className="h-4 w-32 animate-pulse rounded bg-[var(--color-surface-3)]" />
              <div className="h-3 w-24 animate-pulse rounded bg-[var(--color-surface-3)]" />
            </div>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-full bg-[var(--color-surface-3)]" />
            <div className="mx-auto mb-2 h-5 w-48 animate-pulse rounded bg-[var(--color-surface-3)]" />
            <div className="mx-auto h-4 w-64 animate-pulse rounded bg-[var(--color-surface-3)]" />
          </div>
        </div>
      </main>
    </div>
  );
}