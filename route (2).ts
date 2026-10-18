import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { openingTurn } from "@/lib/engine";
import type { Startup } from "@/lib/types";

export const maxDuration = 30;

const num = (v: unknown, min: number, max: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
};
const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Server is not configured." }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "founder") {
    return NextResponse.json({ error: "Only founder accounts can pitch." }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = str(body.name, 80);
  const category = str(body.category, 40);
  const pitch = str(body.pitch, 3000);
  const mrr = num(body.mrr, 0, 1e10);
  const growth = num(body.mom_growth, -100, 10000);
  const contracts = num(body.contracts, 0, 1e6);
  const burn = num(body.burn, 0, 1e10);
  const email = str(body.founder_email, 120);

  if (!name) return NextResponse.json({ error: "Startup name is required." }, { status: 400 });
  if (!category) return NextResponse.json({ error: "Pick a category." }, { status: 400 });
  if (pitch.length < 40)
    return NextResponse.json({ error: "Write at least a few sentences for the pitch." }, { status: 400 });
  if (mrr === null || growth === null || contracts === null || burn === null)
    return NextResponse.json({ error: "Traction numbers must be valid numbers." }, { status: 400 });
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return NextResponse.json({ error: "Enter a valid contact email." }, { status: 400 });

  const admin = createAdminClient();

  // Resume an unfinished run instead of starting a second one.
  const { data: open } = await admin
    .from("interrogations")
    .select("id")
    .eq("owner_id", user.id)
    .eq("status", "in_progress")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (open) return NextResponse.json({ id: open.id, resumed: true });

  // Free-tier protection: daily cap and retry cooldown after a rejection.
  const dailyLimit = Number(process.env.DAILY_ATTEMPT_LIMIT ?? 5);
  const cooldownMin = Number(process.env.RETRY_COOLDOWN_MINUTES ?? 30);

  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { count } = await admin
    .from("interrogations")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", user.id)
    .gte("created_at", since);
  if ((count ?? 0) >= dailyLimit) {
    return NextResponse.json(
      { error: `Daily limit of ${dailyLimit} interrogations reached. Try again tomorrow.` },
      { status: 429 },
    );
  }

  const { data: last } = await admin
    .from("interrogations")
    .select("completed_at, verdict")
    .eq("owner_id", user.id)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (last?.verdict === "rejected" && last.completed_at && cooldownMin > 0) {
    const waitMs = new Date(last.completed_at).getTime() + cooldownMin * 60_000 - Date.now();
    if (waitMs > 0) {
      return NextResponse.json(
        { error: `Cooling off. You can pitch again in ${Math.ceil(waitMs / 60_000)} min.` },
        { status: 429 },
      );
    }
  }

  const { data: startup, error: sErr } = await admin
    .from("startups")
    .insert({
      owner_id: user.id,
      name,
      category,
      founder_name: str(body.founder_name, 80) || null,
      founder_email: email || user.email || null,
      twitter: str(body.twitter, 40).replace(/^@/, "") || null,
      mrr,
      mom_growth: growth,
      contracts: Math.round(contracts),
      burn,
      pitch,
    })
    .select("*")
    .single<Startup>();
  if (sErr || !startup) {
    return NextResponse.json({ error: "Could not save your startup." }, { status: 500 });
  }

  const interrogationId = crypto.randomUUID();
  const first = await openingTurn(startup, interrogationId);

  const { error: iErr } = await admin.from("interrogations").insert({
    id: interrogationId,
    startup_id: startup.id,
    owner_id: user.id,
    engine: first.source,
    turns: [first],
  });
  if (iErr) {
    return NextResponse.json({ error: "Could not start the interrogation." }, { status: 500 });
  }

  return NextResponse.json({ id: interrogationId });
}
