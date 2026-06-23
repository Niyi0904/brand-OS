"use client";

import { useActionState, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Target } from "lucide-react";
import { Phase2Card } from "@/components/onboarding/Phase2Card";
import { saveCompetitorAction, skipPhase2CardAction, type Phase2ActionState } from "@/app/onboarding/actions";

const initialState: Phase2ActionState = {};

export default function CompetitorPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(saveCompetitorAction, initialState);
  const [competitorName, setCompetitorName] = useState("");
  const [differentiation, setDifferentiation] = useState("");

  const handleSkip = useCallback(async () => {
    const formData = new FormData();
    formData.set("nextStep", "chat");
    formData.set("skippedCard", "competitor");
    await skipPhase2CardAction(formData);
    router.refresh();
  }, [router]);

  return (
    <Phase2Card
      icon={<Target className="h-4 w-4" />}
      heading="Who are they up against?"
      subtext="The AI uses this to position the brand correctly and avoid endorsing competitors by accident."
      isSubmitting={isPending}
      continueFormAction={formAction}
      onSkip={handleSkip}
      skipLabel="Skip Competitor for now"
    >
      <div className="space-y-5">
        <div>
          <label htmlFor="competitorName" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            Main competitor name
          </label>
          <input
            id="competitorName"
            name="competitorName"
            type="text"
            value={competitorName}
            onChange={(e) => setCompetitorName(e.target.value)}
            placeholder="e.g. The Ordinary"
            disabled={isPending}
            className="w-full h-11 px-3 rounded-lg text-sm outline-none border border-[var(--color-border)] focus:border-[var(--brand-accent)] bg-[var(--color-surface-2)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] transition-colors"
            style={{ caretColor: "var(--brand-accent)" }}
          />
        </div>
        <div>
          <label htmlFor="differentiation" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            How is this brand different from them?
          </label>
          <textarea
            id="differentiation"
            name="differentiation"
            value={differentiation}
            onChange={(e) => setDifferentiation(e.target.value)}
            placeholder="e.g. We're more premium, more personal, and we focus exclusively on women over 40. They're mass-market."
            rows={2}
            disabled={isPending}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none border border-[var(--color-border)] focus:border-[var(--brand-accent)] bg-[var(--color-surface-2)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] resize-none transition-colors"
            style={{ caretColor: "var(--brand-accent)" }}
          />
        </div>
      </div>
    </Phase2Card>
  );
}
