"use client";

import { useActionState, useState } from "react";
import { Loader2, Lock, Mail, Upload } from "lucide-react";

import { UploadDropzone } from "@/lib/uploadthing-components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ActionState, updateProfileAction, changePasswordAction } from "./actions";
import { AlertBox, type UserData } from "./common";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
];

interface ProfileTabProps {
  user: UserData;
}

export function ProfileTab({ user }: ProfileTabProps) {
  const [profileState, profileAction, profilePending] = useActionState(updateProfileAction, {} as ActionState);
  const [passwordState, passwordAction, passwordPending] = useActionState(changePasswordAction, {} as ActionState);
  const [avatarUrl, setAvatarUrl] = useState(user.image || "");
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  return (
    <div className="space-y-6">
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
                          avatarUrl === url
                            ? "scale-105 border-[var(--brand-accent)]"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={url} alt={`Preset ${i}`} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center gap-3 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)]/40 p-3">
                      <Upload className="h-5 w-5 shrink-0 text-[var(--color-text-tertiary)]" />
                      <div className="min-w-0 flex-1">
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
              <div className="rounded-md bg-red-500/10 px-4 py-3 text-sm text-red-400">
                Upload failed: {avatarUploadError}. Please ensure UploadThing credentials are configured.
              </div>
            )}
            {avatarUploading && (
              <div className="rounded-md bg-[var(--color-surface-2)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                Uploading image...
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" name="name" defaultValue={user.name || ""} placeholder="Your full name" />
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
                    className="cursor-not-allowed pl-9 opacity-60"
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[var(--color-text-tertiary)]" />
                </div>
                <p className="text-[11px] text-[var(--color-text-tertiary)]">
                  Primary email used for account authentication cannot be changed.
                </p>
              </div>
            </div>

            <div className="flex justify-end border-t border-[var(--color-border)] pt-2">
              <Button type="submit" disabled={profilePending}>
                {profilePending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

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
                  className="pl-9"
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
                <Input id="newPassword" name="newPassword" type="password" placeholder="Min. 8 characters" />
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
                />
                {passwordState?.errors?.confirmPassword?.[0] && (
                  <p className="text-xs text-red-400">{passwordState.errors.confirmPassword[0]}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end border-t border-[var(--color-border)] pt-2">
              <Button type="submit" disabled={passwordPending}>
                {passwordPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
