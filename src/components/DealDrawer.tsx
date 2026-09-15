'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileText,
  Mail,
  Shield,
  Flame,
  AlertTriangle,
  ExternalLink,
  DollarSign,
  Send,
  User,
  AtSign,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Deal, DealOffer, DirectIntroRequest } from '@/lib/types';
import MetricGauges from './HypeGauge';
import TermSheetModal from './TermSheetModal';
import DirectIntroModal from './DirectIntroModal';
import { soundEngine } from './AudioEngine';

interface DealDrawerProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateDeal: (updated: Deal) => void;
}

export default function DealDrawer({
  deal,
  isOpen,
  onClose,
  onUpdateDeal,
}: DealDrawerProps) {
  const [isTermSheetOpen, setIsTermSheetOpen] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(false);

  if (!isOpen || !deal) return null;

  const handleOfferSubmitted = (offer: DealOffer) => {
    const updated: Deal = {
      ...deal,
      offers: [...(deal.offers || []), offer],
    };
    onUpdateDeal(updated);
  };

  const handleIntroRequested = (intro: DirectIntroRequest) => {
    const updated: Deal = {
      ...deal,
      intros: [...(deal.intros || []), intro],
    };
    onUpdateDeal(updated);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 z-50 h-full w-full max-w-2xl bg-[#0d0f16] border-l border-[#1e2330] shadow-2xl flex flex-col font-mono text-white overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#1e2330] bg-[#11131c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-widest ${
                deal.hypeScore >= 80
                  ? 'bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/30'
                  : 'bg-[#ff003c]/15 text-[#ff003c] border border-[#ff003c]/30'
              }`}
            >
              {deal.status === 'verified' ? 'VERIFIED APEX DEAL' : 'ARCHIVED'}
            </span>
            <span className="text-xs text-[#71717a]">[{deal.category}]</span>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick(900);
              onClose();
            }}
            className="p-1.5 rounded-lg border border-[#27272a] text-[#71717a] hover:text-white hover:border-[#3f3f46] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title & Elevator Pitch */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
              {deal.startupName}
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed bg-[#131622] p-4 rounded-xl border border-[#1e2330]">
              {deal.elevatorPitch}
            </p>
          </div>

          {/* Realtime Spring Metric Gauges */}
          <div>
            <div className="text-[11px] text-[#71717a] uppercase tracking-wider mb-2">
              ALGORITHMIC TELEMETRY RATINGS
            </div>
            <MetricGauges
              hypeScore={deal.hypeScore}
              riskScore={deal.riskScore}
              moatScore={deal.moatScore}
            />
          </div>

          {/* Traction Matrix */}
          <div>
            <div className="text-[11px] text-[#71717a] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#ff003c]" />
              <span>VERIFIED TRACTION METRICS</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#131622] border border-[#1e2330] rounded-xl">
                <span className="text-[10px] text-[#71717a] block">MRR</span>
                <span className="text-sm font-bold text-white">{deal.traction.mrr}</span>
              </div>
              <div className="p-3 bg-[#131622] border border-[#1e2330] rounded-xl">
                <span className="text-[10px] text-[#71717a] block">MoM GROWTH</span>
                <span className="text-sm font-bold text-[#10b981]">{deal.traction.momGrowth}</span>
              </div>
              <div className="p-3 bg-[#131622] border border-[#1e2330] rounded-xl">
                <span className="text-[10px] text-[#71717a] block">ACTIVE USERS</span>
                <span className="text-sm font-bold text-white">{deal.traction.activeUsers}</span>
              </div>
              <div className="p-3 bg-[#131622] border border-[#1e2330] rounded-xl">
                <span className="text-[10px] text-[#71717a] block">BURN RATE</span>
                <span className="text-sm font-bold text-[#ff003c]">{deal.traction.burnRate}</span>
              </div>
            </div>
          </div>

          {/* Full Interrogation Transcript */}
          <div>
            <div className="text-[11px] text-[#71717a] uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>VESPER PREY INTERROGATION TRANSCRIPT</span>
              <span className="text-[#00f0ff]">{deal.transcript.length} ROUNDS RECORDED</span>
            </div>

            {deal.transcript.length === 0 ? (
              <div className="p-4 bg-[#131622] rounded-xl border border-[#1e2330] text-xs text-[#71717a]">
                Direct venture submission without archived transcript logs.
              </div>
            ) : (
              <div className="space-y-4">
                {deal.transcript.map((item, idx) => (
                  <div key={idx} className="bg-[#121520] border border-[#1e2330] rounded-xl p-4 text-xs space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-[#ff003c] uppercase font-bold">
                      <span>ROUND {item.round} // VESPER PREY:</span>
                      <span className="text-[#71717a]">{item.timestamp}</span>
                    </div>
                    <p className="text-white">{item.question}</p>

                    <div className="bg-[#181b28] p-3 rounded-lg border-l-2 border-[#00f0ff] mt-2">
                      <div className="text-[#00f0ff] text-[10px] uppercase font-bold mb-1">
                        FOUNDER DEFENSE:
                      </div>
                      <p className="text-[#cbd5e1]">{item.founderAnswer || '(Answer Recorded in Log)'}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[10px] text-[#71717a] border-t border-[#1a1e2c]">
                      <span className="italic">&quot;{item.critiqueNote}&quot;</span>
                      <span className="text-[#00f0ff] font-bold">HYPE DELTA: +{item.hypeDelta}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Existing Offers Stream */}
          {deal.offers && deal.offers.length > 0 && (
            <div>
              <div className="text-[11px] text-[#71717a] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#10b981]" />
                <span>PENDING SOFT TERM SHEETS ({deal.offers.length})</span>
              </div>
              <div className="space-y-2">
                {deal.offers.map((offer, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#101918] border border-[#10b981]/30 rounded-xl text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{offer.firmName}</span>
                        <span className="text-[10px] text-[#10b981] font-normal">
                          (${offer.checkSizeMillions}M on ${offer.valuationMillions}M)
                        </span>
                      </div>
                      <p className="text-[10px] text-[#94a3b8] mt-0.5">{offer.covenants}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#10b981]/20 text-[#10b981] font-bold uppercase">
                      ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Founder Contact Card */}
          <div className="bg-[#111420] border border-[#1e2330] rounded-xl p-4 text-xs space-y-2">
            <div className="text-[#71717a] uppercase text-[10px] tracking-wider mb-2">
              FOUNDER CONTACT DOSSIER
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#a1a1aa] flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#ff003c]" />
                {deal.founderName}
              </span>
              <a
                href={`mailto:${deal.founderEmail}`}
                className="text-[#00f0ff] hover:underline flex items-center gap-1"
              >
                <Mail className="w-3 h-3" />
                {deal.founderEmail}
              </a>
            </div>
            {deal.founderTwitter && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-[#a1a1aa] flex items-center gap-2">
                  <AtSign className="w-3.5 h-3.5 text-[#00f0ff]" />
                  Handle
                </span>
                <span className="text-white font-mono">{deal.founderTwitter}</span>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-6 border-t border-[#1e2330] bg-[#11131c] flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              soundEngine.playClick(1100);
              setIsIntroOpen(true);
            }}
            className="flex-1 py-3 px-4 rounded-xl border border-[#ff003c]/40 text-[#ff003c] bg-[#ff003c]/10 hover:bg-[#ff003c]/20 hover:glow-red transition-all font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span>REQUEST DIRECT INTRO</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick(1400);
              setIsTermSheetOpen(true);
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-[#00f0ff] text-black font-bold text-xs tracking-wider uppercase hover:glow-cyan transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            <DollarSign className="w-4 h-4" />
            <span>ISSUE SOFT TERM SHEET</span>
          </button>
        </div>
      </motion.aside>

      {/* Nested Modals */}
      <TermSheetModal
        deal={deal}
        isOpen={isTermSheetOpen}
        onClose={() => setIsTermSheetOpen(false)}
        onOfferSubmitted={handleOfferSubmitted}
      />

      <DirectIntroModal
        deal={deal}
        isOpen={isIntroOpen}
        onClose={() => setIsIntroOpen(false)}
        onIntroRequested={handleIntroRequested}
      />
    </>
  );
}
