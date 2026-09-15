'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Search,
  Filter,
  Flame,
  Shield,
  Clock,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Radio,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Terminal,
} from 'lucide-react';
import CyberBackground from '@/components/CyberBackground';
import Header from '@/components/Header';
import DealDrawer from '@/components/DealDrawer';
import GlitchText from '@/components/GlitchText';
import { soundEngine } from '@/components/AudioEngine';
import { Deal, StartupCategory } from '@/lib/types';
import { dealStore } from '@/lib/dealStore';

const CATEGORIES: Array<StartupCategory | 'ALL'> = [
  'ALL',
  'Cyber Warfare',
  'AI Agents',
  'BioTech / Longevity',
  'Quantum Infra',
  'Autonomous Robotics',
  'FinTech / DeFi',
];

export default function VCPortal() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<StartupCategory | 'ALL'>('ALL');
  const [minHype, setMinHype] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'hype' | 'newest'>('newest');
  const [hasNewDealPulse, setHasNewDealPulse] = useState(false);

  // Subscribe to live deals stream
  useEffect(() => {
    const unsubscribe = dealStore.subscribe((updatedDeals) => {
      setDeals((prev) => {
        if (prev.length > 0 && updatedDeals.length > prev.length) {
          // New deal received!
          soundEngine.playVerdictSuccess();
          setHasNewDealPulse(true);
          setTimeout(() => setHasNewDealPulse(false), 4000);
        }
        return updatedDeals;
      });
    });

    return () => unsubscribe();
  }, []);

  const filteredDeals = useMemo(() => {
    return deals
      .filter((deal) => {
        const matchesCategory =
          selectedCategory === 'ALL' || deal.category === selectedCategory;
        const matchesHype = deal.hypeScore >= minHype;
        const matchesSearch =
          deal.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.elevatorPitch.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.founderName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesHype && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'hype') return b.hypeScore - a.hypeScore;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [deals, selectedCategory, minHype, searchQuery, sortBy]);

  const handleDealClick = (deal: Deal) => {
    soundEngine.playClick(1300);
    setSelectedDeal(deal);
  };

  const handleUpdateDeal = (updated: Deal) => {
    setSelectedDeal(updated);
    setDeals((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0a0a0c] text-white">
      <CyberBackground />
      <Header />

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Portal Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#1e2330]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/30">
                PORTAL: VC TERMINAL RADAR
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#10b981] font-mono">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                <span>LIVE REALTIME PIPELINE ACTIVE</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Compass className="w-6 h-6 text-[#00f0ff]" />
              <GlitchText text="APEX DEAL RADAR" className="text-white" glow={false} />
            </h1>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="p-2.5 bg-[#0e111a] border border-[#1e2330] rounded-xl">
              <span className="text-[10px] text-[#71717a] block">VERIFIED DEALS</span>
              <span className="text-base font-bold text-[#00f0ff]">{deals.length}</span>
            </div>
            <div className="p-2.5 bg-[#0e111a] border border-[#1e2330] rounded-xl">
              <span className="text-[10px] text-[#71717a] block">TOP HYPE</span>
              <span className="text-base font-bold text-[#10b981]">
                {deals.length > 0 ? Math.max(...deals.map((d) => d.hypeScore)) : 0}
              </span>
            </div>
            <Link
              href="/portal/founder"
              className="p-2.5 bg-[#ff003c]/10 hover:bg-[#ff003c]/20 border border-[#ff003c]/40 text-[#ff003c] rounded-xl font-bold flex items-center gap-1.5 transition-all"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>TEST INTERROGATION</span>
            </Link>
          </div>
        </div>

        {/* Live Pulse Banner if a new deal arrives */}
        <AnimatePresence>
          {hasNewDealPulse && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 bg-[#00f0ff]/15 border border-[#00f0ff] p-3 rounded-xl flex items-center justify-between text-xs font-mono text-[#00f0ff] glow-cyan"
            >
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 animate-spin" />
                <span className="font-bold">INCOMING TRANSMISSION:</span>
                <span>New verified startup has just cleared Vesper Prey&apos;s interrogation!</span>
              </div>
              <span className="font-bold underline cursor-pointer">UPDATED LIVE</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter & Search Bar */}
        <div className="bg-[#0d0f16] border border-[#1e2330] rounded-2xl p-4 mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search startups, technology keywords, or founders..."
                className="w-full bg-[#131622] border border-[#232736] focus:border-[#00f0ff] focus:outline-none pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm text-white font-mono placeholder:text-[#52525b]"
              />
            </div>

            {/* Minimum Hype Filter */}
            <div className="flex items-center gap-1 bg-[#131622] border border-[#232736] p-1 rounded-xl text-xs font-mono">
              <span className="px-2 text-[10px] text-[#71717a] uppercase font-bold">HYPE:</span>
              {[0, 80, 88, 92].map((threshold) => (
                <button
                  key={threshold}
                  onClick={() => {
                    soundEngine.playClick(1000);
                    setMinHype(threshold);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    minHype === threshold
                      ? 'bg-[#00f0ff] text-black shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                      : 'text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  {threshold === 0 ? 'ALL' : `${threshold}+`}
                </button>
              ))}
            </div>

            {/* Sort Toggle */}
            <div className="flex items-center gap-1 bg-[#131622] border border-[#232736] p-1 rounded-xl text-xs font-mono">
              <button
                onClick={() => {
                  soundEngine.playClick(1000);
                  setSortBy('newest');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sortBy === 'newest'
                    ? 'bg-[#ff003c] text-white shadow-[0_0_8px_rgba(255,0,60,0.4)]'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                NEWEST
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick(1000);
                  setSortBy('hype');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sortBy === 'hype'
                    ? 'bg-[#00f0ff] text-black shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                TOP HYPE
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundEngine.playClick(1100);
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#1e2436] text-[#00f0ff] border border-[#00f0ff]/50 font-bold'
                    : 'bg-[#11131c] text-[#71717a] border border-[#1e2330] hover:text-white hover:border-[#2f3547]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Live Deal Grid */}
        {filteredDeals.length === 0 ? (
          <div className="py-20 text-center bg-[#0d0f16] border border-[#1e2330] rounded-2xl p-8 font-mono">
            <Compass className="w-12 h-12 text-[#52525b] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">NO RADAR MATCHES DETECTED</h3>
            <p className="text-xs text-[#71717a] max-w-sm mx-auto mb-4">
              Try adjusting your category filter or lowering the minimum hype threshold.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setMinHype(0);
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#171a26] border border-[#282e42] rounded-xl text-xs text-[#00f0ff] hover:bg-[#1f2333]"
            >
              RESET RADAR FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => {
              const offerCount = deal.offers?.length || 0;
              const hasOffers = offerCount > 0;

              return (
                <motion.div
                  key={deal.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleDealClick(deal)}
                  className="group relative cursor-pointer bg-[#0e1017] border border-[#1e2330] hover:border-[#00f0ff]/60 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] overflow-hidden"
                >
                  {/* Subtle top indicator */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-0.5 ${
                      deal.hypeScore >= 90
                        ? 'bg-[#00f0ff]'
                        : deal.hypeScore >= 80
                        ? 'bg-[#10b981]'
                        : 'bg-[#ff003c]'
                    }`}
                  />

                  <div>
                    {/* Top Row: Category & Score */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161a26] text-[#94a3b8] border border-[#23293d] uppercase tracking-wider font-semibold">
                        {deal.category}
                      </span>

                      {/* Hype Score Badge */}
                      <div
                        className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-extrabold ${
                          deal.hypeScore >= 90
                            ? 'bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/40 glow-cyan'
                            : 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/40'
                        }`}
                      >
                        <Flame className="w-3 h-3" />
                        <span>{deal.hypeScore}</span>
                      </div>
                    </div>

                    {/* Startup Name */}
                    <h3 className="text-lg font-bold text-white group-hover:text-[#00f0ff] transition-colors mb-2 tracking-tight flex items-center justify-between">
                      <span>{deal.startupName}</span>
                      <ArrowUpRight className="w-4 h-4 text-[#71717a] group-hover:text-[#00f0ff] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </h3>

                    {/* Elevator Pitch snippet */}
                    <p className="text-xs text-[#94a3b8] line-clamp-2 leading-relaxed mb-4">
                      {deal.elevatorPitch}
                    </p>

                    {/* Traction Snippet */}
                    <div className="grid grid-cols-2 gap-2 bg-[#121520] p-2.5 rounded-xl border border-[#1e2330] text-[11px] font-mono mb-4">
                      <div>
                        <span className="text-[9px] text-[#71717a] block">MRR</span>
                        <span className="text-white font-bold">{deal.traction.mrr}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#71717a] block">MoM GROWTH</span>
                        <span className="text-[#10b981] font-bold">{deal.traction.momGrowth}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Founder & Term Sheets */}
                  <div className="pt-3 border-t border-[#1a1e2b] flex items-center justify-between text-[11px] font-mono text-[#71717a]">
                    <span className="truncate max-w-[140px] text-[#cbd5e1]">{deal.founderName}</span>

                    <div className="flex items-center gap-2">
                      {hasOffers ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 font-bold">
                          {offerCount} TERM SHEET{offerCount > 1 ? 'S' : ''}
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#52525b]">NO OFFERS YET</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Slide-out Cyber Drawer */}
      <DealDrawer
        deal={selectedDeal}
        isOpen={Boolean(selectedDeal)}
        onClose={() => setSelectedDeal(null)}
        onUpdateDeal={handleUpdateDeal}
      />
    </div>
  );
}
