"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ScoreDial } from "@/components/ScoreDial";
import { ROUNDS, TOTAL_ROUNDS, VERIFY_THRESHOLD } from "@/lib/rounds";
import { scoreTone } from "@/lib/format";
import type { Interrogation as Run } from "@/lib/types";

const BAR = {
  verified: "bg-verified",
  caution: "bg-caution",
  signal: "bg-signal",
};

export function Interrogation({
  initial,
  startupName,
}: {
  initial: Run;
  startupName: string;
}) {
  const [run, setRun] = useState<Run>(initial);
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const done = run.status === "completed";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [run.turns.length, done]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/interrogation/${run.id}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setRun(data.interrogation);
      setAnswer("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
      <section aria-label="Interrogation transcript" className="min-w-0">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight">{startupName}</h1>
          <p className="mt-1.5 text-sm text-muted">
            {run.engine === "gemini"
              ? "Questions written live by Gemini from your pitch."
              : "Using the standard question set. Add a Gemini key to make questions adapt to your pitch."}
          </p>
        </div>

        <ol className="space-y-8">
          {run.turns.map((t, i) => {
            const isOpen = !t.answer && !done && i === run.turns.length - 1;
            return (
              <li key={t.round} className="space-y-4">
                <div className="flex gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-white">
                    VP
                  </span>
                  <div>
                    <p className="text-xs text-muted">
                      Vesper Prey · Round {t.round}, {ROUNDS[t.round - 1].title}
                    </p>
                    <p className="mt-1 max-w-2xl text-[17px] leading-relaxed">{t.question}</p>
                  </div>
                </div>

                {t.answer && (
                  <div className="ml-11 max-w-2xl rounded-xl border border-line bg-surface p-4">
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{t.answer}</p>
                    {typeof t.score === "number" && (
                      <div className="mt-4 flex items-start gap-3 border-t border-line pt-3">
                        <span
                          className={`rounded px-2 py-0.5 text-xs font-medium tabular-nums text-white ${BAR[scoreTone(t.score)]}`}
                        >
                          {t.score}
                        </span>
                        <p className="text-sm text-muted">{t.critique}</p>
                      </div>
                    )}
                  </div>
                )}

                {isOpen && !busy && (
                  <form onSubmit={submit} className="ml-11 max-w-2xl">
                    <label htmlFor="answer" className="sr-only">
                      Your answer
                    </label>
                    <textarea
                      id="answer"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      rows={5}
                      maxLength={2000}
                      autoFocus
                      placeholder="Answer with specifics: numbers, names of customers or channels, and what you would do differently."
                      className="field leading-relaxed"
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted">{answer.length}/2000</span>
                      <button
                        type="submit"
                        disabled={answer.trim().length < 10}
                        className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white transition hover:bg-ink-2 disabled:opacity-40"
                      >
                        {t.round === TOTAL_ROUNDS ? "Submit final answer" : "Submit answer"}
                      </button>
                    </div>
                    {error && (
                      <p role="alert" className="mt-3 text-sm text-signal">
                        {error}
                      </p>
                    )}
                  </form>
                )}
              </li>
            );
          })}
        </ol>

        {busy && (
          <p className="mt-8 ml-11 text-[15px] text-muted" role="status">
            Vesper is reading your answer
            <span className="caret" aria-hidden="true" />
          </p>
        )}

        {done && run.final_score !== null && (
          <Verdict run={run} />
        )}
        <div ref={endRef} />
      </section>

      <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Progress">
        <div className="rounded-xl border border-line bg-surface p-5">
          <h2 className="font-display text-base font-semibold">Progress</h2>
          <ol className="mt-4 space-y-4">
            {ROUNDS.map((r) => {
              const t = run.turns[r.n - 1];
              const scored = typeof t?.score === "number";
              const active = !done && t && !t.answer;
              return (
                <li key={r.n}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className={active ? "font-medium" : t ? "" : "text-muted"}>
                      {r.title}
                    </span>
                    <span className="text-xs text-muted tabular-nums">
                      {scored ? t.score : active ? "Now" : "—"}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-paper-2">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${scored ? BAR[scoreTone(t.score!)] : "bg-ink/25"}`}
                      style={{ width: scored ? `${t.score}%` : active ? "8%" : "0%" }}
                    />
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-muted">
            {VERIFY_THRESHOLD} or higher overall puts you on the investor radar.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Verdict({ run }: { run: Run }) {
  const score = run.final_score ?? 0;
  const passed = run.verdict === "verified";
  return (
    <div
      className={`mt-12 rounded-2xl border p-6 sm:p-8 ${
        passed ? "border-verified/30 bg-verified-soft" : "border-signal/30 bg-signal-soft"
      }`}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <ScoreDial score={score} />
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            {passed ? "Verified. Investors can see your pitch." : "Not this time."}
          </h2>
          <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink/75">
            {passed
              ? "Your startup and this transcript are now on the investor radar. Term sheets and intro requests will appear on your pitches page."
              : `You needed ${VERIFY_THRESHOLD}. Review where points were lost, tighten your answers, and try again after the cooldown.`}
          </p>
        </div>
      </div>

      {run.autopsy && (
        <div className="mt-6 border-t border-ink/10 pt-5">
          <h3 className="text-sm font-medium">{passed ? "Partner's note" : "What went wrong"}</h3>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed whitespace-pre-wrap text-ink/80">
            {run.autopsy}
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/founder" className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink-2">
          Back to my pitches
        </Link>
        {!passed && (
          <Link href="/founder/new" className="rounded-lg border border-ink/20 bg-surface px-4 py-2.5 text-sm font-medium hover:bg-paper">
            Pitch again
          </Link>
        )}
      </div>
    </div>
  );
}
