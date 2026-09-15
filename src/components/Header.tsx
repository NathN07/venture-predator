'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Volume2, VolumeX, ShieldAlert, Radio, Terminal, Compass, RefreshCw } from 'lucide-react';
import { soundEngine } from './AudioEngine';
import { dealStore } from '@/lib/dealStore';

export default function Header() {
  const pathname = usePathname();
  const [isMuted, setIsMuted] = useState(false);
  const [livePulse, setLivePulse] = useState(true);

  useEffect(() => {
    setIsMuted(soundEngine.getIsMuted());
    const interval = setInterval(() => {
      setLivePulse((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAudioToggle = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundEngine.playClick(1400);
    }
  };

  const handleReset = () => {
    soundEngine.playClick(800);
    if (confirm('Reset deal database to initial apex verified seeds?')) {
      dealStore.resetToSeeds();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1e2230] bg-[#0a0a0c]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          onClick={() => soundEngine.playClick(1000)}
          className="flex items-center gap-3 group"
        >
          <div className="relative flex items-center justify-center w-9 h-9 border border-[#ff003c] bg-[#ff003c]/10 rounded transition-all duration-300 group-hover:glow-red">
            <ShieldAlert className="w-5 h-5 text-[#ff003c] group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#ff003c] rounded-full animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-widest text-white group-hover:text-glow-red transition-all">
                VENTURE PREDATOR
              </span>
              <span className="text-[10px] uppercase font-bold text-[#ff003c] border border-[#ff003c]/40 px-1 py-0.2 rounded">
                APEX v2.4
              </span>
            </div>
            <p className="text-[10px] text-[#71717a] hidden sm:block tracking-wider">
              DUAL-PORTAL FOUNDER & VC ENGINE
            </p>
          </div>
        </Link>

        {/* Portal Nav Switcher */}
        <nav className="hidden md:flex items-center gap-1 bg-[#12141c] border border-[#232736] p-1 rounded-lg">
          <Link
            href="/portal/founder"
            onClick={() => soundEngine.playClick(1100)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold tracking-wider transition-all ${
              pathname.includes('/founder')
                ? 'bg-[#ff003c] text-white shadow-[0_0_10px_rgba(255,0,60,0.5)]'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#1a1d28]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            FOUNDER ARENA
          </Link>

          <Link
            href="/portal/vc"
            onClick={() => soundEngine.playClick(1100)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold tracking-wider transition-all ${
              pathname.includes('/vc')
                ? 'bg-[#00f0ff] text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#1a1d28]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            VC RADAR
          </Link>
        </nav>

        {/* Controls: Telemetry, Audio, Reset */}
        <div className="flex items-center gap-3">
          {/* Live Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[#0f1118] border border-[#1e2333] text-[11px]">
            <Radio
              className={`w-3.5 h-3.5 transition-colors ${
                livePulse ? 'text-[#00f0ff]' : 'text-[#71717a]'
              }`}
            />
            <span className="text-[#a1a1aa] font-mono">REALTIME:</span>
            <span className="text-[#00f0ff] font-bold tracking-wider">ARMED</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleAudioToggle}
            title={isMuted ? 'Unmute Synthesized SFX' : 'Mute SFX'}
            className={`p-2 rounded border transition-all ${
              isMuted
                ? 'border-[#27272a] text-[#71717a] hover:text-white hover:border-[#3f3f46]'
                : 'border-[#ff003c]/50 text-[#ff003c] bg-[#ff003c]/10 hover:glow-red'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Reset Seeds */}
          <button
            onClick={handleReset}
            title="Reset Seed Deals"
            className="p-2 rounded border border-[#27272a] text-[#71717a] hover:text-[#00f0ff] hover:border-[#00f0ff]/40 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="md:hidden flex border-t border-[#1e2230] bg-[#0c0d12]">
        <Link
          href="/portal/founder"
          onClick={() => soundEngine.playClick(1100)}
          className={`flex-1 py-2 text-center text-xs font-bold tracking-wider ${
            pathname.includes('/founder')
              ? 'bg-[#ff003c] text-white'
              : 'text-[#94a3b8]'
          }`}
        >
          FOUNDER ARENA
        </Link>
        <Link
          href="/portal/vc"
          onClick={() => soundEngine.playClick(1100)}
          className={`flex-1 py-2 text-center text-xs font-bold tracking-wider ${
            pathname.includes('/vc')
              ? 'bg-[#00f0ff] text-black'
              : 'text-[#94a3b8]'
          }`}
        >
          VC RADAR
        </Link>
      </div>
    </header>
  );
}
