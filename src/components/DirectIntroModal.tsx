'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, CheckCircle2, Send, Sparkles } from 'lucide-react';
import { Deal, DirectIntroRequest } from '@/lib/types';
import { dealStore } from '@/lib/dealStore';
import { soundEngine } from './AudioEngine';

interface DirectIntroModalProps {
  deal: Deal;
  isOpen: boolean;
  onClose: () => void;
  onIntroRequested: (intro: DirectIntroRequest) => void;
}

export default function DirectIntroModal({
  deal,
  isOpen,
  onClose,
  onIntroRequested,
}: DirectIntroModalProps) {
  const [vcName, setVcName] = useState('Sarah Jenkins');
  const [vcEmail, setVcEmail] = useState('sarah@apex-syndicate.vc');
  const [firmName, setFirmName] = useState('Apex Horizon Ventures');
  const [thesisMatchNote, setThesisMatchNote] = useState(
    `We lead early-stage rounds in ${deal.category}. Your 4-round interrogation demonstrated rare unit economics and defensibility. We would like to schedule a 30-minute partner intro this week.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    soundEngine.playPulse();

    const intro: DirectIntroRequest = {
      id: `intro-${Date.now()}`,
      dealId: deal.id,
      vcName,
      vcEmail,
      firmName,
      thesisMatchNote,
      createdAt: new Date().toISOString(),
    };

    await dealStore.addDirectIntro(intro);
    soundEngine.playVerdictSuccess();
    setSuccess(true);
    setIsSubmitting(false);

    setTimeout(() => {
      onIntroRequested(intro);
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
        className="w-full max-w-lg bg-[#0d0f16] border border-[#ff003c]/40 rounded-2xl p-6 sm:p-8 relative shadow-[0_0_50px_rgba(255,0,60,0.2)] font-mono text-white overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#ff003c]" />

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
            <div className="w-16 h-16 rounded-full bg-[#ff003c]/15 border border-[#ff003c] text-[#ff003c] flex items-center justify-center mx-auto glow-red">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">DIRECT INTRO DISPATCHED</h3>
            <p className="text-xs text-[#a1a1aa] max-w-md mx-auto">
              High-priority intro routing sent directly to {deal.founderName} ({deal.founderEmail}).
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2 text-[#ff003c] text-xs uppercase font-bold tracking-widest">
              <Mail className="w-4 h-4" />
              <span>HIGH-PRIORITY ROUTING</span>
            </div>

            <h2 className="text-xl font-bold text-white mb-1">
              REQUEST DIRECT INTRO // {deal.startupName}
            </h2>
            <p className="text-xs text-[#71717a] mb-6">
              Connect directly with {deal.founderName} with zero broker drag.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a1a1aa] mb-1">YOUR NAME</label>
                  <input
                    type="text"
                    required
                    value={vcName}
                    onChange={(e) => setVcName(e.target.value)}
                    className="w-full bg-[#141724] border border-[#262c3e] focus:border-[#ff003c] focus:outline-none p-2.5 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#a1a1aa] mb-1">FIRM / FUND</label>
                  <input
                    type="text"
                    required
                    value={firmName}
                    onChange={(e) => setFirmName(e.target.value)}
                    className="w-full bg-[#141724] border border-[#262c3e] focus:border-[#ff003c] focus:outline-none p-2.5 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#a1a1aa] mb-1">YOUR WORK EMAIL</label>
                <input
                  type="email"
                  required
                  value={vcEmail}
                  onChange={(e) => setVcEmail(e.target.value)}
                  className="w-full bg-[#141724] border border-[#262c3e] focus:border-[#ff003c] focus:outline-none p-2.5 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-[#a1a1aa] mb-1">THESIS MATCH & MEETING NOTE</label>
                <textarea
                  rows={4}
                  required
                  value={thesisMatchNote}
                  onChange={(e) => setThesisMatchNote(e.target.value)}
                  className="w-full bg-[#141724] border border-[#262c3e] focus:border-[#ff003c] focus:outline-none p-2.5 rounded-lg text-white resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff003c] to-[#ff2a5f] text-white font-bold text-xs tracking-widest uppercase hover:glow-red transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>DISPATCHING ENCRYPTED ROUTE...</span>
                  ) : (
                    <>
                      <span>TRANSMIT DIRECT INTRO REQUEST</span>
                      <Send className="w-4 h-4" />
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
