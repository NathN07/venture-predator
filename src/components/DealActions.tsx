"use client";

import { useState } from "react";
import { Modal } from "@/components/Modal";
import { createClient } from "@/lib/supabase/client";
import type { Deal } from "@/lib/types";

export function TermSheetModal({
  deal,
  userId,
  onClose,
  onSent,
}: {
  deal: Deal;
  userId: string;
  onClose: () => void;
  onSent: () => void;
}) {
  const [pre, setPre] = useState("");
  const [check, setCheck] = useState("");
  const [terms, setTerms] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const preM = Number(pre);
    const checkM = Number(check);
    if (!(preM > 0) || !(checkM > 0)) return setError("Enter amounts greater than zero.");
    if (checkM > preM * 2) return setError("The cheque looks too large for that valuation. Check both figures.");
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.from("term_sheets").insert({
      investor_id: userId,
      interrogation_id: deal.id,
      startup_id: deal.startup_id,
      pre_money: Math.round(preM * 1_000_000),
      check_size: Math.round(checkM * 1_000_000),
      covenants: terms.trim() || null,
    });
    if (error) {
      setError("Could not send the term sheet. Try again.");
      setBusy(false);
      return;
    }
    onSent();
    onClose();
  }

  return (
    <Modal title="Send soft term sheet" onClose={onClose}>
      <h2 className="font-display text-xl font-semibold">Send a soft term sheet</h2>
      <p className="mt-1 text-sm text-muted">
        Non-binding. {deal.startups.name} will see it on their pitches page with your name and firm.
      </p>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="pre" className="mb-1.5 block text-sm font-medium">Pre-money ($M)</label>
            <input id="pre" type="number" min="0.1" step="any" required className="field" value={pre} onChange={(e) => setPre(e.target.value)} />
          </div>
          <div>
            <label htmlFor="check" className="mb-1.5 block text-sm font-medium">Cheque size ($M)</label>
            <input id="check" type="number" min="0.01" step="any" required className="field" value={check} onChange={(e) => setCheck(e.target.value)} />
          </div>
        </div>
        <div>
          <label htmlFor="terms" className="mb-1.5 block text-sm font-medium">Key terms (optional)</label>
          <textarea id="terms" rows={4} maxLength={2000} className="field" placeholder="Board seat, pro-rata rights, information rights…" value={terms} onChange={(e) => setTerms(e.target.value)} />
        </div>
        {error && <p role="alert" className="text-sm text-signal">{error}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm hover:bg-paper">Cancel</button>
          <button type="submit" disabled={busy} className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink-2 disabled:opacity-60">
            {busy ? "Sending…" : "Send term sheet"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function IntroModal({
  deal,
  userId,
  onClose,
  onSent,
}: {
  deal: Deal;
  userId: string;
  onClose: () => void;
  onSent: () => void;
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.from("intro_requests").insert({
      investor_id: userId,
      interrogation_id: deal.id,
      startup_id: deal.startup_id,
      message: message.trim() || null,
    });
    if (error) {
      setError(error.code === "23505" ? "You already requested an intro to this startup." : "Could not send the request. Try again.");
      setBusy(false);
      return;
    }
    onSent();
    onClose();
  }

  return (
    <Modal title="Request an intro" onClose={onClose}>
      <h2 className="font-display text-xl font-semibold">Request an intro</h2>
      <p className="mt-1 text-sm text-muted">
        {deal.startups.name} will see your request, name and firm on their pitches page.
      </p>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <div>
          <label htmlFor="msg" className="mb-1.5 block text-sm font-medium">Message (optional)</label>
          <textarea id="msg" rows={4} maxLength={1000} className="field" placeholder="What caught your attention, and what would you like to discuss?" value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
        {error && <p role="alert" className="text-sm text-signal">{error}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm hover:bg-paper">Cancel</button>
          <button type="submit" disabled={busy} className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink-2 disabled:opacity-60">
            {busy ? "Sending…" : "Send request"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
