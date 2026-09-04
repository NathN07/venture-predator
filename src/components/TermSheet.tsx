"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { VCVerdictResponse, StartupInfo } from "@/lib/types";

function useConfetti(count: number) {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        angle: (i / count) * 360 + Math.random() * 20,
        distance: 90 + Math.random() * 90,
        size: 4 + Math.random() * 5,
        delay: Math.random() * 0.15,
        color: [
          "var(--color-venom)",
          "var(--color-amber)",
          "var(--color-paper)",
        ][i % 3],
      })),
    [count]
  );
}

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
  const confetti = useConfetti(funded ? 22 : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={
        funded
          ? { opacity: 1, y: 0 }
          : { opacity: 1, y: 0, x: [0, -6, 6, -4, 4, 0] }
      }
      transition={{ duration: funded ? 0.5 : 0.5, x: { duration: 0.45, delay: 0.05 } }}
      className="w-full max-w-2xl mx-auto relative"
    >
      {funded && (
        <div className="absolute left-1/2 top-0 w-0 h-0 pointer-events-none">
          {confetti.map((p) => {
            const rad = (p.angle * Math.PI) / 180;
            const x = Math.cos(rad) * p.distance;
            const y = Math.sin(rad) * p.distance;
            return (
              <motion.span
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{ x, y, opacity: 0, scale: 1 }}
                transition={{ duration: 0.9, delay: p.delay, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  width: p.size,
                  height: p.size,
                  borderRadius: "50%",
                  background: p.color,
                }}
              />
            );
          })}
        </div>
      )}

      <div className="border border-line bg-ink p-8 sm:p-10">
        <div className="flex items-center justify-between mb-6">
          <p className="font-mono text-xs tracking-[0.3em] text-paper-dim">
            TERM SHEET — {startup.name.toUpperCase()}
          </p>
          <motion.span
            initial={{ scale: 0, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.2 }}
            className={`font-mono text-xs tracking-widest px-3 py-1 border ${
              funded ? "text-venom border-venom" : "text-blood border-blood"
            }`}
          >
            {funded ? "FUNDED" : "REJECTED"}
          </motion.span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl sm:text-4xl leading-tight mb-6"
        >
          {verdict.headline}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 gap-6 mb-8 font-mono"
        >
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
        </motion.div>

        <div className="mb-8">
          <p className="text-[11px] tracking-widest text-paper-dim uppercase mb-3 font-mono">
            Vesper&apos;s notes
          </p>
          <ul className="space-y-2">
            {verdict.feedback.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.12 }}
                className="text-sm leading-relaxed pl-4 border-l-2 border-line"
              >
                {f}
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 + verdict.feedback.length * 0.12 + 0.1 }}
          className="border-t border-line pt-5"
        >
          <p className="text-[11px] tracking-widest text-paper-dim uppercase mb-2 font-mono">
            Shareable
          </p>
          <p className="font-mono text-sm text-paper-dim italic">
            &ldquo;{verdict.shareText}&rdquo;
          </p>
        </motion.div>
      </div>

      <motion.button
        onClick={onRestart}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 + verdict.feedback.length * 0.12 + 0.3 }}
        className="btn-sheen mt-6 px-8 py-3 border border-line text-paper font-mono text-sm tracking-widest uppercase hover:border-venom hover:text-venom transition-colors"
      >
        Pitch again
      </motion.button>
    </motion.div>
  );
}
