import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GoogleButton } from "@/components/GoogleButton";
import { Logo } from "@/components/Logo";
import { safeNext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const sp = await searchParams;
  const next = safeNext(typeof sp.next === "string" ? sp.next : undefined, "/onboarding");
  const failed = sp.error === "auth";

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect(next);
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden flex-col justify-between bg-ink p-12 text-white lg:flex">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <span className="font-display text-[19px] font-semibold tracking-tight">
            Venture Predator
          </span>
        </Link>
        <div className="max-w-md">
          <p className="font-display text-4xl leading-[1.1] font-semibold tracking-tight">
            Four questions stand between your pitch and a term sheet.
          </p>
          <p className="mt-6 text-[15px] leading-relaxed text-white/65">
            Each round targets the weakest part of your story. Pass with 80 or higher
            and your startup, along with the full transcript, is visible to investors
            on the radar.
          </p>
        </div>
        <p className="text-sm text-white/45">Free while we are in early access.</p>
      </aside>

      <main className="flex flex-col justify-center px-6 py-16 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <Logo />
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Sign in
          </h1>
          <p className="mt-2 text-[15px] text-muted">
            Use your Google account. Your pitches and results stay private to you.
          </p>

          {failed && (
            <p
              role="alert"
              className="mt-6 rounded-lg border border-signal/30 bg-signal-soft px-4 py-3 text-sm text-signal"
            >
              Sign-in did not complete. Try again, and allow access when Google asks.
            </p>
          )}

          <div className="mt-8">
            {isSupabaseConfigured ? (
              <GoogleButton next={next} />
            ) : (
              <div className="rounded-lg border border-caution/30 bg-caution-soft p-4 text-sm leading-relaxed text-caution">
                <p className="font-medium">Sign-in is not set up yet.</p>
                <p className="mt-1">
                  Add <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                  <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
                  <code className="font-mono">.env.local</code>, then restart. Steps are
                  in the README.
                </p>
              </div>
            )}
          </div>

          <p className="mt-8 text-xs leading-relaxed text-muted">
            By continuing you agree that pitches scoring 80 or higher are shown to
            signed-in investors, including your contact email.
          </p>
        </div>
      </main>
    </div>
  );
}
