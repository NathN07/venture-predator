"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VCQuestionCard({
  round,
  totalRounds,
  reaction,
  question,
  loading,
  onAnswer,
}: {
  round: number;
  totalRounds: number;
  reaction: string | null;
  question: string;
  loading: boolean;
  onAnswer: (answer: string) => void;
}) {
  const [answer, setAnswer] = useState("");

  return (
    <div className="w-full max-w-xl mx-auto">
      <p className="font-mono text-xs tracking-[0.3em] text-blood mb-4">
        ROUND {round} / {totalRounds}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={question}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
        >
          {reaction && (
            <p className="font-mono text-sm text-paper-dim italic mb-4">
              &ldquo;{reaction}&rdquo;
            </p>
          )}
          <h2 className="font-display text-3xl sm:text-4xl leading-tight mb-6">
            {question}
          </h2>
        </motion.div>
      </AnimatePresence>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Answer straight. Vagueness reads as weakness."
        className="input min-h-[110px] resize-none"
        maxLength={500}
        disabled={loading}
      />

      <button
        onClick={() => {
          if (answer.trim().length > 2) {
            onAnswer(answer.trim());
            setAnswer("");
          }
        }}
        disabled={loading || answer.trim().length < 3}
        className="mt-4 px-8 py-3 bg-amber text-void font-mono text-sm tracking-widest uppercase font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 transition"
      >
        {loading ? "Vesper is deciding…" : "Answer"}
      </button>
    </div>
  );
}
