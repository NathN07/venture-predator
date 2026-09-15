'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Terminal,
  Shield,
  Send,
  Skull,
  Award,
  ArrowRight,
  Flame,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import CyberBackground from '@/components/CyberBackground';
import Header from '@/components/Header';
import MetricGauges from '@/components/HypeGauge';
import FrequencyWave from '@/components/FrequencyWave';
import GlitchText from '@/components/GlitchText';
import { soundEngine } from '@/components/AudioEngine';
import { StartupCategory, InterrogationTurn, Deal } from '@/lib/types';
import { dealStore } from '@/lib/dealStore';

type PortalPhase = 'intake' | 'interrogating' | 'verdict';

const CATEGORIES: StartupCategory[] = [
  'Cyber Warfare',
  'AI Agents',
  'BioTech / Longevity',
  'Quantum Infra',
  'Autonomous Robotics',
  'FinTech / DeFi',
];

export default function FounderPortal() {
  const [phase, setPhase] = useState<PortalPhase>('intake');

  // Intake state
  const [startupName, setStartupName] = useState('');
  const [founderName, setFounderName] = useState('');
  const [founderEmail, setFounderEmail] = useState('');
  const [founderTwitter, setFounderTwitter] = useState('');
  const [category, setCategory] = useState<StartupCategory>('AI Agents');
  const [mrr, setMrr] = useState('$65,000');
  const [momGrowth, setMomGrowth] = useState('28%');
  const [activeUsers, setActiveUsers] = useState('14 Enterprise Contracts');
  const [burnRate, setBurnRate] = useState('$35,000/mo');
  const [elevatorPitch, setElevatorPitch] = useState('');

  // Interrogation state
  const [currentRound, setCurrentRound] = useState(1);
  const [hypeScore, setHypeScore] = useState(55);
  const [riskScore, setRiskScore] = useState(48);
  const [moatScore, setMoatScore] = useState(45);
  const [transcript, setTranscript] = useState<InterrogationTurn[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [founderAnswer, setFounderAnswer] = useState('');
  const [critiqueNote, setCritiqueNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verdictSummary, setVerdictSummary] = useState('');
  const [savedDealId, setSavedDealId] = useState<string | null>(null);

  const answerInputRef = useRef<HTMLTextAreaElement | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, currentQuestion, critiqueNote]);

  // Quick Preset Handlers
  const handleAutoFillWinner = () => {
    soundEngine.playClick(1300);
    setStartupName('AegisGrid Cybernetics');
    setFounderName('Dr. Cassandra Thorne');
    setFounderEmail('thorne@aegisgrid.mil');
    setFounderTwitter('@thorne_aegis');
    setCategory('Cyber Warfare');
    setMrr('$180,000');
    setMomGrowth('42%');
    setActiveUsers('12 NATO Defense Sub-Tiers');
    setBurnRate('$45,000/mo');
    setElevatorPitch(
      'Autonomous micro-agent mesh network that deploys inside SCADA critical infrastructure to intercept zero-day kinetic cyber attacks in 4.2ms without internet dependency.'
    );
  };

  const handleAutoFillFlawed = () => {
    soundEngine.playClick(900);
    setStartupName('BuzzBot Social AI');
    setFounderName('Chad Miller');
    setFounderEmail('chad@buzzbot.xyz');
    setFounderTwitter('@chadbuilds');
    setCategory('AI Agents');
    setMrr('$2,400');
    setMomGrowth('5%');
    setActiveUsers('140 Twitter Influencers');
    setBurnRate('$18,000/mo');
    setElevatorPitch(
      'An AI tool that writes viral tweets and LinkedIn posts for busy founders. We hope to add video generation soon.'
    );
  };

  // Begin Interrogation
  const handleStartInterrogation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startupName.trim() || !elevatorPitch.trim() || !founderName.trim() || !founderEmail.trim()) {
      alert('Please complete all required intake fields.');
      return;
    }

    soundEngine.playPulse();
    setPhase('interrogating');
    setIsLoading(true);
    setCurrentRound(1);
    setHypeScore(55);
    setRiskScore(48);
    setMoatScore(45);
    setTranscript([]);
    setCritiqueNote('');

    try {
      const res = await fetch('/api/interrogate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupName,
          category,
          traction: { mrr, momGrowth, activeUsers, burnRate },
          elevatorPitch,
          currentRound: 1,
          currentHypeScore: 55,
          currentRiskScore: 48,
          currentMoatScore: 45,
          founderAnswer: '',
          history: [],
        }),
      });

      const data = await res.json();
      setCurrentQuestion(data.interrogation_question || 'Vesper Prey: State your unit economics and defensibility.');
      setCritiqueNote(data.critique_note || 'Intake profile received. Commencing threat vector scan.');
      setHypeScore((prev) => Math.min(100, Math.max(0, prev + (data.hype_score_delta || 0))));
      setRiskScore((prev) => Math.min(100, Math.max(0, prev + (data.risk_factor_delta || 0))));
      setMoatScore((prev) => Math.min(100, Math.max(0, prev + (data.moat_delta || 0))));
    } catch (err) {
      console.error(err);
      setCurrentQuestion('Vesper Prey: Connection degraded, but your pitch is already under trial. Explain your CAC and burn.');
    } finally {
      setIsLoading(false);
      setTimeout(() => answerInputRef.current?.focus(), 200);
    }
  };

  // Submit Answer to Round
  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!founderAnswer.trim() || isLoading) return;

    soundEngine.playClick(1200);
    const submittedAnswer = founderAnswer.trim();
    setFounderAnswer('');
    setIsLoading(true);

    const nextRoundIndex = currentRound + 1;

    try {
      const res = await fetch('/api/interrogate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupName,
          category,
          traction: { mrr, momGrowth, activeUsers, burnRate },
          elevatorPitch,
          currentRound: nextRoundIndex,
          currentHypeScore: hypeScore,
          currentRiskScore: riskScore,
          currentMoatScore: moatScore,
          founderAnswer: submittedAnswer,
          history: transcript,
        }),
      });

      const data = await res.json();

      const newHype = Math.min(100, Math.max(0, hypeScore + (data.hype_score_delta || 0)));
      const newRisk = Math.min(100, Math.max(0, riskScore + (data.risk_factor_delta || 0)));
      const newMoat = Math.min(100, Math.max(0, moatScore + (data.moat_delta || 0)));

      setHypeScore(newHype);
      setRiskScore(newRisk);
      setMoatScore(newMoat);

      const turn: InterrogationTurn = {
        round: currentRound,
        question: currentQuestion,
        founderAnswer: submittedAnswer,
        hypeDelta: data.hype_score_delta || 0,
        riskDelta: data.risk_factor_delta || 0,
        moatDelta: data.moat_delta || 0,
        critiqueNote: data.critique_note || '',
        timestamp: 'Just now',
      };

      const updatedTranscript = [...transcript, turn];
      setTranscript(updatedTranscript);

      if (data.round_complete || currentRound >= 4) {
        // Interrogation Concluded
        setPhase('verdict');
        setVerdictSummary(data.verdict_summary || (newHype >= 80 ? 'TERM SHEET AUTHORIZED' : 'EATEN & DISCARDED'));

        if (newHype >= 80) {
          // Trigger celebration
          soundEngine.playVerdictSuccess();
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#00f0ff', '#ff003c', '#ffffff'],
          });

          // Save to Deal Pipeline
          const newDeal: Deal = {
            id: `deal-${Date.now()}`,
            startupName,
            founderName,
            founderEmail,
            founderTwitter,
            category,
            elevatorPitch,
            traction: { mrr, momGrowth, activeUsers, burnRate },
            hypeScore: newHype,
            riskScore: newRisk,
            moatScore: newMoat,
            status: 'verified',
            transcript: updatedTranscript,
            autopsyCritique: data.critique_note,
            createdAt: new Date().toISOString(),
            offers: [],
            intros: [],
          };

          await dealStore.addDeal(newDeal);
          setSavedDealId(newDeal.id);
        } else {
          soundEngine.playVerdictFail();
        }
      } else {
        // Proceed to next round
        setCurrentRound(nextRoundIndex);
        setCurrentQuestion(data.interrogation_question);
        setCritiqueNote(data.critique_note);
        soundEngine.playPulse();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setTimeout(() => answerInputRef.current?.focus(), 200);
    }
  };

  const handleResetArena = () => {
    soundEngine.playClick(1000);
    setPhase('intake');
    setSavedDealId(null);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0a0a0c] text-white">
      <CyberBackground />
      <Header />

      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Phase Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#1e2330]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#ff003c]/20 text-[#ff003c] border border-[#ff003c]/30">
                PORTAL: FOUNDER ARENA
              </span>
              <span className="text-xs text-[#71717a] font-mono">
                INTERROGATOR: VESPER PREY (GP, SINGULARITY PREDATOR)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Terminal className="w-6 h-6 text-[#ff003c]" />
              <span>THE APEX INTERROGATION ARENA</span>
            </h1>
          </div>

          {phase !== 'intake' && (
            <button
              onClick={handleResetArena}
              className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono text-[#a1a1aa] border border-[#27272a] hover:border-[#ff003c] hover:text-[#ff003c] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              ABORT & RESTART
            </button>
          )}
        </div>

        {/* ======================================================== */}
        {/* 1. INTAKE FORM PHASE                                     */}
        {/* ======================================================== */}
        {phase === 'intake' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left 2 Cols: Form */}
            <div className="lg:col-span-2 bg-[#0e1017] border border-[#1e2330] rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1e2330]">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#ff003c]" />
                    <span>STARTUP DOSSIER SUBMISSION</span>
                  </h2>
                  <p className="text-xs text-[#71717a] mt-0.5">
                    Fill truthfully. Vesper Prey analyzes metrics and shreds buzzwords.
                  </p>
                </div>

                {/* Preset Testing Helpers */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoFillWinner}
                    title="Auto-fill High-Conviction Deck"
                    className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 hover:bg-[#00f0ff]/20 transition-all"
                  >
                    + Load Apex Pitch
                  </button>
                  <button
                    type="button"
                    onClick={handleAutoFillFlawed}
                    title="Auto-fill Flawed Deck"
                    className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#ff003c]/10 text-[#ff003c] border border-[#ff003c]/30 hover:bg-[#ff003c]/20 transition-all"
                  >
                    + Load Flawed Pitch
                  </button>
                </div>
              </div>

              <form onSubmit={handleStartInterrogation} className="space-y-6">
                {/* Row 1: Startup Name & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#a1a1aa] uppercase mb-1">
                      Startup / Project Codename *
                    </label>
                    <input
                      type="text"
                      required
                      value={startupName}
                      onChange={(e) => setStartupName(e.target.value)}
                      placeholder="e.g. ApexSwarm, NeuroMatrix"
                      className="w-full bg-[#141620] border border-[#232736] focus:border-[#ff003c] focus:outline-none px-3.5 py-2.5 rounded-lg text-sm text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#a1a1aa] uppercase mb-1">
                      Target Market Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as StartupCategory)}
                      className="w-full bg-[#141620] border border-[#232736] focus:border-[#ff003c] focus:outline-none px-3.5 py-2.5 rounded-lg text-sm text-white font-mono"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Founder Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#a1a1aa] uppercase mb-1">
                      Founder Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={founderName}
                      onChange={(e) => setFounderName(e.target.value)}
                      placeholder="Dr. Elena Vance"
                      className="w-full bg-[#141620] border border-[#232736] focus:border-[#ff003c] focus:outline-none px-3.5 py-2.5 rounded-lg text-sm text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#a1a1aa] uppercase mb-1">
                      Direct Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={founderEmail}
                      onChange={(e) => setFounderEmail(e.target.value)}
                      placeholder="elena@apexswarm.io"
                      className="w-full bg-[#141620] border border-[#232736] focus:border-[#ff003c] focus:outline-none px-3.5 py-2.5 rounded-lg text-sm text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#a1a1aa] uppercase mb-1">
                      Founder Twitter / X
                    </label>
                    <input
                      type="text"
                      value={founderTwitter}
                      onChange={(e) => setFounderTwitter(e.target.value)}
                      placeholder="@vance_apex"
                      className="w-full bg-[#141620] border border-[#232736] focus:border-[#ff003c] focus:outline-none px-3.5 py-2.5 rounded-lg text-sm text-white font-mono"
                    />
                  </div>
                </div>

                {/* Row 3: Traction Grid */}
                <div>
                  <div className="text-xs font-mono text-[#a1a1aa] uppercase mb-2 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#ff003c]" />
                    <span>Real-World Traction Telemetry</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="text-[10px] text-[#71717a] font-mono block mb-1">MRR / REVENUE</span>
                      <input
                        type="text"
                        value={mrr}
                        onChange={(e) => setMrr(e.target.value)}
                        placeholder="$65,000"
                        className="w-full bg-[#141620] border border-[#232736] focus:border-[#ff003c] focus:outline-none px-2.5 py-2 rounded text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#71717a] font-mono block mb-1">MoM GROWTH</span>
                      <input
                        type="text"
                        value={momGrowth}
                        onChange={(e) => setMomGrowth(e.target.value)}
                        placeholder="28%"
                        className="w-full bg-[#141620] border border-[#232736] focus:border-[#ff003c] focus:outline-none px-2.5 py-2 rounded text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#71717a] font-mono block mb-1">ACTIVE USERS / LOGS</span>
                      <input
                        type="text"
                        value={activeUsers}
                        onChange={(e) => setActiveUsers(e.target.value)}
                        placeholder="14 Enterprise Contracts"
                        className="w-full bg-[#141620] border border-[#232736] focus:border-[#ff003c] focus:outline-none px-2.5 py-2 rounded text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#71717a] font-mono block mb-1">BURN RATE</span>
                      <input
                        type="text"
                        value={burnRate}
                        onChange={(e) => setBurnRate(e.target.value)}
                        placeholder="$35,000/mo"
                        className="w-full bg-[#141620] border border-[#232736] focus:border-[#ff003c] focus:outline-none px-2.5 py-2 rounded text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 4: Auto-Expanding Elevator Pitch (No character truncation!) */}
                <div>
                  <label className="block text-xs font-mono text-[#a1a1aa] uppercase mb-1">
                    1-Paragraph Elevator Pitch (No Word Limit) *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={elevatorPitch}
                    onChange={(e) => {
                      setElevatorPitch(e.target.value);
                      // Auto-expand height
                      e.target.style.height = 'auto';
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    placeholder="Describe your breakthrough technological wedge, customer pain, and unfair structural advantage..."
                    className="w-full bg-[#141620] border border-[#232736] focus:border-[#ff003c] focus:outline-none p-3.5 rounded-lg text-sm text-white font-mono transition-all leading-relaxed resize-y"
                  />
                  <span className="text-[10px] text-[#71717a] font-mono mt-1 block">
                    Auto-expanding buffer active. Zero character clipping.
                  </span>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff003c] to-[#ff2a5f] text-white font-bold text-sm tracking-widest uppercase hover:glow-red-lg transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,0,60,0.4)]"
                >
                  <span>[ COMMENCE 4-ROUND INTERROGATION ]</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Right Col: Tactical Rules & Threat Meter */}
            <div className="space-y-6">
              <div className="bg-[#0e1017] border border-[#1e2330] rounded-2xl p-6">
                <div className="text-xs font-mono text-[#ff003c] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Skull className="w-4 h-4 text-[#ff003c]" />
                  <span>RULES OF ENGAGEMENT</span>
                </div>

                <div className="space-y-4 text-xs text-[#94a3b8] font-mono leading-relaxed">
                  <div className="p-3 bg-[#13151f] rounded-lg border-l-2 border-[#ff003c]">
                    <span className="text-white font-bold block mb-1">1. ROUND 1: UNIT ECONOMICS</span>
                    CAC cycles, margins, and procurement bottlenecks will be scrutinized.
                  </div>

                  <div className="p-3 bg-[#13151f] rounded-lg border-l-2 border-[#ff2a5f]">
                    <span className="text-white font-bold block mb-1">2. ROUND 2: MOAT & COMMODITIZATION</span>
                    What stops Big Tech or open-source repos from copying you overnight?
                  </div>

                  <div className="p-3 bg-[#13151f] rounded-lg border-l-2 border-[#00f0ff]">
                    <span className="text-white font-bold block mb-1">3. ROUND 3: RETENTION & CHURN</span>
                    Customer concentration risks and Net Revenue Retention reality check.
                  </div>

                  <div className="p-3 bg-[#13151f] rounded-lg border-l-2 border-[#10b981]">
                    <span className="text-white font-bold block mb-1">4. ROUND 4: THE APEX KILL SHOT</span>
                    Why wire $5M today instead of letting you bleed out?
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1e2330] text-[11px] text-[#71717a] font-mono">
                  SCORE &gt;= 80 triggers instant verified insertion into the{' '}
                  <span className="text-[#00f0ff] font-bold">VC Terminal Radar</span>.
                </div>
              </div>

              {/* Preliminary Gauges Preview */}
              <MetricGauges hypeScore={hypeScore} riskScore={riskScore} moatScore={moatScore} compact />
            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* 2. LIVE INTERROGATION ARENA PHASE                        */}
        {/* ======================================================== */}
        {phase === 'interrogating' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left 2 Cols: Terminal Interrogation Console */}
            <div className="lg:col-span-2 flex flex-col bg-[#0b0c10] border border-[#ff003c]/40 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-[0_0_35px_rgba(255,0,60,0.15)]">
              {/* Top Terminal Status */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#1e2330] text-xs font-mono">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#ff003c] animate-ping" />
                  <span className="text-white font-bold tracking-wider">{startupName}</span>
                  <span className="text-[#71717a]">[{category}]</span>
                </div>

                {/* Round Badge */}
                <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#ff003c]/15 border border-[#ff003c]/40 text-[#ff003c] font-bold">
                  <span>ROUND {currentRound} / 4</span>
                </div>
              </div>

              {/* Dynamic Frequency Wave reacted by Vesper Prey */}
              <div className="mb-4 bg-[#07080b] p-2 rounded-xl border border-[#1a1c26]">
                <div className="flex items-center justify-between text-[10px] text-[#71717a] px-2 mb-1">
                  <span>VESPER PREY // NEURAL FREQUENCY WAVE</span>
                  <span className="text-[#ff003c]">{isLoading ? 'ANALYZING THREAT...' : 'READY FOR RESPONSE'}</span>
                </div>
                <FrequencyWave isActive={isLoading || Boolean(currentQuestion)} intensity={isLoading ? 'high' : 'medium'} />
              </div>

              {/* Scrollable Conversation Transcript Area */}
              <div className="flex-1 min-h-[320px] max-h-[460px] overflow-y-auto space-y-4 pr-2 mb-6 font-mono">
                {/* Past Rounds */}
                {transcript.map((item, idx) => (
                  <div key={idx} className="space-y-2 text-xs">
                    {/* Interrogator Question */}
                    <div className="bg-[#12141c] border-l-2 border-[#ff003c] p-3.5 rounded-r-lg">
                      <div className="text-[#ff003c] font-bold text-[10px] uppercase mb-1">
                        ROUND {item.round} // VESPER PREY:
                      </div>
                      <p className="text-white leading-relaxed">{item.question}</p>
                    </div>

                    {/* Founder Answer */}
                    <div className="bg-[#181a24] border-l-2 border-[#00f0ff] p-3.5 rounded-r-lg ml-4">
                      <div className="text-[#00f0ff] font-bold text-[10px] uppercase mb-1">
                        FOUNDER DEFENSE:
                      </div>
                      <p className="text-[#e2e8f0] leading-relaxed">{item.founderAnswer}</p>
                    </div>

                    {/* Critique Note & Deltas */}
                    <div className="bg-[#0e1017] p-2.5 rounded border border-[#1e2330] text-[11px] ml-4 flex items-center justify-between">
                      <span className="text-[#a1a1aa] italic">&quot;{item.critiqueNote}&quot;</span>
                      <div className="flex items-center gap-3 font-mono font-bold">
                        <span className={item.hypeDelta >= 0 ? 'text-[#00f0ff]' : 'text-[#ff003c]'}>
                          Hype: {item.hypeDelta >= 0 ? `+${item.hypeDelta}` : item.hypeDelta}
                        </span>
                        <span className={item.moatDelta >= 0 ? 'text-[#00f0ff]' : 'text-[#ff003c]'}>
                          Moat: {item.moatDelta >= 0 ? `+${item.moatDelta}` : item.moatDelta}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Current Active Question */}
                <div className="bg-[#151722] border-l-4 border-[#ff003c] p-4 rounded-r-xl glow-red">
                  <div className="text-[#ff003c] font-extrabold text-xs uppercase mb-1 flex items-center gap-2">
                    <Skull className="w-3.5 h-3.5" />
                    <span>ROUND {currentRound} // VESPER PREY ASKS:</span>
                  </div>
                  <p className="text-white text-sm font-semibold leading-relaxed">
                    {currentQuestion}
                  </p>
                </div>

                {/* Current Critique Note */}
                {critiqueNote && (
                  <div className="p-3 bg-[#0f1118] border border-[#252a3a] rounded-lg text-xs text-[#a1a1aa] font-mono">
                    <span className="text-[#00f0ff] font-bold uppercase mr-2">[ANALYSIS]:</span>
                    {critiqueNote}
                  </div>
                )}

                <div ref={transcriptEndRef} />
              </div>

              {/* Founder Response Input */}
              <form onSubmit={handleSubmitAnswer} className="space-y-3">
                <div className="relative">
                  <textarea
                    ref={answerInputRef}
                    required
                    disabled={isLoading}
                    rows={3}
                    value={founderAnswer}
                    onChange={(e) => {
                      setFounderAnswer(e.target.value);
                      // auto-expand
                      e.target.style.height = 'auto';
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    placeholder={
                      isLoading
                        ? 'Vesper Prey is calculating your mortality...'
                        : 'Deploy your defense. Cite concrete metrics, architectural barriers, and retention proof...'
                    }
                    className="w-full bg-[#12141d] border border-[#252a3a] focus:border-[#00f0ff] focus:outline-none p-3.5 rounded-xl text-xs sm:text-sm text-white font-mono resize-y"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#71717a] font-mono">
                    Press <kbd className="px-1.5 py-0.5 bg-[#1e2330] rounded text-white">SUBMIT</kbd> to transmit defense
                  </span>

                  <button
                    type="submit"
                    disabled={isLoading || !founderAnswer.trim()}
                    className={`px-6 py-3 rounded-xl font-mono text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-all ${
                      isLoading || !founderAnswer.trim()
                        ? 'bg-[#181a24] text-[#52525b] cursor-not-allowed border border-[#232736]'
                        : 'bg-[#00f0ff] text-black hover:glow-cyan shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>PROCESSING...</span>
                      </>
                    ) : (
                      <>
                        <span>TRANSMIT DEFENSE</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Col: Live Springs Metric Gauges */}
            <div className="space-y-6">
              <div className="text-xs font-mono text-[#a1a1aa] uppercase tracking-wider flex items-center justify-between">
                <span>LIVE TELEMETRY GAUGE</span>
                <span className="text-[#00f0ff]">ROUND {currentRound}/4</span>
              </div>

              <MetricGauges
                hypeScore={hypeScore}
                riskScore={riskScore}
                moatScore={moatScore}
              />

              {/* Traction Recap Card */}
              <div className="bg-[#0e1017] border border-[#1e2330] rounded-xl p-4 font-mono text-xs space-y-2">
                <div className="text-[#71717a] uppercase text-[10px] tracking-wider mb-2">
                  CLAIMED TRACTION METRICS
                </div>
                <div className="flex justify-between py-1 border-b border-[#181a24]">
                  <span className="text-[#a1a1aa]">MRR</span>
                  <span className="text-white font-bold">{mrr}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#181a24]">
                  <span className="text-[#a1a1aa]">MoM Growth</span>
                  <span className="text-[#10b981] font-bold">{momGrowth}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#181a24]">
                  <span className="text-[#a1a1aa]">Burn Rate</span>
                  <span className="text-[#ff003c] font-bold">{burnRate}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#a1a1aa]">Active Users</span>
                  <span className="text-white font-bold">{activeUsers}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* 3. VERDICT REVEAL PHASE                                  */}
        {/* ======================================================== */}
        {phase === 'verdict' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
          >
            {hypeScore >= 80 ? (
              // WINNER VERDICT: TERM SHEET ISSUED // VERIFIED PIPELINE
              <div className="bg-[#0b0f14] border-2 border-[#00f0ff] rounded-2xl p-8 sm:p-10 shadow-[0_0_50px_rgba(0,240,255,0.3)] relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00f0ff] via-white to-[#00f0ff]" />

                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff] mb-6 glow-cyan">
                  <Award className="w-10 h-10" />
                </div>

                <div className="text-xs font-mono tracking-widest text-[#00f0ff] uppercase mb-2">
                  VERIFICATION AUTHORIZED // ROUNDS COMPLETED
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                  <GlitchText text="TERM SHEET ISSUED" className="text-[#00f0ff]" />
                </h2>

                <p className="text-sm text-[#cbd5e1] font-mono max-w-xl mx-auto mb-8 leading-relaxed">
                  {verdictSummary ||
                    `Congratulations. Vesper Prey and Singularity Predator Capital have certified ${startupName}. Your deal profile has been deployed to the live VC Terminal Radar.`}
                </p>

                {/* Metrics Pill Row */}
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8 font-mono">
                  <div className="p-3 bg-[#131722] border border-[#1e2330] rounded-xl">
                    <span className="text-[10px] text-[#71717a] block">FINAL HYPE</span>
                    <span className="text-2xl font-extrabold text-[#00f0ff]">{hypeScore}</span>
                  </div>
                  <div className="p-3 bg-[#131722] border border-[#1e2330] rounded-xl">
                    <span className="text-[10px] text-[#71717a] block">MOAT SCORE</span>
                    <span className="text-2xl font-extrabold text-[#10b981]">{moatScore}%</span>
                  </div>
                  <div className="p-3 bg-[#131722] border border-[#1e2330] rounded-xl">
                    <span className="text-[10px] text-[#71717a] block">RISK FACTOR</span>
                    <span className="text-2xl font-extrabold text-[#ff003c]">{riskScore}%</span>
                  </div>
                </div>

                {/* Direct Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/portal/vc"
                    onClick={() => soundEngine.playClick(1400)}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#00f0ff] text-black font-bold text-xs font-mono tracking-widest uppercase hover:glow-cyan transition-all flex items-center justify-center gap-2"
                  >
                    <span>VIEW LIVE ON VC RADAR</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={handleResetArena}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#141822] text-[#94a3b8] hover:text-white font-mono text-xs border border-[#232736] hover:border-[#00f0ff]/40 transition-all"
                  >
                    INTERROGATE ANOTHER VENTURE
                  </button>
                </div>
              </div>
            ) : (
              // LOSER VERDICT: EATEN & DISCARDED // BRUTAL AUTOPSY
              <div className="bg-[#12080a] border-2 border-[#ff003c] rounded-2xl p-8 sm:p-10 shadow-[0_0_50px_rgba(255,0,60,0.35)] relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#ff003c]" />

                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#ff003c]/10 border border-[#ff003c]/40 text-[#ff003c] mb-6 glow-red">
                  <Skull className="w-10 h-10" />
                </div>

                <div className="text-xs font-mono tracking-widest text-[#ff003c] uppercase mb-2">
                  VERDICT FAILED // SUB-THRESHOLD
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                  <GlitchText text="EATEN & DISCARDED" className="text-[#ff003c]" />
                </h2>

                <p className="text-sm text-[#f87171] font-mono max-w-xl mx-auto mb-6 leading-relaxed">
                  {verdictSummary ||
                    `${startupName} failed to reach the required 80.0 Hype Score threshold. Your venture has been dissolved in Vesper Prey's acid bath.`}
                </p>

                {/* Autopsy Card */}
                <div className="bg-[#1a0c10] border border-[#ff003c]/30 rounded-xl p-5 text-left mb-8 font-mono text-xs">
                  <div className="text-[#ff003c] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>VESPER PREY&apos;S AUTOPSY REPORT:</span>
                  </div>
                  <p className="text-[#cbd5e1] leading-relaxed mb-3">
                    &quot;{critiqueNote || 'Your unit economics crumble upon the slightest examination. You cannot defend against Big Tech copying with thin wrapper wrappers.'}&quot;
                  </p>
                  <div className="text-[11px] text-[#71717a]">
                    Required: 80.0 Hype Score | Your Output: {hypeScore}.0 (-{80 - hypeScore} Deficit)
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={handleResetArena}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#ff003c] text-white font-bold text-xs font-mono tracking-widest uppercase hover:glow-red transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>RETRY AFTER COOLDOWN</span>
                  </button>

                  <Link
                    href="/portal/vc"
                    onClick={() => soundEngine.playClick(1100)}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#181115] text-[#94a3b8] hover:text-white font-mono text-xs border border-[#2b1820] hover:border-[#ff003c]/40 transition-all"
                  >
                    INSPECT SURVIVING VC DEALS
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
