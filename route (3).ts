import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { advance } from "@/lib/engine";
import type { Interrogation, Startup } from "@/lib/types";

export const maxDuration = 30;

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/interrogation/[id]/answer">,
) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Server is not configured." }, { status: 503 });
  }
  const { id } = await ctx.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  let answer = "";
  try {
    const body = await request.json();
    answer = typeof body.answer === "string" ? body.answer.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (answer.length < 10) {
    return NextResponse.json({ error: "Give a real answer (at least a sentence)." }, { status: 400 });
  }
  if (answer.length > 2000) {
    return NextResponse.json({ error: "Keep answers under 2000 characters." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: run } = await admin
    .from("interrogations")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle<Interrogation>();
  if (!run) return NextResponse.json({ error: "Interrogation not found." }, { status: 404 });
  if (run.status !== "in_progress") {
    return NextResponse.json({ error: "This interrogation is already finished." }, { status: 409 });
  }
  const current = run.turns[run.turns.length - 1];
  if (!current || current.answer) {
    return NextResponse.json({ error: "No open question." }, { status: 409 });
  }

  const { data: startup } = await admin
    .from("startups")
    .select("*")
    .eq("id", run.startup_id)
    .single<Startup>();
  if (!startup) return NextResponse.json({ error: "Startup missing." }, { status: 404 });

  const next = await advance(startup, run.turns, answer, run.id);

  const { data: updated, error } = await admin
    .from("interrogations")
    .update(next)
    .eq("id", run.id)
    .select("*")
    .single<Interrogation>();
  if (error || !updated) {
    return NextResponse.json({ error: "Could not save your answer." }, { status: 500 });
  }
  return NextResponse.json({ interrogation: updated });
}
