'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, CheckCircle2, DollarSign, ShieldAlert, Sparkles } from 'lucide-react';
import { Deal, DealOffer } from '@/lib/types';
import { dealStore } from '@/lib/dealStore';
import { soundEngine } from './AudioEngine';

interface TermSheetModalProps {
  deal: Deal;
  isOpen: boolean;
  onClose: () => void;
  onOfferSubmitted: (offer: DealOffer) => void;
}

export default function TermSheetModal({
  deal,
  isOpen,
  onClose,
  onOfferSubmitted,
}: TermSheetModalProps) {
  const [vcName, setVcName] = useState('Alexander Vance');
  const [vcEmail, setVcEmail] = useState('vance@cyberpredator.fund');
  const [firmName, setFirmName] = useState('Singularity Predator Capital');
  const [valuationMillions, setValuationMillions] = useState('25.0');
  const [checkSizeMillions, setCheckSizeMillions] = useState('3.5');
  const [covenants, setCovenants] = useState(
    'Pro-rata rights, 1 Class A Preferred Board Seat, 1x Non-Participating Liquidation Preference, Major Investor Information Rights.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    soundEngine.playPulse();

    const offer: DealOffer = {
      id: `offer-${Date.now()}`,
      dealId: deal.id,
      vcName,
      vcEmail,
      firmName,
      valuationMillions: parseFloat(valuationMillions) || 20,
      checkSizeMillions: parseFloat(checkSizeMillions) || 2.5,
      covenants,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await dealStore.addOffer(offer);
    soundEngine.playVerdictSuccess();
    setSuccess(true);
    setIsSubmitting(false);

    setTimeout(() => {
      onOfferSubmitted(offer);
      setSuccess(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-xl bg-[#0d0f16] border border-[#00f0ff]/50 rounded-2xl p-6 sm:p-8 relative shadow-[0_0_50px_rgba(0,240,255,0.2)] font-mono text-white overflow-hidden"
      >
        {/* Top Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00f0ff] via-white to-[#00f0ff]" />

        {/* Close button */}
        <button
          onClick={() => {
            soundEngine.playClick(900);
            onClose();
          }}
          className="absolute top-5 right-5 text-[#71717a] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff] text-[#00f0ff] flex items-center justify-center mx-auto glow-cyan">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">SOFT TERM SHEET ISSUED</h3>
            <p className="text-xs text-[#a1a1aa] max-w-md mx-auto">
              Offer of ${checkSizeMillions}M on ${valuationMillions}M valuation transmitted to{' '}
              <span className="text-[#00f0ff]">{deal.founderEmail}</span> and logged in the deal pipeline.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2 text-[#00f0ff] text-xs uppercase font-bold tracking-widest">
              <FileText className="w-4 h-4" />
              <span>CAPITAL ALLOCATION PROTOCOL</span>
            </div>

            <h2 className="text-xl font-bold text-white mb-1">
              ISSUE SOFT TERM SHEET // {deal.startupName}
            </h2>
            <p className="text-xs text-[#71717a] mb-6">
              Lock in early allocation rights before competitive syndicated bidding commences.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a1a1aa] mb-1">VC / PARTNER NAME</label>
                  <input
                    type="text"
                    required
                    value={vcName}
                    onChange={(e) => setVcName(e.target.value)}
                    className="w-full bg-[#141724] border border-[#262c3e] focus:border-[#00f0ff] focus:outline-none p-2.5 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#a1a1aa] mb-1">FIRM / SYNDICATE</label>
                  <input
                    type="text"
                    required
                    value={firmName}
                    onChange={(e) => setFirmName(e.target.value)}
                    className="w-full bg-[#141724] border border-[#262c3e] focus:border-[#00f0ff] focus:outline-none p-2.5 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#a1a1aa] mb-1">DIRECT VC EMAIL</label>
                <input
                  type="email"
                  required
                  value={vcEmail}
                  onChange={(e) => setVcEmail(e.target.value)}
                  className="w-full bg-[#141724] border border-[#262c3e] focus:border-[#00f0ff] focus:outline-none p-2.5 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a1a1aa] mb-1 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-[#00f0ff]" />
                    <span>PRE-MONEY VALUATION ($M)</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={valuationMillions}
                    onChange={(e) => setValuationMillions(e.target.value)}
                    className="w-full bg-[#141724] border border-[#262c3e] focus:border-[#00f0ff] focus:outline-none p-2.5 rounded-lg text-white text-base font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[#a1a1aa] mb-1 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-[#10b981]" />
                    <span>PROPOSED CHECK SIZE ($M)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={checkSizeMillions}
                    onChange={(e) => setCheckSizeMillions(e.target.value)}
                    className="w-full bg-[#141724] border border-[#262c3e] focus:border-[#00f0ff] focus:outline-none p-2.5 rounded-lg text-white text-base font-bold text-[#10b981]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#a1a1aa] mb-1">COVENANTS & KEY TERMS</label>
                <textarea
                  rows={3}
                  value={covenants}
                  onChange={(e) => setCovenants(e.target.value)}
                  className="w-full bg-[#141724] border border-[#262c3e] focus:border-[#00f0ff] focus:outline-none p-2.5 rounded-lg text-white resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#00f0ff] text-black font-bold text-xs tracking-widest uppercase hover:glow-cyan transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>AUTHORIZING CRYPTOGRAPHIC OFFER...</span>
                  ) : (
                    <>
                      <span>TRANSMIT FORMAL SOFT TERM SHEET</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
