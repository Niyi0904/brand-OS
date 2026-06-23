"use client";

import { useCallback, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const INTEGRATIONS_LIST = [
  {
    id: "slack",
    name: "Slack",
    description: "Receive AI Employee campaign drafts and notifications inside Slack channels.",
    category: "Communication",
    icon: "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Sync product plans and campaign revenue signals directly from your Stripe store.",
    category: "Finance",
    icon: "https://cdn.worldvectorlogo.com/logos/stripe-2.svg",
  },
  {
    id: "twitter",
    name: "X / Twitter",
    description: "Automate social campaigns, monitor brand mentions, and schedule threads.",
    category: "Social Media",
    icon: "https://cdn.worldvectorlogo.com/logos/twitter-6.svg",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Publish executive thoughts and corporate updates through AI agents.",
    category: "Social Media",
    icon: "https://cdn.worldvectorlogo.com/logos/linkedin-icon-2.svg",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Export lead magnets and copy drafts straight into HubSpot CRM.",
    category: "Marketing",
    icon: "https://cdn.worldvectorlogo.com/logos/hubspot.svg",
  },
];

export function IntegrationsTab() {
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>(["slack"]);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const handleToggleIntegration = useCallback((id: string) => {
    setConnectingId(id);
    setTimeout(() => {
      setConnectedIntegrations((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
      setConnectingId(null);
    }, 800);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Platforms</CardTitle>
        <CardDescription>
          Synchronize campaign intelligence and automation channels with external services.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {INTEGRATIONS_LIST.map((integration) => {
            const isConnected = connectedIntegrations.includes(integration.id);
            const isConnecting = connectingId === integration.id;

            return (
              <div
                key={integration.id}
                className={`flex flex-col justify-between rounded-lg border p-4 transition-all ${
                  isConnected
                    ? "border-[var(--brand-accent)]/30 bg-[rgba(124,156,255,0.02)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface-2)]/60"
                }`}
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 p-2">
                      <img src={integration.icon} alt={integration.name} className="h-full w-full object-contain" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      {integration.category}
                    </span>
                  </div>

                  <h4 className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-primary)]">
                    {integration.name}
                    {isConnected && <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--color-positive)]" />}
                  </h4>
                  <p className="mos-muted mt-1.5 text-xs leading-5">{integration.description}</p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-3">
                  <span
                    className={`text-[10px] font-medium ${isConnected ? "text-[var(--color-positive)]" : "text-[var(--color-text-tertiary)]"}`}
                  >
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                  <Button
                    variant={isConnected ? "outline" : "default"}
                    size="sm"
                    className="h-8 px-3 text-xs"
                    onClick={() => handleToggleIntegration(integration.id)}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : isConnected ? (
                      "Disconnect"
                    ) : (
                      "Connect"
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
