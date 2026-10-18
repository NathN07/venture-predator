"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { IntroModal, TermSheetModal } from "@/components/DealActions";
import { DealDrawer } from "@/components/DealDrawer";
import { CATEGORIES } from "@/lib/rounds";
import { money, scoreTone, timeAgo } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import type { Deal } from "@/lib/types";

const TONE = {
  verified: "bg-verified-soft text-verified",
  caution: "bg-caution-soft text-caution",
  signal: "bg-signal-soft text-signal",
};

const MIN_SCORES = [80, 88, 92] as const;

export function DealRadar({
  initialDeals,
  userId,
  sentTerms,
  sentIntros,
}: {
  initialDeals: Deal[];
  userId: string;
  sentTerms: string[];
  sentIntros: string[];
}) {
  const [deals, setDeals] = useState(initialDeals);
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  const [live, setLive] = useState(false);
  const [category, setCategory] = useState("All");
  const [minScore, setMinScore] = useState<number>(80);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [modal, setModal] = useState<"term" | "intro" | null>(null);
  const [terms, setTerms] = useState(new Set(sentTerms));
  const [intros, setIntros] = useState(new Set(sentIntros));

  const pull = useCallback(async (id: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("interrogations")
      .select("*, startups(*)")
      .eq("id", id)
      .eq("verified", true)
      .maybeSingle<Deal>();
    if (!data) return;
    setDeals((prev) => [data, ...prev.filter((d) => d.id !== data.id)]);
    setFresh((prev) => new Set(prev).add(data.id));
    setTimeout(
      () =>
        setFresh((prev) => {
          const n = new Set(prev);
          n.delete(data.id);
          return n;
        }),
      12_000,
    );
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("verified-deals")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "interrogations", filter: "verified=eq.true" },
        (payload) => {
          const id = (payload.new as { id?: string })?.id;
          if (id) pull(id);
        },
      )
      .subscribe((status) => setLive(status === "SUBSCRIBED"));
    return () => {
      supabase.removeChannel(channel);
    };
  }, [pull]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return deals
      .filter((d) => (d.final_score ?? 0) >= minScore)
      .filter((d) => category === "All" || d.startups.category === category)
      .filter(
        (d) =>
          !q ||
          d.startups.name.toLowerCase().includes(q) ||
          d.startups.pitch.toLowerCase().includes(q) ||
          d.startups.category.toLowerCase().includes(q),
      )
      .sort((a, b) => +new Date(b.completed_at ?? 0) - +new Date(a.completed_at ?? 0));
  }, [deals, category, minScore, query]);

  const open = deals.find((d) => d.id === openId) ?? null;
  const median = deals.length
    ? [...deals].map((d) => d.final_score ?? 0).sort((a, b) => a - b)[Math.floor(deals.length / 2)]
    : 0;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Deal radar</h1>
          <p className="mt-1.5 text-[15px] text-muted">
            Startups that scored 80 or higher in the interrogation, newest first.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted" role="status">
          <span className={`size-2.5 rounded-full ${live ? "live-dot bg-verified" : "bg-line"}`} aria-hidden="true" />
          {live ? "Live: new deals appear automatically" : "Connecting…"}
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-3 gap-3 sm:max-w-xl">
        <Metric label="On the radar" value={String(deals.length)} />
        <Metric label="Median score" value={deals.length ? String(median) : "—"} />
        <Metric label="Showing" value={String(visible.length)} />
      </dl>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="min-w-[220px] flex-1">
          <label htmlFor="q" className="sr-only">Search startups</label>
          <input id="q" className="field" placeholder="Search name, pitch or category" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div>
          <label htmlFor="cat" className="sr-only">Category</label>
          <select id="cat" className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>All</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex rounded-lg border border-line bg-surface p-0.5" role="group" aria-label="Minimum score">
          {MIN_SCORES.map((m) => (
            <button
              key={m}
              onClick={() => setMinScore(m)}
              aria-pressed={minScore === m}
              className={`rounded-md px-3 py-1.5 text-sm tabular-nums transition ${minScore === m ? "bg-ink text-white" : "text-muted hover:text-ink"}`}
            >
              {m}+
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-line bg-surface px-6 py-14 text-center">
          <p className="font-display text-xl font-semibold">
            {deals.length === 0 ? "No verified startups yet" : "Nothing matches these filters"}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-[15px] text-muted">
            {deals.length === 0
              ? "This page updates by itself the moment a founder passes the interrogation."
              : "Lower the minimum score or clear the search."}
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-3">
          {visible.map((d) => {
            const s = d.startups;
            return (
              <li key={d.id}>
                <button
                  onClick={() => setOpenId(d.id)}
                  className="flex w-full items-start justify-between gap-5 rounded-xl border border-line bg-surface px-5 py-4 text-left transition hover:border-ink/40"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{s.name}</span>
                      <span className="rounded bg-paper-2 px-1.5 py-0.5 text-[11px] text-muted">{s.category}</span>
                      {fresh.has(d.id) && (
                        <span className="rounded bg-verified px-1.5 py-0.5 text-[11px] font-medium text-white">New</span>
                      )}
                      {terms.has(d.id) && (
                        <span className="rounded bg-paper-2 px-1.5 py-0.5 text-[11px] text-muted">Term sheet sent</span>
                      )}
                    </div>
                    <p className="mt-1.5 line-clamp-2 max-w-2xl text-sm leading-relaxed text-muted">{s.pitch}</p>
                    <p className="mt-2 text-xs text-muted tabular-nums">
                      {money(s.mrr)} MRR · {s.mom_growth}% MoM · {s.contracts} customers · {timeAgo(d.completed_at)}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold tabular-nums ${TONE[scoreTone(d.final_score ?? 0)]}`}>
                    {d.final_score}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {open && (
        <DealDrawer
          deal={open}
          termSent={terms.has(open.id)}
          introSent={intros.has(open.id)}
          onTerm={() => setModal("term")}
          onIntro={() => setModal("intro")}
          onClose={() => {
            setModal(null);
            setOpenId(null);
          }}
        />
      )}
      {open && modal === "term" && (
        <TermSheetModal
          deal={open}
          userId={userId}
          onClose={() => setModal(null)}
          onSent={() => setTerms((p) => new Set(p).add(open.id))}
        />
      )}
      {open && modal === "intro" && (
        <IntroModal
          deal={open}
          userId={userId}
          onClose={() => setModal(null)}
          onSent={() => setIntros((p) => new Set(p).add(open.id))}
        />
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface px-4 py-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 font-display text-2xl font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
