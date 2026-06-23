"use client";

import { useActionState } from "react";
import { Bot, Building2, Loader2, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ActionState, updateOrgAction } from "./actions";
import { AlertBox, type MemberData, type OrgData } from "./common";

interface OrganizationTabProps {
  organization: OrgData | null;
  members: MemberData[];
}

export function OrganizationTab({ organization, members }: OrganizationTabProps) {
  const [orgState, orgAction, orgPending] = useActionState(updateOrgAction, {} as ActionState);

  if (!organization) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Building2 className="mb-4 h-10 w-10 text-[var(--color-text-tertiary)]" />
          <h3 className="text-lg font-semibold">No Organization Active</h3>
          <p className="mos-muted mt-1 max-w-sm text-sm">
            An organization has not been correctly initialized for your user account. Please contact support.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workspace Settings</CardTitle>
          <CardDescription>Modify your organization metadata and routing configurations.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={orgAction} className="space-y-4">
            {orgState?.message && <AlertBox type={orgState.success ? "success" : "error"} message={orgState.message} />}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input id="orgName" name="name" defaultValue={organization.name} placeholder="Acme Marketing" />
                {orgState?.errors?.name?.[0] && <p className="text-xs text-red-400">{orgState.errors.name[0]}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgSlug">Workspace Slug</Label>
                <div className="flex items-center">
                  <span className="flex h-10 items-center rounded-l-md border border-r-0 border-[var(--color-border)] bg-[var(--color-surface-3)] px-3 text-xs text-[var(--color-text-tertiary)]">
                    /org/
                  </span>
                  <Input
                    id="orgSlug"
                    name="slug"
                    defaultValue={organization.slug}
                    placeholder="acme"
                    className="rounded-l-none"
                  />
                </div>
                {orgState?.errors?.slug?.[0] && <p className="text-xs text-red-400">{orgState.errors.slug[0]}</p>}
                <p className="text-[11px] text-[var(--color-text-tertiary)]">
                  Used in custom subdomains, API triggers, and URLs.
                </p>
              </div>
            </div>

            <div className="flex justify-end border-t border-[var(--color-border)] pt-2">
              <Button type="submit" disabled={orgPending}>
                {orgPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Org Details"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Workspace Core Directory</span>
            <span className="mos-pill rounded-full px-2.5 py-0.5 text-xs">{members.length} Members Active</span>
          </CardTitle>
          <CardDescription>
            Core members of this brand workspace, including human operators and active AI Employees.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--color-border)]">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-[var(--color-surface-2)]/40"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                      member.isAI
                        ? "border-[rgba(124,156,255,0.2)] bg-[rgba(124,156,255,0.1)] text-[var(--brand-accent-strong)]"
                        : "bg-[var(--color-surface-3)] text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {member.isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-sm font-medium">
                      {member.name}
                      {member.isAI && (
                        <span className="mos-pill rounded px-1.5 py-0.2 text-[10px] font-semibold tracking-wide">
                          AI
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-[var(--color-text-tertiary)]">{member.email}</p>
                  </div>
                </div>

                <span
                  className={`rounded border px-2 py-0.5 text-xs font-medium uppercase tracking-wider ${
                    member.role === "OWNER"
                      ? "border-green-500/20 bg-green-500/10 text-green-400"
                      : member.role === "AI_EMPLOYEE"
                        ? "border-[var(--brand-accent)/20] bg-[var(--brand-accent)/10] text-[var(--brand-accent-strong)]"
                        : "border-blue-500/20 bg-blue-500/10 text-blue-400"
                  }`}
                >
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
