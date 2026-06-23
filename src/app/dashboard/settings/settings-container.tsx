"use client";

import { useState, useActionState, useTransition, useCallback } from "react";
import { 
  User, 
  Lock, 
  Building2, 
  CreditCard, 
  Share2, 
  Cpu, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Mail, 
  Info,
  Loader2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Bot,
  Upload
} from "lucide-react";

import { UploadDropzone } from "@/lib/uploadthing-components";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  updateProfileAction, 
  changePasswordAction, 
  updateOrgAction, 
  type ActionState 
} from "./actions";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface OrgData {
  id: string;
  name: string;
  slug: string;
}

interface MemberData {
  id: string;
  name: string;
  role: string;
  email: string;
  isAI?: boolean;
}

interface SubscriptionData {
  plan: string;
  status: string;
  aiCredits: number;
  aiCreditsUsed: number;
  currentPeriodEnd: string | null;
}

interface SettingsContainerProps {
  user: UserData;
  organization: OrgData | null;
  members: MemberData[];
  subscription: SubscriptionData | null;
}

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
];

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

const AI_PROVIDERS = [
  { id: "openai", name: "OpenAI", description: "GPT-4o & GPT-4o-mini", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" },
  { id: "anthropic", name: "Anthropic", description: "Claude 3.5 Sonnet & Haiku", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/de/Anthropic_logo.svg" },
  { id: "gemini", name: "Google Gemini", description: "Gemini 1.5 Pro & Flash", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" },
  { id: "openrouter", name: "OpenRouter", description: "Access any open source model", logoUrl: "https://openrouter.ai/favicon.ico" },
];

export function SettingsContainer({ user, organization, members, subscription }: SettingsContainerProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "organization" | "billing" | "integrations" | "ai-config">("profile");
  
  // Profile update state
  const [profileState, profileAction, profilePending] = useActionState(updateProfileAction, {});
  const [avatarUrl, setAvatarUrl] = useState(user.image || "");
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Password change state
  const [passwordState, passwordAction, passwordPending] = useActionState(changePasswordAction, {});

  // Org update state
  const [orgState, orgAction, orgPending] = useActionState(updateOrgAction, {});

  // Integrations client connections (mocked)
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>(["slack"]);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  // AI model preferences state (mocked/local storage)
  const [defaultProvider, setDefaultProvider] = useState<string>("openai");
  const [savePreferencesPending, setSavePreferencesPending] = useState(false);
  const [preferenceMessage, setPreferenceMessage] = useState<string | null>(null);
  const [emailDigest, setEmailDigest] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);

  // Stripe Portal redirection loader
  const [stripePortalPending, setStripePortalPending] = useState(false);

  const handleToggleIntegration = (id: string) => {
    setConnectingId(id);
    setTimeout(() => {
      setConnectedIntegrations(prev => 
        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
      );
      setConnectingId(null);
    }, 800);
  };

  const handleSavePreferences = () => {
    setSavePreferencesPending(true);
    setTimeout(() => {
      setSavePreferencesPending(false);
      setPreferenceMessage("Preferences saved successfully!");
      setTimeout(() => setPreferenceMessage(null), 3000);
    }, 600);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <div className="mos-pill mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium">
          Settings Console
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">System & Account Settings</h1>
        <p className="mos-muted mt-2 text-sm max-w-2xl leading-6">
          Manage your personal account credentials, configure team parameters, inspect subscription usage, and tweak AI provider settings.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Navigation Sidebar */}
        <aside className="flex flex-row overflow-x-auto gap-1 border-b pb-4 lg:border-b-0 lg:pb-0 lg:flex-col lg:gap-2">
          <TabButton 
            active={activeTab === "profile"} 
            onClick={() => setActiveTab("profile")} 
            icon={<User />} 
            label="Profile & Security" 
          />
          <TabButton 
            active={activeTab === "organization"} 
            onClick={() => setActiveTab("organization")} 
            icon={<Building2 />} 
            label="Organization" 
          />
          <TabButton 
            active={activeTab === "billing"} 
            onClick={() => setActiveTab("billing")} 
            icon={<CreditCard />} 
            label="Billing & Credits" 
          />
          <TabButton 
            active={activeTab === "integrations"} 
            onClick={() => setActiveTab("integrations")} 
            icon={<Share2 />} 
            label="Integrations" 
          />
          <TabButton 
            active={activeTab === "ai-config"} 
            onClick={() => setActiveTab("ai-config")} 
            icon={<Cpu />} 
            label="AI Preferences" 
          />
        </aside>

        {/* Content Panel */}
        <main className="space-y-6">
          {/* PROFILE & SECURITY TAB */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Profile Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>Update your personal information and profile picture.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form action={profileAction} className="space-y-5">
                    {profileState?.message && (
                      <AlertBox type={profileState.success ? "success" : "error"} message={profileState.message} />
                    )}

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface-3)]">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xl font-bold text-[var(--color-text-secondary)]">
                            {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Profile Photo</Label>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {AVATAR_PRESETS.map((url, i) => (
                              <button
                                key={url}
                                type="button"
                                onClick={() => setAvatarUrl(url)}
                                className={`h-9 w-9 overflow-hidden rounded-full border-2 transition-all ${
                                  avatarUrl === url ? "border-[var(--brand-accent)] scale-105" : "border-transparent opacity-70 hover:opacity-100"
                                }`}
                              >
                                <img src={url} alt={`Preset ${i}`} className="h-full w-full object-cover" />
                              </button>
                            ))}
                          </div>
                          <div className="pt-1">
                            <div className="flex items-center gap-3 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)]/40 p-3">
                              <Upload className="h-5 w-5 text-[var(--color-text-tertiary)] shrink-0" />
                              <div className="flex-1 min-w-0">
                                <UploadDropzone
                                  endpoint="avatar"
                                  onClientUploadComplete={(res) => {
                                    if (res?.[0]?.url) {
                                      setAvatarUrl(res[0].url);
                                      document.getElementById("avatar-input")?.setAttribute("value", res[0].url);
                                      setAvatarUploadError(null);
                                      setAvatarUploading(false);
                                    }
                                  }}
                                  onUploadError={(error: Error) => {
                                    setAvatarUploadError(error.message || "Upload failed");
                                    setAvatarUploading(false);
                                  }}
                                  onUploadBegin={() => {
                                    setAvatarUploading(true);
                                    setAvatarUploadError(null);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

<input type="hidden" name="image" value={avatarUrl} id="avatar-input" />
                     {avatarUploadError && (
                       <div className="lg:col-span-2 rounded-md bg-red-500/10 px-4 py-3 text-sm text-red-400">
                         Upload failed: {avatarUploadError}. Please ensure UploadThing credentials are configured.
                       </div>
                     )}
                     {avatarUploading && (
                       <div className="lg:col-span-2 rounded-md bg-[var(--color-surface-2)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                         Uploading image...
                       </div>
                     )}

                     <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          defaultValue={user.name || ""} 
                          placeholder="Your full name" 
                          className="mos-input"
                        />
                        {profileState?.errors?.name?.[0] && (
                          <p className="text-xs text-red-400">{profileState.errors.name[0]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Input 
                            id="email" 
                            type="email" 
                            value={user.email} 
                            disabled 
                            className="mos-input pl-9 opacity-60 cursor-not-allowed"
                          />
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-[var(--color-text-tertiary)]" />
                        </div>
                        <p className="mos-subtle text-[11px]">Primary email used for account authentication cannot be changed.</p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2 border-t mos-divider">
                      <Button type="submit" disabled={profilePending}>
                        {profilePending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                          </>
                        ) : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Security Credentials Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Update Password</CardTitle>
                  <CardDescription>Verify your current credentials before setting a new secure password.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form action={passwordAction} className="space-y-4">
                    {passwordState?.message && (
                      <AlertBox type={passwordState.success ? "success" : "error"} message={passwordState.message} />
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input 
                          id="currentPassword" 
                          name="currentPassword" 
                          type="password" 
                          placeholder="••••••••" 
                          className="mos-input pl-9"
                        />
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-[var(--color-text-tertiary)]" />
                      </div>
                      {passwordState?.errors?.currentPassword?.[0] && (
                        <p className="text-xs text-red-400">{passwordState.errors.currentPassword[0]}</p>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input 
                          id="newPassword" 
                          name="newPassword" 
                          type="password" 
                          placeholder="Min. 8 characters" 
                          className="mos-input"
                        />
                        {passwordState?.errors?.newPassword?.[0] && (
                          <p className="text-xs text-red-400">{passwordState.errors.newPassword[0]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input 
                          id="confirmPassword" 
                          name="confirmPassword" 
                          type="password" 
                          placeholder="Re-enter password" 
                          className="mos-input"
                        />
                        {passwordState?.errors?.confirmPassword?.[0] && (
                          <p className="text-xs text-red-400">{passwordState.errors.confirmPassword[0]}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-2 border-t mos-divider">
                      <Button type="submit" disabled={passwordPending}>
                        {passwordPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Updating...
                          </>
                        ) : "Update Password"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ORGANIZATION TAB */}
          {activeTab === "organization" && (
            <div className="space-y-6">
              {organization ? (
                <>
                  {/* Organization Info Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Workspace Settings</CardTitle>
                      <CardDescription>Modify your organization metadata and routing configurations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form action={orgAction} className="space-y-4">
                        {orgState?.message && (
                          <AlertBox type={orgState.success ? "success" : "error"} message={orgState.message} />
                        )}

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="orgName">Organization Name</Label>
                            <Input 
                              id="orgName" 
                              name="name" 
                              defaultValue={organization.name} 
                              placeholder="Acme Marketing" 
                              className="mos-input"
                            />
                            {orgState?.errors?.name?.[0] && (
                              <p className="text-xs text-red-400">{orgState.errors.name[0]}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="orgSlug">Workspace Slug</Label>
                            <div className="flex items-center">
                              <span className="mos-subtle flex h-10 items-center rounded-l-md border border-r-0 border-[var(--color-border)] bg-[var(--color-surface-3)] px-3 text-xs">
                                /org/
                              </span>
                              <Input 
                                id="orgSlug" 
                                name="slug" 
                                defaultValue={organization.slug} 
                                placeholder="acme" 
                                className="mos-input rounded-l-none"
                              />
                            </div>
                            {orgState?.errors?.slug?.[0] && (
                              <p className="text-xs text-red-400">{orgState.errors.slug[0]}</p>
                            )}
                            <p className="mos-subtle text-[11px]">Used in custom subdomains, API triggers, and URLs.</p>
                          </div>
                        </div>

                        <div className="flex justify-end pt-2 border-t mos-divider">
                          <Button type="submit" disabled={orgPending}>
                            {orgPending ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                              </>
                            ) : "Save Org Details"}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Team Members Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Workspace Core Directory</span>
                        <span className="mos-pill text-xs px-2.5 py-0.5 rounded-full">
                          {members.length} Members Active
                        </span>
                      </CardTitle>
                      <CardDescription>
                        Core members of this brand workspace, including human operators and active AI Employees.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-[var(--color-border)] mos-divider">
                        {members.map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-4 px-6 hover:bg-[var(--color-surface-2)]/40 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                                member.isAI 
                                  ? "bg-[rgba(124,156,255,0.1)] border-[rgba(124,156,255,0.2)] text-[var(--brand-accent-strong)]" 
                                  : "bg-[var(--color-surface-3)] text-[var(--color-text-secondary)]"
                              }`}>
                                {member.isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                              </div>
                              <div>
                                <p className="text-sm font-medium flex items-center gap-2">
                                  {member.name}
                                  {member.isAI && (
                                    <span className="mos-pill text-[10px] px-1.5 py-0.2 rounded font-semibold tracking-wide">
                                      AI
                                    </span>
                                  )}
                                </p>
                                <p className="mos-subtle text-xs">{member.email}</p>
                              </div>
                            </div>

                            <span className={`text-xs px-2 py-0.5 rounded border font-medium uppercase tracking-wider ${
                              member.role === "OWNER" 
                                ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                : member.role === "AI_EMPLOYEE" 
                                  ? "bg-[var(--brand-accent)/10] text-[var(--brand-accent-strong)] border-[var(--brand-accent)/20]" 
                                  : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            }`}>
                              {member.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                    <Building2 className="h-10 w-10 text-[var(--color-text-tertiary)] mb-4" />
                    <h3 className="text-lg font-semibold">No Organization Active</h3>
                    <p className="mos-muted text-sm mt-1 max-w-sm">
                      An organization has not been correctly initialized for your user account. Please contact support.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* BILLING TAB */}
          {activeTab === "billing" && (
            <div className="space-y-6">
              {subscription ? (
                <>
                  {/* Current Status Card */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Plan Tier</CardTitle>
                        <CardDescription>Status and credit usage for this organization.</CardDescription>
                      </div>
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                        subscription.status === "ACTIVE" 
                          ? "bg-green-500/10 text-green-400 border-green-500/20" 
                          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }`}>
                        {subscription.status}
                      </span>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="mos-subtle text-xs uppercase tracking-wider">Plan Name</p>
                          <h4 className="text-3xl font-extrabold text-[var(--brand-accent-strong)] mt-1">{subscription.plan}</h4>
                        </div>
                        {subscription.currentPeriodEnd && (
                          <div className="text-sm">
                            <span className="mos-muted block sm:text-right">Renews On</span>
                            <span className="font-semibold block sm:text-right mt-0.5">
                              {new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* AI Credit Usage Bar */}
                      <div className="space-y-2 border-t pt-4 mos-divider">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-[var(--color-text-secondary)]">AI Credit Allotment</span>
                          <span className="font-semibold">
                            {subscription.aiCreditsUsed.toLocaleString()} / {subscription.aiCredits.toLocaleString()} used
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="h-2 w-full rounded-full bg-[var(--color-surface-3)] overflow-hidden border border-[var(--color-border)]">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-[var(--brand-accent)] to-[#4d72fc] transition-all duration-500" 
                            style={{ 
                              width: `${Math.min(100, Math.max(0, (subscription.aiCreditsUsed / subscription.aiCredits) * 100))}%` 
                            }} 
                          />
                        </div>
                        <p className="mos-subtle text-xs">Credits recharge on your billing renewal date. 1 credit equals 1 generated asset or AI chat message.</p>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t mos-divider bg-[var(--color-surface-2)]/20 justify-between py-4 flex flex-col sm:flex-row gap-3">
                      <p className="mos-muted text-xs flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-[var(--color-positive)]" /> Secure Stripe checkout & billing portal.
                      </p>
                      <form action="/api/stripe/create-checkout" method="POST">
                        <Button 
                          type="submit" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setStripePortalPending(true)}
                          disabled={stripePortalPending}
                        >
                          {stripePortalPending ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" /> Accessing...
                            </>
                          ) : (
                            <>
                              Manage Subscription <ExternalLink className="h-3 w-3" />
                            </>
                          )}
                        </Button>
                      </form>
                    </CardFooter>
                  </Card>

                  {/* Pricing Tiers if Free */}
                  {subscription.plan === "FREE" && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Professional Upgrade Options</CardTitle>
                        <CardDescription>Upgrade to unlock higher credit thresholds and more AI Employees.</CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4 sm:grid-cols-2">
                        {/* Pro Plan Card */}
                        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5 space-y-4 flex flex-col justify-between">
                          <div>
                            <span className="mos-pill text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">RECOMMENDED</span>
                            <h4 className="text-lg font-bold mt-2">MarketingOS PRO</h4>
                            <p className="text-3xl font-extrabold mt-1">$29<span className="text-sm font-normal text-[var(--color-text-secondary)]">/mo</span></p>
                            <p className="mos-muted text-xs mt-2 leading-5">For startup founders, boutique marketing agencies, and scaling brands.</p>
                            
                            <ul className="text-xs space-y-2 mt-4">
                              <li className="flex items-center gap-2">
                                <Check className="h-3.5 w-3.5 text-[var(--color-positive)]" /> 200,000 AI Credits/mo
                              </li>
                              <li className="flex items-center gap-2">
                                <Check className="h-3.5 w-3.5 text-[var(--color-positive)]" /> Unlimited Brand Brains
                              </li>
                              <li className="flex items-center gap-2">
                                <Check className="h-3.5 w-3.5 text-[var(--color-positive)]" /> Custom AI Employee generation
                              </li>
                              <li className="flex items-center gap-2">
                                <Check className="h-3.5 w-3.5 text-[var(--color-positive)]" /> Direct platform scheduling (Slack, X)
                              </li>
                            </ul>
                          </div>

                          <form action="/api/stripe/create-checkout" method="POST">
                            <input type="hidden" name="priceId" value={process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || "pro_plan"} />
                            <Button type="submit" className="w-full mt-2">Upgrade to Pro</Button>
                          </form>
                        </div>

                        {/* Enterprise Plan Card */}
                        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5 space-y-4 flex flex-col justify-between">
                          <div>
                            <span className="text-[var(--color-text-tertiary)] text-[10px] px-2 py-0.5 border rounded font-bold uppercase tracking-wider">SCALE</span>
                            <h4 className="text-lg font-bold mt-2">MarketingOS Enterprise</h4>
                            <p className="text-3xl font-extrabold mt-1">$99<span className="text-sm font-normal text-[var(--color-text-secondary)]">/mo</span></p>
                            <p className="mos-muted text-xs mt-2 leading-5">For multi-brand organizations, corporate agencies, and high volume teams.</p>
                            
                            <ul className="text-xs space-y-2 mt-4">
                              <li className="flex items-center gap-2">
                                <Check className="h-3.5 w-3.5 text-[var(--color-positive)]" /> 1,000,000 AI Credits/mo
                              </li>
                              <li className="flex items-center gap-2">
                                <Check className="h-3.5 w-3.5 text-[var(--color-positive)]" /> Dedicated custom-trained models
                              </li>
                              <li className="flex items-center gap-2">
                                <Check className="h-3.5 w-3.5 text-[var(--color-positive)]" /> Premium API access integrations
                              </li>
                              <li className="flex items-center gap-2">
                                <Check className="h-3.5 w-3.5 text-[var(--color-positive)]" /> 24/7 dedicated support representative
                              </li>
                            </ul>
                          </div>

                          <form action="/api/stripe/create-checkout" method="POST">
                            <input type="hidden" name="priceId" value={process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE || "enterprise_plan"} />
                            <Button type="submit" variant="secondary" className="w-full mt-2">Contact Enterprise</Button>
                          </form>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Inactive</CardTitle>
                    <CardDescription>Could not retrieve subscription settings.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-6">
                    <AlertCircle className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-sm text-[var(--color-text-secondary)]">Please ensure Stripe environment credentials are set up.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* INTEGRATIONS TAB */}
          {activeTab === "integrations" && (
            <Card>
              <CardHeader>
                <CardTitle>Connected Platforms</CardTitle>
                <CardDescription>Synchronize campaign intelligence and automation channels with external services.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {INTEGRATIONS_LIST.map((integration) => {
                    const isConnected = connectedIntegrations.includes(integration.id);
                    const isConnecting = connectingId === integration.id;

                    return (
                      <div 
                        key={integration.id} 
                        className={`rounded-lg border p-4 transition-all flex flex-col justify-between ${
                          isConnected 
                            ? "border-[var(--brand-accent)]/30 bg-[rgba(124,156,255,0.02)]" 
                            : "border-[var(--color-border)] bg-[var(--color-surface-2)]/60"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10 p-2">
                              <img src={integration.icon} alt={integration.name} className="h-full w-full object-contain" />
                            </div>
                            <span className="text-[10px] text-[var(--color-text-tertiary)] uppercase font-semibold tracking-wider">
                              {integration.category}
                            </span>
                          </div>
                          
                          <h4 className="font-semibold text-sm text-[var(--color-text-primary)] flex items-center gap-1.5">
                            {integration.name}
                            {isConnected && (
                              <CheckCircle2 className="h-4 w-4 text-[var(--color-positive)] shrink-0" />
                            )}
                          </h4>
                          <p className="mos-muted text-xs mt-1.5 leading-5">{integration.description}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                          <span className={`text-[10px] font-medium ${isConnected ? "text-[var(--color-positive)]" : "text-[var(--color-text-tertiary)]"}`}>
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
          )}

          {/* AI PREFERENCES TAB */}
          {activeTab === "ai-config" && (
            <div className="space-y-6">
              {/* Default LLM Selector */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Core Engine</CardTitle>
                  <CardDescription>Select the default Large Language Model provider routing for employee requests.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {preferenceMessage && (
                    <AlertBox type="success" message={preferenceMessage} />
                  )}

                  <div className="grid gap-3 sm:grid-cols-2">
                    {AI_PROVIDERS.map((provider) => {
                      const isSelected = defaultProvider === provider.id;
                      return (
                        <button
                          key={provider.id}
                          type="button"
                          onClick={() => setDefaultProvider(provider.id)}
                          className={`group text-left rounded-lg border p-4 transition-all flex flex-col justify-between items-start h-28 relative ${
                            isSelected 
                              ? "border-[var(--brand-accent)] bg-[rgba(124,156,255,0.05)] shadow-md" 
                              : "border-[var(--color-border)] bg-[var(--color-surface-2)]/60 hover:border-[var(--color-border-hover)]"
                          }`}
                        >
                          <div className="w-full flex items-center justify-between">
                            <span className="font-semibold text-sm group-hover:text-[var(--brand-accent-strong)] transition-colors">
                              {provider.name}
                            </span>
                            <div className="h-6 w-6 overflow-hidden rounded bg-white/5 p-1 flex items-center justify-center border border-white/10">
                              <img src={provider.logoUrl} alt={provider.name} className="h-full w-full object-contain filter brightness-95" />
                            </div>
                          </div>

                          <div>
                            <p className="mos-muted text-xs mt-1.5">{provider.description}</p>
                          </div>

                          {isSelected && (
                            <div className="absolute right-2 bottom-2 rounded-full bg-[var(--brand-accent)] text-white p-0.5">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <p className="mos-muted text-xs leading-5 flex items-start gap-1.5 mt-2 bg-[var(--color-surface-2)]/40 p-3 rounded border">
                    <Info className="h-4 w-4 text-[var(--brand-accent)] shrink-0 mt-0.5" />
                    <span>
                      MarketingOS routes complex strategic thinking prompts to the selected engine. Ensure the corresponding 
                      credentials (e.g. `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`) are set in your environment file.
                    </span>
                  </p>
                </CardContent>
                <CardFooter className="justify-end border-t mos-divider">
                  <Button onClick={handleSavePreferences} disabled={savePreferencesPending}>
                    {savePreferencesPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : "Save Preferences"}
                  </Button>
                </CardFooter>
              </Card>

              {/* Notification Toggles */}
              <Card>
                <CardHeader>
                  <CardTitle>System & Notification Subscriptions</CardTitle>
                  <CardDescription>Manage how and when you receive automated summaries and alerts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Digest Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)]/20">
                    <div>
                      <p className="text-sm font-medium">Weekly Brand Brain Digest</p>
                      <p className="mos-muted text-xs mt-0.5">Receive copy reviews and campaign metrics every Monday morning.</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setEmailDigest(!emailDigest)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        emailDigest ? "bg-[var(--brand-accent)]" : "bg-[var(--color-surface-3)]"
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        emailDigest ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                  </div>

                  {/* Critical Alerts Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)]/20">
                    <div>
                      <p className="text-sm font-medium">Critical Credit Warning</p>
                      <p className="mos-muted text-xs mt-0.5">Alert me when credit quota drops below 10% of monthly allowance.</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setCriticalAlerts(!criticalAlerts)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        criticalAlerts ? "bg-[var(--brand-accent)]" : "bg-[var(--color-surface-3)]"
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        criticalAlerts ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* Local UI Helper Components */

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors shrink-0 whitespace-nowrap lg:w-full ${
        active 
          ? "bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border)]" 
          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]/40"
      }`}
    >
      <span className={`flex h-4 w-4 items-center justify-center [&_svg]:h-4 [&_svg]:w-4 transition-colors ${
        active ? "text-[var(--brand-accent)]" : "text-[var(--color-text-tertiary)]"
      }`}>
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

function AlertBox({ type, message }: { type: "success" | "error"; message: string }) {
  const isSuccess = type === "success";
  return (
    <div className={`flex items-start gap-3 rounded-md px-4 py-3 text-sm ${
      isSuccess 
        ? "bg-green-500/10 text-green-400 border border-green-500/20" 
        : "bg-red-500/10 text-red-400 border border-red-500/20"
    }`}>
      {isSuccess ? (
        <Check className="h-4 w-4 shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
      )}
      <span>{message}</span>
    </div>
  );
}
