import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Profile, Role } from "@/lib/types";

/** Returns the signed-in user + profile, or sends them to /login. */
export async function requireUser() {
  if (!isSupabaseConfigured) redirect("/login");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  return { supabase, user, profile };
}

/** Same as requireUser, and also makes sure the user is in the given role. */
export async function requireRole(role: Role) {
  const ctx = await requireUser();
  if (!ctx.profile?.role) redirect("/onboarding");
  if (ctx.profile.role !== role) redirect(`/${ctx.profile.role}`);
  return { ...ctx, profile: ctx.profile };
}

/** Only allow same-site relative redirects. */
export function safeNext(next: string | null | undefined, fallback = "/founder") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return fallback;
  }
  return next;
}
