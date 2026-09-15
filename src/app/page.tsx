'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Skull,
  Crosshair,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldAlert,
  Terminal,
  Zap,
  Cpu,
  Lock,
} from 'lucide-react';
import CyberBackground from '@/components/CyberBackground';
import GlitchText from '@/components/GlitchText';
import Header from '@/components/Header';
import { soundEngine } from '@/components/AudioEngine';

export default function LandingPage() {
  const [tickerIndex, setTickerIndex] = useState(0);

  const mockStats = [
    { label: 'PITCHES PURGED & EATEN', value: '1,429', change: '+38 today', icon: Skull, color: '#ff003c' },
    { label: 'VERIFIED PIPELINE DEALS', value: '47', change: 'Top 3.2%', icon: ShieldAlert, color: '#00f0ff' },
    { label: 'CAPITAL COMMITTED', value: '$84.2M', change: 'Across 19 VCs', icon: TrendingUp, color: '#10b981' },
    { label: 'MEDIAN SURVIVAL HYPE', value: '88.4', change: 'Threshold 80.0', icon: Activity, color: '#f59e0b' },
  ];

  const liveTickers = [
    'ALERT: ApexSwarm received $6.0M Soft Term Sheet from Blackrock Cyber Syndicate',
    'FEED: Autonomous Drone startup "SkyRecon" EATEN in Round 2 (Unit Economics Deficit)',
    'ALERT: Synthetix Telomere Labs logged Direct Intro Request from Singularity Health Fund',
    'SYSTEM: Realtime WebSocket Channels armed across 4 global hub regions',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % liveTickers.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [liveTickers.length]);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0a0a0c] text-white overflow-hidden">
      <CyberBackground />
      <Header />

      {/* Ticker Bar */}
      <div className="relative z-10 w-full bg-[#0e1017] border-b border-[#1e2330] py-2 px-4 flex items-center justify-between text-[11px] overflow-hidden">
        <div className="flex items-center gap-2 text-[#ff003c] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#ff003c] animate-ping" />
          <span>SYS_FEED:</span>
        </div>
        <motion.div
          key={tickerIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-[#a1a1aa] font-mono truncate px-4 flex-1 text-center"
        >
          {liveTickers[tickerIndex]}
        </motion.div>
        <div className="text-[#71717a] font-mono hidden sm:block">ENCRYPTION: 4096-BIT_AES</div>
      </div>

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center justify-center">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ff003c]/40 bg-[#ff003c]/10 text-[#ff003c] text-xs font-mono tracking-widest uppercase mb-6 glow-red"
        >
          <Crosshair className="w-3.5 h-3.5 animate-spin" />
          <span>Venture Predator // Apex Capital Protocol</span>
        </motion.div>

        {/* Hero Headline */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-4">
            <GlitchText text="SURVIVE THE APEX." className="text-white" glow />
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff003c] via-[#ff2a5f] to-[#00f0ff]">
              OR BE EATEN.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
            The dual-portal marketplace where founders endure a 4-round interrogation against ruthless AI partner{' '}
            <span className="text-[#ff003c] font-bold">Vesper Prey</span>. Only verified survivors breach the{' '}
            <span className="text-[#00f0ff] font-bold">VC Terminal Radar</span>.
          </p>
        </div>

        {/* Split-Path Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-16">
          {/* Card 1: Founder Portal */}
          <Link
            href="/portal/founder"
            onMouseEnter={() => soundEngine.playClick(1400)}
            className="group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff003c] to-[#ff2a5f] rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500 group-hover:duration-200" />
            <div className="relative h-full bg-[#0e1017] border border-[#ff003c]/40 rounded-2xl p-8 flex flex-col justify-between hover:border-[#ff003c] transition-all">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-[#ff003c]/10 border border-[#ff003c]/30 rounded-xl text-[#ff003c] group-hover:scale-110 transition-transform">
                    <Terminal className="w-8 h-8" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 bg-[#ff003c]/20 text-[#ff003c] border border-[#ff003c]/40 rounded uppercase font-bold tracking-wider">
                    FOUNDER PORTAL
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-glow-red transition-all">
                  ENTER THE ARENA
                </h3>
                <p className="text-sm text-[#94a3b8] mb-6 leading-relaxed">
                  Face Vesper Prey in a brutal 4-round interrogation testing your unit economics, defensibility, and kill-shot velocity. Score 80+ to unlock verified VC deal flow.
                </p>

                <div className="space-y-2 font-mono text-xs text-[#a1a1aa] mb-6">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-[#ff003c]" />
                    <span>Live Hype & Moat telemetry gauge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skull className="w-3.5 h-3.5 text-[#ff003c]" />
                    <span>Unforgiving teardown critique if eliminated</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#1e2330] text-[#ff003c] font-bold text-sm tracking-wider">
                <span>[ COMMENCE INTERROGATION ]</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card 2: VC Radar Portal */}
          <Link
            href="/portal/vc"
            onMouseEnter={() => soundEngine.playClick(1600)}
            className="group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00f0ff] to-[#3b82f6] rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500 group-hover:duration-200" />
            <div className="relative h-full bg-[#0e1017] border border-[#00f0ff]/40 rounded-2xl p-8 flex flex-col justify-between hover:border-[#00f0ff] transition-all">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-[#00f0ff]/10 border border-[#00f0ff]/30 rounded-xl text-[#00f0ff] group-hover:scale-110 transition-transform">
                    <Cpu className="w-8 h-8" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 rounded uppercase font-bold tracking-wider">
                    VC RADAR TERMINAL
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-glow-cyan transition-all">
                  DEEP-DIVE RADAR
                </h3>
                <p className="text-sm text-[#94a3b8] mb-6 leading-relaxed">
                  Real-time live deal stream of verified high-hype startups. Read full 4-turn transcripts, analyze AI risk vectors, and issue instant Soft Term Sheets.
                </p>

                <div className="space-y-2 font-mono text-xs text-[#a1a1aa] mb-6">
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-3.5 h-3.5 text-[#00f0ff]" />
                    <span>Real-time deal flow subscriptions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#00f0ff]" />
                    <span>One-click soft term sheets & direct intros</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#1e2330] text-[#00f0ff] font-bold text-sm tracking-wider">
                <span>[ ACCESS VC TERMINAL ]</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Live Metrics Grid */}
        <div className="w-full max-w-5xl">
          <div className="text-xs uppercase font-mono text-[#71717a] tracking-widest text-center mb-4">
            NETWORK TELEMETRY STATUS // GLOBAL SUMMARY
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {mockStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#0e1017]/80 border border-[#1e2330] rounded-xl p-4 backdrop-blur-sm relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-wider">
                      {stat.label}
                    </span>
                    <Icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                  <div className="text-2xl font-extrabold text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-[11px] font-mono text-[#a1a1aa] mt-1">
                    {stat.change}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-[#1e2230] py-6 text-center text-xs text-[#52525b] font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>VENTURE PREDATOR // ENCRYPTED DUAL-PORTAL PROTOCOL</span>
          <span className="text-[#ff003c]">ZERO MERCY. MAXIMUM VELOCITY.</span>
          <span>SINGULARITY PREDATOR CAPITAL &copy; 2026</span>
        </div>
      </footer>
    </div>
  );
}
