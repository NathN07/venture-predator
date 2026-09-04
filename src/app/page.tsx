"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RadarGauge from "@/components/RadarGauge";
import PitchForm from "@/components/PitchForm";
import VCQuestionCard from "@/components/VCQuestionCard";
import TermSheet from "@/components/TermSheet";
import { playWhoosh, playTick, playFund, playPass, playHover, setMuted } from "@/lib/sounds";
import {
  StartupInfo,
  QARound,
  Metrics,
  Phase,
  VCResponse,
  VCQuestionResponse,
  VCVerdictResponse,
} from "@/lib/types";

const START_METRICS: Metrics = { hype: 40, risk: 50, vcInterest: 30 };
const TOTAL_ROUNDS = 3;

export default function Home() {
  const [phase, setPhase] = useState<Phase>("pitch");
  const [startup, setStartup] = useState<StartupInfo | null>(null);
  const [history, setHistory] = useState<QARound[]>([]);
  const [metrics, setMetrics] = useState<Metrics>(START_METRICS);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [reaction, setReaction] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<VCVerdictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [muted, setMutedState] = useState(false);

  function toggleMute() {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
  }

  function applyDeltas(deltas: Metrics) {
    playTick();
    setMetrics((m) => ({
      hype: clamp(m.hype + deltas.hype),
      risk: clamp(m.risk + deltas.risk),
      vcInterest: clamp(m.vcInterest + deltas.vcInterest),
    }));
  }

  async function callVC(startupInfo: StartupInfo, historySoFar: QARound[]) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/vc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startup: startupInfo, history: historySoFar }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "VC route failed");
      }
      const data: VCResponse = await res.json();

      applyDeltas(data.metricDeltas);

      if (data.type === "question") {
        const q = data as VCQuestionResponse;
        setCurrentQuestion(q.question);
        setReaction(q.reaction);
        setPhase("interrogating");
        playWhoosh();
      } else {
        const v = data as VCVerdictResponse;
        setVerdict(v);
        setPhase("verdict");
        if (v.outcome === "funded") playFund();
        else playPass();
      }
    } catch (err) {
      setError(
        err instanceof Error && err.message !== "VC route failed"
          ? err.message
          : "Vesper's line dropped. Try that again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handlePitchSubmit(info: StartupInfo) {
    setStartup(info);
    await callVC(info, []);
  }

  async function handleAnswer(answer: string) {
    if (!startup) return;
    const newHistory = [...history, { question: currentQuestion, answer }];
    setHistory(newHistory);
    await callVC(startup, newHistory);
  }

  function handleRestart() {
    setPhase("pitch");
    setStartup(null);
    setHistory([]);
    setMetrics(START_METRICS);
    setCurrentQuestion("");
    setReaction(null);
    setVerdict(null);
    setError(null);
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="grain" />
      <div className="ambient-glow" />

      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 px-4 sm:px-10 py-5 sm:py-6 flex flex-wrap items-center justify-between gap-3 border-b border-line"
      >
        <span className="font-display text-base sm:text-lg tracking-tight">
          VENTURE <span className="text-blood">PREDATOR</span>
        </span>
        <div className="flex items-center gap-4 sm:gap-5">
          <button
            onClick={toggleMute}
            onMouseEnter={() => playHover()}
            className="font-mono text-[10px] sm:text-[11px] tracking-widest text-paper-dim hover:text-paper uppercase transition-colors"
            aria-label={muted ? "Unmute sound" : "Mute sound"}
          >
            {muted ? "SOUND OFF" : "SOUND ON"}
          </button>
          <span className="hidden sm:inline font-mono text-[11px] tracking-widest text-paper-dim uppercase">
            Prompt Predators
          </span>
        </div>
      </motion.header>

      <main className="relative z-10 flex-1 px-4 sm:px-10 py-8 sm:py-16">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_auto] gap-16 items-start">
          <div>
            <AnimatePresence mode="wait">
              {phase === "pitch" && (
                <motion.div
                  key="pitch"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <PitchForm onSubmit={handlePitchSubmit} loading={loading} />
                </motion.div>
              )}

              {phase === "interrogating" && startup && (
                <motion.div
                  key="interrogating"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <VCQuestionCard
                    round={history.length + 1}
                    totalRounds={TOTAL_ROUNDS}
                    reaction={reaction}
                    question={currentQuestion}
                    loading={loading}
                    onAnswer={handleAnswer}
                  />
                </motion.div>
              )}

              {phase === "verdict" && startup && verdict && (
                <motion.div
                  key="verdict"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TermSheet startup={startup} verdict={verdict} onRestart={handleRestart} />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 font-mono text-xs text-blood"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {phase !== "pitch" && (
            <div className="lg:sticky lg:top-16">
              <RadarGauge metrics={metrics} thinking={loading} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, n));
}
