"use client";

import { Modal } from "@/components/Modal";
import { ScoreDial } from "@/components/ScoreDial";
import { ROUNDS } from "@/lib/rounds";
import { money, scoreTone, timeAgo } from "@/lib/format";
import type { Deal } from "@/lib/types";

const BAR = {
  verified: "bg-verified",
  caution: "bg-caution",
  signal: "bg-signal",
};

export function DealDrawer({
  deal,
  termSent,
  introSent,
  onTerm,
  onIntro,
  onClose,
}: {
  deal: Deal;
  termSent: boolean;
  introSent: boolean;
  onTerm: () => void;
  onIntro: () => void;
  onClose: () => void;
}) {
  const s = deal.startups;
  return (
    <Modal title={`${s.name} deal details`} onClose={onClose} side>
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-surface/95 px-6 py-5 backdrop-blur">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">{s.name}</h2>
          <p className="mt-0.5 text-sm text-muted">
            {s.category} · verified {timeAgo(deal.completed_at)}
          </p>
        </div>
        <button onClick={onClose} aria-label="Close" className="rounded-md p-1.5 text-muted hover:bg-paper hover:text-ink">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>

      <div className="space-y-8 px-6 py-6">
        <div className="flex items-center gap-6">
          <ScoreDial score={deal.final_score ?? 0} size={112} animate={false} />
          <div className="grid flex-1 grid-cols-2 gap-3 text-sm">
            <Stat label="MRR" value={money(s.mrr)} />
            <Stat label="MoM growth" value={`${s.mom_growth}%`} />
            <Stat label="Customers" value={String(s.contracts)} />
            <Stat label="Monthly burn" value={money(s.burn)} />
          </div>
        </div>
        <p className="-mt-3 text-xs text-muted">Traction figures are self-reported by the founder.</p>

        <section>
          <h3 className="mb-2 font-display text-base font-semibold">Pitch</h3>
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{s.pitch}</p>
        </section>

        <section>
          <h3 className="mb-3 font-display text-base font-semibold">Interrogation transcript</h3>
          <ol className="space-y-5">
            {deal.turns.map((t) => (
              <li key={t.round} className="rounded-xl border border-line p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-muted">
                    Round {t.round} · {ROUNDS[t.round - 1].title}
                  </span>
                  {typeof t.score === "number" && (
                    <span className={`rounded px-2 py-0.5 text-xs font-medium tabular-nums text-white ${BAR[scoreTone(t.score)]}`}>
                      {t.score}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[15px] font-medium leading-snug">{t.question}</p>
                <p className="mt-2 text-[15px] leading-relaxed whitespace-pre-wrap text-ink/85">{t.answer}</p>
                {t.critique && <p className="mt-3 border-t border-line pt-3 text-sm text-muted">{t.critique}</p>}
              </li>
            ))}
          </ol>
        </section>

        {deal.autopsy && (
          <section>
            <h3 className="mb-2 font-display text-base font-semibold">Partner&apos;s note</h3>
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-ink/85">{deal.autopsy}</p>
          </section>
        )}

        <section>
          <h3 className="mb-2 font-display text-base font-semibold">Founder</h3>
          <p className="text-[15px]">{s.founder_name ?? "Name not provided"}</p>
          <p className="mt-1 text-sm text-muted">
            {s.founder_email && (
              <a className="underline underline-offset-2 hover:text-ink" href={`mailto:${s.founder_email}`}>
                {s.founder_email}
              </a>
            )}
            {s.twitter && (
              <>
                {s.founder_email ? " · " : ""}
                <a className="underline underline-offset-2 hover:text-ink" href={`https://x.com/${s.twitter}`} target="_blank" rel="noopener noreferrer">
                  @{s.twitter}
                </a>
              </>
            )}
          </p>
        </section>
      </div>

      <div className="sticky bottom-0 flex flex-wrap gap-3 border-t border-line bg-surface/95 px-6 py-4 backdrop-blur">
        <button
          onClick={onTerm}
          disabled={termSent}
          className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink-2 disabled:opacity-50"
        >
          {termSent ? "Term sheet sent" : "Send soft term sheet"}
        </button>
        <button
          onClick={onIntro}
          disabled={introSent}
          className="rounded-lg border border-line px-4 py-2.5 text-sm font-medium hover:bg-paper disabled:opacity-50"
        >
          {introSent ? "Intro requested" : "Request intro"}
        </button>
      </div>
    </Modal>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-paper px-3 py-2">
      <div className="text-xs text-muted">{label}</div>
      <div className="font-medium tabular-nums">{value}</div>
    </div>
  );
}
