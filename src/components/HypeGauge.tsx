'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { soundEngine } from './AudioEngine';
import { Shield, Flame, AlertTriangle } from 'lucide-react';

interface MetricGaugesProps {
  hypeScore: number;
  riskScore: number;
  moatScore: number;
  compact?: boolean;
}

export default function MetricGauges({
  hypeScore,
  riskScore,
  moatScore,
  compact = false,
}: MetricGaugesProps) {
  const prevHypeRef = useRef(hypeScore);

  // Framer motion springs
  const springHype = useSpring(hypeScore, { stiffness: 60, damping: 14 });
  const springRisk = useSpring(riskScore, { stiffness: 60, damping: 14 });
  const springMoat = useSpring(moatScore, { stiffness: 60, damping: 14 });

  useEffect(() => {
    springHype.set(hypeScore);
    springRisk.set(riskScore);
    springMoat.set(moatScore);

    if (hypeScore !== prevHypeRef.current) {
      soundEngine.playGauge(hypeScore - prevHypeRef.current);
      prevHypeRef.current = hypeScore;
    }
  }, [hypeScore, riskScore, moatScore, springHype, springRisk, springMoat]);

  const displayHype = useTransform(springHype, (val) => Math.round(Math.max(0, Math.min(100, val))));

  const radius = compact ? 36 : 56;
  const strokeWidth = compact ? 6 : 9;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = useTransform(springHype, (val) => {
    const clamped = Math.max(0, Math.min(100, val));
    return circumference - (clamped / 100) * circumference;
  });

  const getHypeColor = (score: number) => {
    if (score >= 80) return '#00f0ff';
    if (score >= 60) return '#ff2a5f';
    return '#ff003c';
  };

  return (
    <div
      className={`border border-[#1e2230] bg-[#0c0d12]/90 backdrop-blur-md p-4 rounded-xl relative overflow-hidden ${
        compact ? 'p-3' : 'p-5'
      }`}
    >
      {/* Subtle corner cyber markers */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#ff003c]" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#ff003c]" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#ff003c]" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#ff003c]" />

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Radial Hype Gauge */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            <svg
              width={compact ? 90 : 140}
              height={compact ? 90 : 140}
              className="transform -rotate-90"
            >
              {/* Background Track */}
              <circle
                cx={compact ? 45 : 70}
                cy={compact ? 45 : 70}
                r={radius}
                stroke="#171922"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Progress Spring */}
              <motion.circle
                cx={compact ? 45 : 70}
                cy={compact ? 45 : 70}
                r={radius}
                stroke={getHypeColor(hypeScore)}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={circumference}
                style={{ strokeDashoffset }}
                className="transition-all duration-300 drop-shadow-[0_0_8px_rgba(255,0,60,0.6)]"
              />
            </svg>

            {/* Score Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] tracking-widest text-[#71717a] font-bold flex items-center gap-1 uppercase">
                <Flame className="w-3 h-3 text-[#ff003c]" />
                Hype
              </span>
              <div className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-baseline">
                <motion.span>{displayHype}</motion.span>
                <span className="text-xs text-[#71717a] font-normal ml-0.5">/100</span>
              </div>
            </div>
          </div>

          <div className="mt-2 text-center">
            <span
              className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                hypeScore >= 80
                  ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30'
                  : hypeScore >= 50
                  ? 'bg-[#ff2a5f]/10 text-[#ff2a5f] border border-[#ff2a5f]/30'
                  : 'bg-[#ff003c]/10 text-[#ff003c] border border-[#ff003c]/30'
              }`}
            >
              {hypeScore >= 80 ? 'APEX DEAL PIPELINE' : hypeScore >= 50 ? 'CONTESTED ALPHA' : 'CRITICAL DEFICIT'}
            </span>
          </div>
        </div>

        {/* Linear Sub-Meters: Moat & Risk */}
        <div className="flex-1 w-full space-y-4">
          {/* Moat Integrity */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-[#a1a1aa] flex items-center gap-1.5 font-semibold">
                <Shield className="w-3.5 h-3.5 text-[#00f0ff]" />
                Moat Defensibility
              </span>
              <span className="text-[#00f0ff] font-bold">{moatScore}%</span>
            </div>
            <div className="w-full bg-[#171922] h-2.5 rounded-full overflow-hidden p-[1px] border border-[#232736]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#00f0ff]/60 to-[#00f0ff] rounded-full shadow-[0_0_8px_#00f0ff]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, Math.min(100, moatScore))}%` }}
                transition={{ type: 'spring', stiffness: 50, damping: 15 }}
              />
            </div>
          </div>

          {/* Risk Factor */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-[#a1a1aa] flex items-center gap-1.5 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 text-[#ff003c]" />
                Risk Factor
              </span>
              <span className="text-[#ff003c] font-bold">{riskScore}%</span>
            </div>
            <div className="w-full bg-[#171922] h-2.5 rounded-full overflow-hidden p-[1px] border border-[#232736]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#ff2a5f] to-[#ff003c] rounded-full shadow-[0_0_8px_#ff003c]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, Math.min(100, riskScore))}%` }}
                transition={{ type: 'spring', stiffness: 50, damping: 15 }}
              />
            </div>
          </div>

          {/* Real-time Indicator */}
          <div className="pt-1 flex items-center justify-between text-[11px] text-[#71717a]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
              Dynamic Bio-Metric Telemetry
            </span>
            <span className="font-mono text-[10px] text-[#52525b]">STATUS: ARMED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
