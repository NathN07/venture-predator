"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playClick, playHover } from "@/lib/sounds";

function useTypewriter(text: string, speedMs = 14) {
  const [shown, setShown] = useState("");
  const idxRef = useRef(0);

  useEffect(() => {
    setShown("");
    idxRef.current = 0;
    const id = setInterval(() => {
      idxRef.current += 1;
      setShown(text.slice(0, idxRef.current));
      if (idxRef.current >= text.length) clearInterval(id);
    }, speedMs);
    return () => clearInterval(id);
  }, [text, speedMs]);

  return shown;
}

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
  const typedQuestion = useTypewriter(question, 12);
  const isTyping = typedQuestion.length < question.length;

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <p className="font-mono text-xs tracking-[0.3em] text-blood">
          ROUND {round} / {totalRounds}
        </p>
        <div className="flex gap-1.5 ml-1">
          {Array.from({ length: totalRounds }).map((_, i) => (
            <motion.span
              key={i}
              className="block w-1.5 h-1.5 rounded-full"
              animate={{
                backgroundColor: i < round ? "#e8394a" : "rgba(236,231,219,0.18)",
                scale: i === round - 1 ? 1.3 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
        >
          {reaction && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="font-mono text-sm text-paper-dim italic mb-4"
            >
              &ldquo;{reaction}&rdquo;
            </motion.p>
          )}
          <h2 className="font-display text-3xl sm:text-4xl leading-tight mb-6 min-h-[2.5em]">
            {typedQuestion}
            {isTyping && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="inline-block w-[3px] h-[0.9em] bg-venom ml-1 align-middle"
              />
            )}
          </h2>
        </motion.div>
      </AnimatePresence>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onFocus={() => playHover()}
        placeholder="Answer straight. Vagueness reads as weakness."
        className="input min-h-[110px] resize-none"
        maxLength={500}
        disabled={loading}
      />

      <motion.button
        onClick={() => {
          if (answer.trim().length > 2) {
            playClick();
            onAnswer(answer.trim());
            setAnswer("");
          }
        }}
        disabled={loading || answer.trim().length < 3}
        whileHover={!loading && answer.trim().length >= 3 ? { scale: 1.02 } : {}}
        whileTap={!loading && answer.trim().length >= 3 ? { scale: 0.97 } : {}}
        onMouseEnter={() => !loading && answer.trim().length >= 3 && playHover()}
        className="btn-sheen mt-4 px-8 py-3 bg-amber text-void font-mono text-sm tracking-widest uppercase font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
      >
        {loading ? (
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            Vesper is deciding…
          </motion.span>
        ) : (
          "Answer"
        )}
      </motion.button>
    </div>
  );
}
