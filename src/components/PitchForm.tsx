"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StartupInfo } from "@/lib/types";
import { playClick, playHover } from "@/lib/sounds";

const EXAMPLE_PITCHES = [
  "An app that turns your dog's bark into stock trades.",
  "Uber, but for existential dread.",
  "We use AI to optimize your optimization meetings.",
  "Airbnb for parking spots inside other parking spots.",
];

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
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % EXAMPLE_PITCHES.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const ready = name.trim() && pitch.trim().length > 10 && market.trim();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };
  const item: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  };

  return (
    <motion.form
      variants={container}
      initial="hidden"
      animate="show"
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) {
          playClick();
          onSubmit({ name, pitch, market });
        }
      }}
      className="w-full max-w-xl mx-auto"
    >
      <motion.div variants={item} className="mb-8">
        <p className="font-mono text-xs tracking-[0.3em] text-blood mb-3">
          CASE FILE — INTAKE
        </p>
        <h1 className="font-display text-4xl sm:text-6xl leading-[0.95] mb-4">
          Pitch or<br />get eaten.
        </h1>
        <p className="text-paper-dim text-sm max-w-md">
          You get one elevator pitch. Then three questions. Vesper Prey doesn&apos;t
          take notes twice.
        </p>
      </motion.div>

      <div className="space-y-5">
        <motion.div variants={item}>
          <Field label="Startup name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => playHover()}
              placeholder="e.g. Fernwave"
              className="input"
              maxLength={40}
            />
          </Field>
        </motion.div>

        <motion.div variants={item}>
          <Field label="The pitch">
            <div className="relative">
              <textarea
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                onFocus={() => playHover()}
                placeholder=""
                className="input min-h-[110px] resize-none relative z-10"
                maxLength={400}
                style={{ background: pitch ? undefined : "transparent" }}
              />
              {!pitch && (
                <div className="absolute inset-0 px-4 pt-3 pointer-events-none z-0 flex items-start">
                  <div className="bg-ink absolute inset-0" />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={placeholderIdx}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 0.55, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.4 }}
                      className="relative text-paper-dim text-[0.95rem]"
                    >
                      {EXAMPLE_PITCHES[placeholderIdx]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              )}
            </div>
          </Field>
        </motion.div>

        <motion.div variants={item}>
          <Field label="Target market">
            <input
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              onFocus={() => playHover()}
              placeholder="e.g. Mid-market logistics companies in North America"
              className="input"
              maxLength={120}
            />
          </Field>
        </motion.div>
      </div>

      <motion.button
        variants={item}
        type="submit"
        disabled={!ready || loading}
        whileHover={ready && !loading ? { scale: 1.02 } : {}}
        whileTap={ready && !loading ? { scale: 0.97 } : {}}
        onMouseEnter={() => ready && !loading && playHover()}
        className="btn-sheen mt-8 w-full sm:w-auto px-8 py-3 bg-venom text-void font-mono text-sm tracking-widest uppercase font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
      >
        {loading ? (
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            Vesper is listening…
          </motion.span>
        ) : (
          "Enter the room"
        )}
      </motion.button>
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
