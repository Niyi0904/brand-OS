"use client";

import { useActionState, useState, useCallback } from "react";
import { Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import { Phase2Card } from "@/components/onboarding/Phase2Card";
import { saveVoiceToneAction, skipPhase2CardAction, type Phase2ActionState } from "@/app/onboarding/actions";
import { TagInput } from "@/components/ui/tag-input";

const initialState: Phase2ActionState = {};

export default function VoicePage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(saveVoiceToneAction, initialState);
  const [voiceAdjectives, setVoiceAdjectives] = useState<string[]>([]);
  const [thingsToAvoid, setThingsToAvoid] = useState("");

  const handleSkip = useCallback(async () => {
    const formData = new FormData();
    formData.set("nextStep", "audience");
    formData.set("skippedCard", "voice-tone");
    await skipPhase2CardAction(formData);
    router.refresh();
  }, [router]);

  return (
    <Phase2Card
      icon={<Mic className="h-4 w-4" />}
      heading="How does this brand like to sound?"
      subtext="The AI reads this before writing anything for this brand. Even a few words make a big difference."
      isSubmitting={isPending}
      continueFormAction={formAction}
      onSkip={handleSkip}
      skipLabel="Skip Voice & Tone for now"
    >
      <div className="space-y-5">
        <div>
          <label htmlFor="voiceAdjectives" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            Describe the voice in a few words
          </label>
          <input
            name="voiceAdjectives"
            type="hidden"
            value={JSON.stringify(voiceAdjectives)}
          />
          <TagInput
            tags={voiceAdjectives}
            onChange={setVoiceAdjectives}
            placeholder="e.g. Warm, direct, a little irreverent — never corporate"
            maxTags={6}
            disabled={isPending}
          />
        </div>
        <div>
          <label htmlFor="thingsToAvoid" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            Anything the brand should never sound like?
          </label>
          <textarea
            id="thingsToAvoid"
            name="thingsToAvoid"
            value={thingsToAvoid}
            onChange={(e) => setThingsToAvoid(e.target.value)}
            placeholder="e.g. Don't use jargon. Never preachy. Avoid corporate speak."
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
