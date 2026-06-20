"use client";

import { Sparkles } from "lucide-react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface-2)]">
        <Sparkles className="h-8 w-8 text-[var(--color-danger)]" />
      </div>
      <h1 className="text-4xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="mos-muted mt-3 max-w-md text-lg">
        An unexpected error occurred. Our team has been notified.
      </p>
      {process.env.NODE_ENV === "development" ? (
        <p className="mt-4 max-w-lg rounded-lg bg-[var(--color-surface-2)] px-4 py-3 text-left text-sm text-[var(--color-text-secondary)]">
          {error.message}
        </p>
      ) : null}
      <button
        onClick={reset}
        className="mos-button-primary mt-8 inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-medium"
      >
        Try again
      </button>
    </div>
  );
}