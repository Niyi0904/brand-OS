"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { ArrowRight, Lock, Mail, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1fr_440px] lg:items-center">
        <section className="hidden lg:block">
          <div className="mos-pill mb-5 inline-flex rounded-full px-3 py-1 text-xs font-medium">
            MarketingOS
          </div>
          <h1 className="max-w-2xl text-5xl font-semibold leading-tight">
            Your AI marketing team starts with one shared source of brand truth.
          </h1>
          <p className="mos-muted mt-5 max-w-xl text-base leading-7">
            Sign in to manage Brand Brains, specialist AI employees, campaign workflows, and the operating layer for every client or business you support.
          </p>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            <Signal title="Brands" value="Multi" />
            <Signal title="Employees" value="AI" />
            <Signal title="Context" value="Live" />
          </div>
        </section>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg mos-icon-tile">
              <Sparkles className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your MarketingOS workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[var(--color-text-tertiary)]" />
                  <Input id="email" type="email" placeholder="name@example.com" className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[var(--color-text-tertiary)]" />
                  <Input id="password" type="password" placeholder="Password" className="pl-10" />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Sign in
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t mos-divider" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[var(--color-surface-1)] px-3 mos-subtle">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" type="button" onClick={() => signIn("google")}>
                Google
              </Button>
              <Button variant="outline" type="button" onClick={() => signIn("github")}>
                GitHub
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 text-center text-sm">
            <Link href="#" className="mos-muted hover:text-[var(--color-text-primary)]">
              Forgot your password?
            </Link>
            <p className="mos-muted">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-[var(--brand-accent-strong)] hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

function Signal({ title, value }: { title: string; value: string }) {
  return (
    <div className="mos-panel p-4">
      <p className="mos-subtle text-xs font-medium uppercase tracking-[0.14em]">{title}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
