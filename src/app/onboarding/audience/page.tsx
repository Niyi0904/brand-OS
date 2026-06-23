"use client";

import { useActionState, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { Phase2Card } from "@/components/onboarding/Phase2Card";
import { saveTargetAudienceAction, skipPhase2CardAction, type Phase2ActionState } from "@/app/onboarding/actions";

const initialState: Phase2ActionState = {};

export default function AudiencePage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(saveTargetAudienceAction, initialState);
  const [targetAudience, setTargetAudience] = useState("");

  const handleSkip = useCallback(async () => {
    const formData = new FormData();
    formData.set("nextStep", "products");
    formData.set("skippedCard", "target-audience");
    await skipPhase2CardAction(formData);
    router.refresh();
  }, [router]);

  return (
    <Phase2Card
      icon={<Users className="h-4 w-4" />}
      heading="Who are you writing for?"
      subtext="Describe them like you'd describe them to a new team member joining the account."
      isSubmitting={isPending}
      continueFormAction={formAction}
      onSkip={handleSkip}
      skipLabel="Skip Target Audience for now"
    >
      <div>
        <label htmlFor="targetAudience" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
          Describe the target audience
        </label>
        <textarea
          id="targetAudience"
          name="targetAudience"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          placeholder="e.g. Female founders, 28–42, UK-based, running product businesses with 1–10 employees. They're time-poor and value clarity over creativity."
          rows={3}
          disabled={isPending}
          className="w-full px-3 py-2.5 rounded-lg text-sm outline-none border border-[var(--color-border)] focus:border-[var(--brand-accent)] bg-[var(--color-surface-2)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] resize-none transition-colors"
          style={{ caretColor: "var(--brand-accent)" }}
        />
      </div>
    </Phase2Card>
  );
}
