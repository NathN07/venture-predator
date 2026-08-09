"use client";

import { motion } from "framer-motion";
import { VCVerdictResponse, StartupInfo } from "@/lib/types";

export default function TermSheet({
  startup,
  verdict,
  onRestart,
}: {
  startup: StartupInfo;
  verdict: VCVerdictResponse;
  onRestart: () => void;
}) {
  const funded = verdict.outcome === "funded";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="border border-line bg-ink p-8 sm:p-10">
        <div className="flex items-center justify-between mb-6">
          <p className="font-mono text-xs tracking-[0.3em] text-paper-dim">
            TERM SHEET — {startup.name.toUpperCase()}
          </p>
          <span
            className={`font-mono text-xs tracking-widest px-3 py-1 border ${
              funded
                ? "text-venom border-venom"
                : "text-blood border-blood"
            }`}
          >
            {funded ? "FUNDED" : "REJECTED"}
          </span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl leading-tight mb-6">
          {verdict.headline}
        </h2>

        <div className="grid grid-cols-2 gap-6 mb-8 font-mono">
          <div>
            <p className="text-[11px] tracking-widest text-paper-dim uppercase mb-1">
              Valuation
            </p>
            <p className="text-lg">{verdict.valuation}</p>
          </div>
          <div>
            <p className="text-[11px] tracking-widest text-paper-dim uppercase mb-1">
              Offer
            </p>
            <p className="text-lg">{verdict.offer}</p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-[11px] tracking-widest text-paper-dim uppercase mb-3 font-mono">
            Vesper&apos;s notes
          </p>
          <ul className="space-y-2">
            {verdict.feedback.map((f, i) => (
              <li key={i} className="text-sm leading-relaxed pl-4 border-l-2 border-line">
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-line pt-5">
          <p className="text-[11px] tracking-widest text-paper-dim uppercase mb-2 font-mono">
            Shareable
          </p>
          <p className="font-mono text-sm text-paper-dim italic">
            &ldquo;{verdict.shareText}&rdquo;
          </p>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="mt-6 px-8 py-3 border border-line text-paper font-mono text-sm tracking-widest uppercase hover:border-venom hover:text-venom transition"
      >
        Pitch again
      </button>
    </motion.div>
  );
}
