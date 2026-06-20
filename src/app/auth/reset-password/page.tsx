import { resetPasswordAction } from "./actions";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const params = await searchParams;
  const token = params.token ?? "";

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
        <div className="w-full max-w-md space-y-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] p-8 text-center">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Invalid reset link</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            This password reset link is invalid or has expired.
          </p>
          <a href="/auth/forgot-password" className="inline-block text-sm text-[var(--brand-accent)] hover:underline">
            Request a new link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] p-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Reset your password</h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Enter your new password below.
          </p>
        </div>

        <form action={resetPasswordAction} className="space-y-4">
          <input type="hidden" name="token" value={token} />

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-primary)]">
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="mt-1 block w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--brand-accent)] focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-text-primary)]">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              className="mt-1 block w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--brand-accent)] focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-[var(--brand-accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Reset password
          </button>
        </form>
      </div>
    </div>
  );
}