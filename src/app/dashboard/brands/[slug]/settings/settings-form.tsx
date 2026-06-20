"use client";

import { useActionState } from "react";
import { useState } from "react";
import { Save, Upload, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadDropzone } from "@/lib/uploadthing-components";
import { updateBrandBrainAction, type SettingsActionState } from "./actions";

type SectionConfig = {
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: { id: string; label: string; placeholder: string }[];
};

type SettingsFormProps = {
  slug: string;
  sections: SectionConfig[];
  brain: Record<string, string | null> | null;
  logoUrl: string | null;
};

export function SettingsForm({ slug, sections, brain, logoUrl }: SettingsFormProps) {
  const initialState: SettingsActionState = {};
  const [state, formAction] = useActionState(updateBrandBrainAction, initialState);
  const router = useRouter();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(logoUrl);
  const [hasFileSelected, setHasFileSelected] = useState(false);

  return (
    <form action={formAction} className="grid gap-5 lg:grid-cols-2">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="logo" value={logoUrl ?? ""} id="logo-input" />
      {state?.message && !state.errors ? (
        <div className="lg:col-span-2 rounded-md bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {state.message}
        </div>
      ) : null}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="mb-3 flex items-center gap-3">
            <div className="mos-icon-tile flex h-10 w-10 items-center justify-center rounded-lg [&_svg]:h-4 [&_svg]:w-4">
              <Upload className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>Brand logo</CardTitle>
              <CardDescription>Upload a logo for your brand. Recommended: square PNG or SVG, max 4MB.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            {selectedLogo ? (
              <img src={selectedLogo} alt="Brand logo" className="h-16 w-16 rounded-lg border border-[var(--color-border)] object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-tertiary)]">
                No logo
              </div>
            )}
            <div className="flex-1">
              <div className={`rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
                hasFileSelected
                  ? "border-[var(--brand-accent)] bg-[var(--color-surface-2)]"
                  : "border-[var(--color-border)]"
              }`}>
                <UploadDropzone
                  endpoint="brandLogo"
                  onClientUploadComplete={(res) => {
                    if (res && res[0]) {
                      setSelectedLogo(res[0].url);
                      document.getElementById("logo-input")?.setAttribute("value", res[0].url);
                      setUploadingLogo(false);
                      setHasFileSelected(false);
                    }
                  }}
                  onUploadError={(error) => {
                    console.error("Upload error:", error);
                    setUploadingLogo(false);
                    setHasFileSelected(false);
                  }}
                  onUploadBegin={() => {
                    setUploadingLogo(true);
                    setHasFileSelected(true);
                  }}
                />
                {!uploadingLogo && !selectedLogo && !hasFileSelected && (
                  <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">
                    Drop an image here or click to browse
                  </p>
                )}
                {hasFileSelected && !uploadingLogo && !selectedLogo && (
                  <p className="mt-2 flex items-center justify-center gap-1 text-xs text-[var(--brand-accent)]">
                    <Check className="h-3 w-3" />
                    File selected — ready to upload
                  </p>
                )}
              </div>
              {uploadingLogo && (
                <div className="mt-2 flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Uploading...
                </div>
              )}
              {selectedLogo && !uploadingLogo && (
                <div className="mt-2 flex items-center gap-1 text-xs text-green-400">
                  <Check className="h-3 w-3" />
                  Logo uploaded successfully
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {sections.map((section) => (
        <Card key={section.title}>
          <CardHeader>
            <div className="mb-3 flex items-center gap-3">
              <div className="mos-icon-tile flex h-10 w-10 items-center justify-center rounded-lg [&_svg]:h-4 [&_svg]:w-4">
                {section.icon}
              </div>
              <div>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            {section.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input
                  id={field.id}
                  name={field.id}
                  placeholder={field.placeholder}
                  defaultValue={brain?.[field.id] as string | undefined}
                />
                {state?.errors?.[field.id] ? (
                  <p className="text-xs text-red-400">{state.errors[field.id]?.[0]}</p>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
      <div className="lg:col-span-2">
        <Button type="submit" size="lg">
          <Save className="h-4 w-4" />
          Save changes
        </Button>
      </div>
      <input type="hidden" name="logo" value={selectedLogo ?? ""} id="logo-input" />
    </form>
  );
}