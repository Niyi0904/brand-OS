import { forgotPasswordAction } from "./actions";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] p-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Forgot password?</h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Enter your email and we{'\''}ll send you a reset link.
          </p>
        </div>

        <form action={forgotPasswordAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-primary)]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--brand-accent)] focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-[var(--brand-accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Send reset link
          </button>
        </form>

        <p className="text-center text-sm text-[var(--color-text-secondary)]">
          Remember your password?{" "}
          <a href="/auth/signin" className="text-[var(--brand-accent)] hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}