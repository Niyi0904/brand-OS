import Link from "next/link";
import { ArrowRight, Lock, Mail, Sparkles, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_440px] lg:items-center">
        <section className="hidden lg:block">
          <div className="mos-pill mb-5 inline-flex rounded-full px-3 py-1 text-xs font-medium">
            Build your marketing OS
          </div>
          <h1 className="max-w-2xl text-5xl font-semibold leading-tight">
            Give every brand a memory, then let specialist AI employees do useful work.
          </h1>
          <p className="mos-muted mt-5 max-w-xl text-base leading-7">
            Create a workspace for agencies, freelancers, and teams that need repeatable marketing execution without repeating brand context every time.
          </p>
        </section>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg mos-icon-tile">
              <Sparkles className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>Start building your AI marketing workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[var(--color-text-tertiary)]" />
                  <Input id="name" type="text" placeholder="Jane Doe" className="pl-10" />
                </div>
              </div>
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
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[var(--color-text-tertiary)]" />
                  <Input id="confirmPassword" type="password" placeholder="Password" className="pl-10" />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Create account
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
              <Button variant="outline" type="button">
                Google
              </Button>
              <Button variant="outline" type="button">
                GitHub
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p className="w-full text-center text-sm mos-muted">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-[var(--brand-accent-strong)] hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
