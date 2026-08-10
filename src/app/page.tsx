"use client";

import { useState } from "react";
import RadarGauge from "@/components/RadarGauge";
import PitchForm from "@/components/PitchForm";
import VCQuestionCard from "@/components/VCQuestionCard";
import TermSheet from "@/components/TermSheet";
import { playWhoosh, playTick, playFund, playPass, setMuted } from "@/lib/sounds";
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
      setError(err instanceof Error && err.message !== "VC route failed" ? err.message : "Vesper's line dropped. Try that again.");
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
    <div className="min-h-screen flex flex-col">
      <div className="grain" />

      <header className="px-4 sm:px-10 py-5 sm:py-6 flex flex-wrap items-center justify-between gap-3 border-b border-line">
        <span className="font-display text-base sm:text-lg tracking-tight">
          VENTURE <span className="text-blood">PREDATOR</span>
        </span>
        <div className="flex items-center gap-4 sm:gap-5">
          <button
            onClick={toggleMute}
            className="font-mono text-[10px] sm:text-[11px] tracking-widest text-paper-dim hover:text-paper uppercase transition"
            aria-label={muted ? "Unmute sound" : "Mute sound"}
          >
            {muted ? "SOUND OFF" : "SOUND ON"}
          </button>
          <span className="hidden sm:inline font-mono text-[11px] tracking-widest text-paper-dim uppercase">
            Prompt Predators
          </span>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-10 py-8 sm:py-16">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_auto] gap-16 items-start">
          <div>
            {phase === "pitch" && (
              <PitchForm onSubmit={handlePitchSubmit} loading={loading} />
            )}

            {phase === "interrogating" && startup && (
              <VCQuestionCard
                round={history.length + 1}
                totalRounds={TOTAL_ROUNDS}
                reaction={reaction}
                question={currentQuestion}
                loading={loading}
                onAnswer={handleAnswer}
              />
            )}

            {phase === "verdict" && startup && verdict && (
              <TermSheet startup={startup} verdict={verdict} onRestart={handleRestart} />
            )}

            {error && (
              <p className="mt-4 font-mono text-xs text-blood">{error}</p>
            )}
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
