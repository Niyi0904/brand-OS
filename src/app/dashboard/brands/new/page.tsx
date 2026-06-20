"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, CheckCircle2, Palette, Sparkles, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBrandAction, type CreateBrandActionState } from "./actions";

const initialState: CreateBrandActionState = {};

const setupSteps = [
  {
    title: "Core identity",
    description: "Capture the brand name, position, and business context.",
    icon: <Building2 />,
  },
  {
    title: "Audience signal",
    description: "Define who the AI team should speak to and prioritize.",
    icon: <Users />,
  },
  {
    title: "Creative system",
    description: "Add voice, visuals, and rules before campaigns start.",
    icon: <Palette />,
  },
];

export default function NewBrandPage() {
  const [state, formAction, pending] = useActionState(createBrandAction, initialState);

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr_0.55fr]">
      <section className="space-y-6">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/brands" aria-label="Back to brands">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="mos-pill mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium">
              New Brand Brain
            </div>
            <h1 className="text-3xl font-semibold leading-tight">Create a brand workspace</h1>
            <p className="mos-muted mt-2 max-w-2xl text-sm leading-6">
              Start with the identity data that AI employees need before they can produce useful, on-brand work.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Brand foundation</CardTitle>
            <CardDescription>These fields create the first version of your Brand Brain.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="grid gap-5">
              {state?.message && !state.errors ? (
                <div className="rounded-md bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {state.message}
                </div>
              ) : null}
              <div className="grid gap-5 md:grid-cols-2">
                <Field id="name" label="Brand name" placeholder="TouchedBy02" error={state?.errors?.name?.[0]} />
                <Field
                  id="slug"
                  label="Workspace slug"
                  placeholder="touchedby02"
                  helper="Used in workspace URLs and internal references."
                  error={state?.errors?.slug?.[0]}
                />
              </div>

              <Field id="description" label="Positioning summary" placeholder="Fashion and lifestyle brand for expressive everyday style." />
              <Field id="logo" label="Logo URL" placeholder="https://example.com/logo.png" />

              <div className="grid gap-5 md:grid-cols-2">
                <Field id="audience" label="Primary audience" placeholder="Style-conscious shoppers, ages 18-34" />
                <Field id="accent" label="Brand accent" placeholder="Confident, expressive, editorial" />
              </div>

              <div className="flex flex-col gap-3 border-t pt-5 mos-divider sm:flex-row sm:items-center sm:justify-between">
                <p className="mos-muted text-sm">
                  You can expand mission, voice, offers, and SEO context after creation.
                </p>
                <Button type="submit" className="sm:min-w-40" disabled={pending}>
                  <Sparkles className="h-4 w-4" />
                  {pending ? "Creating..." : "Create brand"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      <aside className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Setup path</CardTitle>
            <CardDescription>What happens after the workspace is created.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {setupSteps.map((step) => (
              <div key={step.title} className="flex gap-3">
                <div className="mos-icon-tile flex h-10 w-10 shrink-0 items-center justify-center rounded-lg [&_svg]:h-4 [&_svg]:w-4">
                  {step.icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="mos-muted mt-1 text-xs leading-5">{step.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI readiness</CardTitle>
            <CardDescription>Minimum context needed before specialist work begins.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ChecklistItem label="Name and positioning" />
            <ChecklistItem label="Audience segment" />
            <ChecklistItem label="Tone and rules" />
            <ChecklistItem label="Offers and channels" muted />
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function Field({ id, label, placeholder, helper, error }: { id: string; label: string; placeholder: string; helper?: string; error?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} placeholder={placeholder} />
      {helper ? <p className="mos-subtle text-xs">{helper}</p> : null}
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}

function ChecklistItem({ label, muted = false }: { label: string; muted?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className={muted ? "h-4 w-4 text-[var(--color-text-tertiary)]" : "h-4 w-4 text-[var(--color-positive)]"} />
      <span className={muted ? "mos-subtle text-sm" : "mos-muted text-sm"}>{label}</span>
    </div>
  );
}