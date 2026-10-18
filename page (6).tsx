import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { money, scoreTone, timeAgo } from "@/lib/format";
import type { Deal, IntroRequest, TermSheet } from "@/lib/types";

export const metadata: Metadata = { title: "My pitches" };

const TONE = {
  verified: "bg-verified-soft text-verified",
  caution: "bg-caution-soft text-caution",
  signal: "bg-signal-soft text-signal",
};

export default async function FounderHome() {
  const { supabase, profile } = await requireRole("founder");

  const [runs, sheets, intros] = await Promise.all([
    supabase
      .from("interrogations")
      .select("*, startups(*)")
      .order("created_at", { ascending: false })
      .returns<Deal[]>(),
    supabase
      .from("term_sheets")
      .select("*")
      .order("created_at", { ascending: false })
      .returns<TermSheet[]>(),
    supabase
      .from("intro_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .returns<IntroRequest[]>(),
  ]);

  const deals = runs.data ?? [];
  const nameOf = (startupId: string) =>
    deals.find((d) => d.startup_id === startupId)?.startups?.name ?? "your startup";

  const interest = [
    ...(sheets.data ?? []).map((t) => ({ kind: "term" as const, at: t.created_at, t })),
    ...(intros.data ?? []).map((i) => ({ kind: "intro" as const, at: i.created_at, i })),
  ].sort((a, b) => +new Date(b.at) - +new Date(a.at));

  const first = profile.full_name?.split(" ")[0];

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {first ? `${first}, your pitches` : "Your pitches"}
          </h1>
          <p className="mt-1.5 text-[15px] text-muted">
            Only you can see this page. Investors see a startup only after it scores 80 or higher.
          </p>
        </div>
        <Link
          href="/founder/new"
          className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white transition hover:bg-ink-2"
        >
          Start a new pitch
        </Link>
      </div>

      {interest.length > 0 && (
        <section aria-labelledby="interest">
          <h2 id="interest" className="mb-3 font-display text-xl font-semibold">
            Investor interest
          </h2>
          <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
            {interest.map((x) => {
              const row = x.kind === "term" ? x.t : x.i;
              const who = row.investor_name ?? "An investor";
              return (
                <li key={row.id} className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
                  <div className="max-w-xl">
                    <p className="text-[15px]">
                      <span className="font-medium">{who}</span>
                      {row.investor_firm ? ` of ${row.investor_firm}` : ""}{" "}
                      {x.kind === "term"
                        ? `sent a soft term sheet for ${nameOf(x.t.startup_id)}`
                        : `asked for an introduction to ${nameOf(x.i.startup_id)}`}
                      .
                    </p>
                    {x.kind === "term" ? (
                      <p className="mt-1 text-sm text-muted">
                        {money(x.t.check_size)} cheque at {money(x.t.pre_money)} pre-money.
                        {x.t.covenants ? ` Terms: ${x.t.covenants}` : ""}
                      </p>
                    ) : (
                      x.i.message && <p className="mt-1 text-sm text-muted">{x.i.message}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted">{timeAgo(x.at)}</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section aria-labelledby="runs">
        <h2 id="runs" className="mb-3 font-display text-xl font-semibold">
          Interrogations
        </h2>

        {deals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-surface px-6 py-14 text-center">
            <p className="font-display text-xl font-semibold">No pitches yet</p>
            <p className="mx-auto mt-2 max-w-sm text-[15px] text-muted">
              Add your startup details and answer four questions from Vesper Prey. It takes about ten minutes.
            </p>
            <Link
              href="/founder/new"
              className="mt-6 inline-block rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink-2"
            >
              Start your first pitch
            </Link>
          </div>
        ) : (
          <ul className="grid gap-3">
            {deals.map((d) => {
              const done = d.status === "completed";
              const tone = done && d.final_score !== null ? TONE[scoreTone(d.final_score)] : "bg-paper-2 text-muted";
              return (
                <li key={d.id}>
                  <Link
                    href={`/founder/session/${d.id}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface px-5 py-4 transition hover:border-ink/40"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate font-medium">{d.startups?.name}</span>
                        <span className="rounded bg-paper-2 px-1.5 py-0.5 text-[11px] text-muted">
                          {d.startups?.category}
                        </span>
                        {d.verified && (
                          <span className="rounded bg-verified-soft px-1.5 py-0.5 text-[11px] font-medium text-verified">
                            Visible to investors
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted">
                        {done
                          ? `Finished ${timeAgo(d.completed_at)}`
                          : `Round ${d.turns.length} of 4 in progress`}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium tabular-nums ${tone}`}>
                      {done ? `${d.final_score}/100` : "Continue"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
