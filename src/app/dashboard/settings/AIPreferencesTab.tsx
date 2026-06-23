"use client";

import { useCallback, useState } from "react";
import { Check, Info, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertBox } from "./common";

const AI_PROVIDERS = [
  { id: "openai", name: "OpenAI", description: "GPT-4o & GPT-4o-mini", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" },
  { id: "anthropic", name: "Anthropic", description: "Claude 3.5 Sonnet & Haiku", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/de/Anthropic_logo.svg" },
  { id: "gemini", name: "Google Gemini", description: "Gemini 1.5 Pro & Flash", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" },
  { id: "openrouter", name: "OpenRouter", description: "Access any open source model", logoUrl: "https://openrouter.ai/favicon.ico" },
];

export function AIPreferencesTab() {
  const [defaultProvider, setDefaultProvider] = useState<string>("openai");
  const [savePreferencesPending, setSavePreferencesPending] = useState(false);
  const [preferenceMessage, setPreferenceMessage] = useState<string | null>(null);
  const [emailDigest, setEmailDigest] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);

  const handleSavePreferences = useCallback(() => {
    setSavePreferencesPending(true);
    setTimeout(() => {
      setSavePreferencesPending(false);
      setPreferenceMessage("Preferences saved successfully!");
      setTimeout(() => setPreferenceMessage(null), 3000);
    }, 600);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Core Engine</CardTitle>
          <CardDescription>
            Select the default Large Language Model provider routing for employee requests.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {preferenceMessage && <AlertBox type="success" message={preferenceMessage} />}

          <div className="grid gap-3 sm:grid-cols-2">
            {AI_PROVIDERS.map((provider) => {
              const isSelected = defaultProvider === provider.id;
              return (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => setDefaultProvider(provider.id)}
                  className={`group relative flex h-28 flex-col items-start justify-between rounded-lg border p-4 text-left transition-all ${
                    isSelected
                      ? "border-[var(--brand-accent)] bg-[rgba(124,156,255,0.05)] shadow-md"
                      : "border-[var(--color-border)] bg-[var(--color-surface-2)]/60 hover:border-[var(--color-border-hover)]"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-sm font-semibold transition-colors group-hover:text-[var(--brand-accent-strong)]">
                      {provider.name}
                    </span>
                    <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded border border-white/10 bg-white/5 p-1">
                      <img
                        src={provider.logoUrl}
                        alt={provider.name}
                        className="h-full w-full object-contain brightness-95"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="mos-muted mt-1.5 text-xs">{provider.description}</p>
                  </div>

                  {isSelected && (
                    <div className="absolute bottom-2 right-2 rounded-full bg-[var(--brand-accent)] p-0.5 text-white">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <p className="mt-2 flex items-start gap-1.5 rounded border bg-[var(--color-surface-2)]/40 p-3 text-xs leading-5 text-[var(--color-text-muted)]">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-accent)]" />
            <span>
              MarketingOS routes complex strategic thinking prompts to the selected engine. Ensure the corresponding
              credentials (e.g. `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`) are set in your environment file.
            </span>
          </p>
        </CardContent>
        <CardFooter className="justify-end border-t border-[var(--color-border)]">
          <Button onClick={handleSavePreferences} disabled={savePreferencesPending}>
            {savePreferencesPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Preferences"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System & Notification Subscriptions</CardTitle>
          <CardDescription>Manage how and when you receive automated summaries and alerts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow
            label="Weekly Brand Brain Digest"
            description="Receive copy reviews and campaign metrics every Monday morning."
            enabled={emailDigest}
            onToggle={() => setEmailDigest((v) => !v)}
          />
          <ToggleRow
            label="Critical Credit Warning"
            description="Alert me when credit quota drops below 10% of monthly allowance."
            enabled={criticalAlerts}
            onToggle={() => setCriticalAlerts((v) => !v)}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)]/20 p-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mos-muted mt-0.5 text-xs">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          enabled ? "bg-[var(--brand-accent)]" : "bg-[var(--color-surface-3)]"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
