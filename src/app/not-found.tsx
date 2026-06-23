import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface-2)]">
        <Sparkles className="h-8 w-8 text-[var(--color-text-tertiary)]" />
      </div>
      <h1 className="text-5xl font-semibold tracking-tight">404</h1>
      <p className="mos-muted mt-3 text-lg">This page could not be found in your workspace.</p>
      <Button asChild className="mt-8">
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
