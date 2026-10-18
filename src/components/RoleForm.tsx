"use client";

import { useState } from "react";
import { setRole } from "@/app/actions";

const OPTIONS = [
  {
    value: "founder",
    title: "I'm a founder",
    body: "Submit your startup and face the four-round interrogation.",
  },
  {
    value: "investor",
    title: "I'm an investor",
    body: "Browse startups that passed, read transcripts, send term sheets.",
  },
] as const;

export function RoleForm({ current }: { current: "founder" | "investor" | null }) {
  const [role, setLocal] = useState<"founder" | "investor">(current ?? "founder");

  return (
    <form action={setRole} className="mt-8 space-y-4">
      <fieldset className="space-y-3">
        <legend className="sr-only">Choose how you will use Venture Predator</legend>
        {OPTIONS.map((o) => (
          <label
            key={o.value}
            className={`flex cursor-pointer gap-4 rounded-xl border p-4 transition ${
              role === o.value
                ? "border-ink bg-surface shadow-[0_0_0_1px_var(--color-ink)]"
                : "border-line bg-surface hover:border-ink/40"
            }`}
          >
            <input
              type="radio"
              name="role"
              value={o.value}
              checked={role === o.value}
              onChange={() => setLocal(o.value)}
              className="mt-1 accent-[var(--color-ink)]"
            />
            <span>
              <span className="block font-medium">{o.title}</span>
              <span className="mt-0.5 block text-sm text-muted">{o.body}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {role === "investor" && (
        <div>
          <label htmlFor="firm" className="mb-1.5 block text-sm font-medium">
            Firm or fund
          </label>
          <input
            id="firm"
            name="firm"
            className="field"
            placeholder="e.g. Northline Ventures (or “Angel”)"
            maxLength={80}
          />
          <p className="mt-1.5 text-xs text-muted">
            Founders see this when you send a term sheet or request an intro.
          </p>
        </div>
      )}

      <button
        type="submit"
        className="w-full rounded-lg bg-ink px-4 py-3 text-[15px] font-medium text-white transition hover:bg-ink-2"
      >
        Continue
      </button>
    </form>
  );
}
