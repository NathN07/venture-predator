"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { StartupInfo } from "@/lib/types";
import { playClick } from "@/lib/sounds";

export default function PitchForm({
  onSubmit,
  loading,
}: {
  onSubmit: (info: StartupInfo) => void;
  loading: boolean;
}) {
  const [name, setName] = useState("");
  const [pitch, setPitch] = useState("");
  const [market, setMarket] = useState("");

  const ready = name.trim() && pitch.trim().length > 10 && market.trim();

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) {
          playClick();
          onSubmit({ name, pitch, market });
        }
      }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.3em] text-blood mb-3">
          CASE FILE — INTAKE
        </p>
        <h1 className="font-display text-5xl sm:text-6xl leading-[0.95] mb-4">
          Pitch or<br />get eaten.
        </h1>
        <p className="text-paper-dim text-sm max-w-md">
          You get one elevator pitch. Then three questions. Vesper Prey doesn&apos;t
          take notes twice.
        </p>
      </div>

      <div className="space-y-5">
        <Field label="Startup name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Fernwave"
            className="input"
            maxLength={40}
          />
        </Field>

        <Field label="The pitch">
          <textarea
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            placeholder="What do you do, for whom, and why does it matter right now?"
            className="input min-h-[110px] resize-none"
            maxLength={400}
          />
        </Field>

        <Field label="Target market">
          <input
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            placeholder="e.g. Mid-market logistics companies in North America"
            className="input"
            maxLength={120}
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={!ready || loading}
        className="mt-8 w-full sm:w-auto px-8 py-3 bg-venom text-void font-mono text-sm tracking-widest uppercase font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 transition"
      >
        {loading ? "Vesper is listening…" : "Enter the room"}
      </button>
    </motion.form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block font-mono text-[11px] tracking-widest text-paper-dim mb-1.5 uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}
