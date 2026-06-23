"use client";

import { useState } from "react";
import { Building2, CreditCard, Cpu, Share2, User } from "lucide-react";

import { AIPreferencesTab } from "./AIPreferencesTab";
import { BillingTab } from "./BillingTab";
import { IntegrationsTab } from "./IntegrationsTab";
import { OrganizationTab } from "./OrganizationTab";
import { ProfileTab } from "./ProfileTab";
import { type MemberData, type OrgData, type SettingsTab, type SubscriptionData, type UserData, TabButton } from "./common";

interface SettingsContainerProps {
  user: UserData;
  organization: OrgData | null;
  members: MemberData[];
  subscription: SubscriptionData | null;
}

const TABS: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { key: "profile", label: "Profile & Security", icon: <User /> },
  { key: "organization", label: "Organization", icon: <Building2 /> },
  { key: "billing", label: "Billing & Credits", icon: <CreditCard /> },
  { key: "integrations", label: "Integrations", icon: <Share2 /> },
  { key: "ai-config", label: "AI Preferences", icon: <Cpu /> },
];

export function SettingsContainer({ user, organization, members, subscription }: SettingsContainerProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <div className="mos-pill mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium">Settings Console</div>
        <h1 className="text-3xl font-semibold tracking-tight">System & Account Settings</h1>
        <p className="mos-muted mt-2 max-w-2xl text-sm leading-6">
          Manage your personal account credentials, configure team parameters, inspect subscription usage, and tweak AI
          provider settings.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="flex flex-row gap-1 overflow-x-auto border-b pb-4 lg:flex-col lg:border-b-0 lg:pb-0 lg:gap-2">
          {TABS.map((tab) => (
            <TabButton
              key={tab.key}
              active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              icon={tab.icon}
              label={tab.label}
            />
          ))}
        </aside>

        <main className="space-y-6">
          {activeTab === "profile" && <ProfileTab user={user} />}
          {activeTab === "organization" && <OrganizationTab organization={organization} members={members} />}
          {activeTab === "billing" && <BillingTab subscription={subscription} />}
          {activeTab === "integrations" && <IntegrationsTab />}
          {activeTab === "ai-config" && <AIPreferencesTab />}
        </main>
      </div>
    </div>
  );
}
