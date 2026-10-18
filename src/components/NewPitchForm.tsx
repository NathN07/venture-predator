"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES } from "@/lib/rounds";

type Form = {
  name: string;
  category: string;
  founder_name: string;
  founder_email: string;
  twitter: string;
  mrr: string;
  mom_growth: string;
  contracts: string;
  burn: string;
  pitch: string;
};

const SAMPLES: Record<"strong" | "weak", Partial<Form>> = {
  strong: {
    name: "LedgerLoop",
    category: "Fintech",
    mrr: "42000",
    mom_growth: "14",
    contracts: "9",
    burn: "60000",
    pitch:
      "LedgerLoop automates month-end reconciliation for mid-size logistics companies. Finance teams spend about six days a month matching freight invoices to bank feeds; we cut that to under one day. We integrate directly with the three largest freight billing systems, which took us eight months to certify. Nine customers pay an average of $4,600 a month on annual contracts, and none have churned in fourteen months.",
  },
  weak: {
    name: "SynergyAI",
    category: "AI / ML",
    mrr: "0",
    mom_growth: "0",
    contracts: "0",
    burn: "8000",
    pitch:
      "SynergyAI is a revolutionary, AI-powered, game-changing platform that will disrupt every industry. We have no competitors and a world-class passionate team. We believe being first mover will make us a unicorn.",
  },
};

export function NewPitchForm({
  defaultName,
  defaultEmail,
}: {
  defaultName: string;
  defaultEmail: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [f, setF] = useState<Form>({
    name: "",
    category: "",
    founder_name: defaultName,
    founder_email: defaultEmail,
    twitter: "",
    mrr: "",
    mom_growth: "",
    contracts: "",
    burn: "",
    pitch: "",
  });

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/interrogation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...f,
          mrr: f.mrr || 0,
          mom_growth: f.mom_growth || 0,
          contracts: f.contracts || 0,
          burn: f.burn || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      router.push(`/founder/session/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-8">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-surface px-4 py-3 text-sm">
        <span className="text-muted">Want to try it first?</span>
        <button
          type="button"
          onClick={() => setF((p) => ({ ...p, ...SAMPLES.strong }))}
          className="rounded-md bg-paper-2 px-2.5 py-1 font-medium hover:bg-line"
        >
          Fill with a strong sample
        </button>
        <button
          type="button"
          onClick={() => setF((p) => ({ ...p, ...SAMPLES.weak }))}
          className="rounded-md bg-paper-2 px-2.5 py-1 font-medium hover:bg-line"
        >
          Fill with a weak sample
        </button>
      </div>

      <fieldset className="space-y-4">
        <legend className="mb-1 font-display text-lg font-semibold">Startup</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Startup name" id="name">
            <input id="name" required maxLength={80} className="field" value={f.name} onChange={set("name")} />
          </Field>
          <Field label="Category" id="category">
            <select id="category" required className="field" value={f.category} onChange={set("category")}>
              <option value="" disabled>
                Choose one
              </option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Founder name" id="founder_name">
            <input id="founder_name" maxLength={80} className="field" value={f.founder_name} onChange={set("founder_name")} />
          </Field>
          <Field label="Contact email" id="founder_email" hint="Shown to investors only after you pass.">
            <input id="founder_email" type="email" className="field" value={f.founder_email} onChange={set("founder_email")} />
          </Field>
          <Field label="X / Twitter handle (optional)" id="twitter">
            <input id="twitter" maxLength={40} className="field" placeholder="@yourhandle" value={f.twitter} onChange={set("twitter")} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-1 font-display text-lg font-semibold">Traction</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Monthly recurring revenue (USD)" id="mrr">
            <input id="mrr" type="number" min={0} inputMode="decimal" className="field" placeholder="0" value={f.mrr} onChange={set("mrr")} />
          </Field>
          <Field label="Month-over-month growth (%)" id="mom_growth">
            <input id="mom_growth" type="number" min={-100} step="any" inputMode="decimal" className="field" placeholder="0" value={f.mom_growth} onChange={set("mom_growth")} />
          </Field>
          <Field label="Active paying customers or contracts" id="contracts">
            <input id="contracts" type="number" min={0} step={1} inputMode="numeric" className="field" placeholder="0" value={f.contracts} onChange={set("contracts")} />
          </Field>
          <Field label="Monthly burn (USD)" id="burn">
            <input id="burn" type="number" min={0} inputMode="decimal" className="field" placeholder="0" value={f.burn} onChange={set("burn")} />
          </Field>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-display text-lg font-semibold">Elevator pitch</legend>
        <Field label="What do you do, for whom, and why will it win?" id="pitch" hint={`${f.pitch.length}/3000`}>
          <textarea
            id="pitch"
            required
            minLength={40}
            maxLength={3000}
            rows={7}
            className="field leading-relaxed"
            value={f.pitch}
            onChange={set("pitch")}
          />
        </Field>
      </fieldset>

      {error && (
        <p role="alert" className="rounded-lg border border-signal/30 bg-signal-soft px-4 py-3 text-sm text-signal">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-4">
        <p className="max-w-sm text-sm text-muted">
          You get four questions. Score 80 or higher and investors can see your startup.
        </p>
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-ink px-5 py-3 text-[15px] font-medium text-white transition hover:bg-ink-2 disabled:opacity-60"
        >
          {busy ? "Preparing your first question…" : "Begin interrogation"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  id,
  hint,
  children,
}: {
  label: string;
  id: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
