'use client';

import { Deal, DealOffer, DirectIntroRequest } from './types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const SEED_DEALS: Deal[] = [
  {
    id: 'seed-deal-1',
    startupName: 'ApexSwarm Cybernetics',
    founderName: 'Dr. Elena Vance',
    founderEmail: 'elena@apexswarm.io',
    founderTwitter: '@vance_apex',
    category: 'Cyber Warfare',
    elevatorPitch: 'Autonomous offensive counter-intrusion swarms that infiltrate adversary command-and-control servers in sub-12 milliseconds using polymorphic neural payloads.',
    traction: {
      mrr: '$240,000',
      momGrowth: '34%',
      activeUsers: '18 Enterprise DoD',
      burnRate: '$65,000/mo',
    },
    hypeScore: 94,
    riskScore: 28,
    moatScore: 92,
    status: 'verified',
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    transcript: [
      {
        round: 1,
        question: 'Vesper Prey: 18 DoD contracts is cute, but your CAC cycle for defense procurement is notorious for killing Series A startups. What is your actual land-and-expand pipeline?',
        founderAnswer: 'We bypass standard RFP bureaucracy by embedding with prime contractor sub-tiers on DARPA SBIR phase III grants with 0 customer acquisition cost.',
        hypeDelta: 8,
        riskDelta: -6,
        moatDelta: 10,
        critiqueNote: 'Solid bypass route. Eliminates procurement drag.',
        timestamp: '12m ago',
      },
      {
        round: 2,
        question: 'Vesper Prey: What stops Palantir or Lockheed from cloning your polymorphic neural payload and throwing 500 engineers at it?',
        founderAnswer: 'Our payload uses proprietary formal verification proofs synthesized on custom FPGA hardware with 4 provisional patents and air-gapped cryptographic signing.',
        hypeDelta: 12,
        riskDelta: -8,
        moatDelta: 15,
        critiqueNote: 'Defensibility verified. Hardware-firmware lock creates massive moat.',
        timestamp: '9m ago',
      },
      {
        round: 3,
        question: 'Vesper Prey: Net revenue retention. If an adversary updates their threat signatures, do you experience customer churn?',
        founderAnswer: '180% NRR. Once an adversarial threat mutates, our autonomous swarm synthesizes real-time counter-exploits, increasing our contract ACV by 2.4x automatically.',
        hypeDelta: 14,
        riskDelta: -5,
        moatDelta: 12,
        critiqueNote: 'Exceptional retention vector. Threat escalation directly monetized.',
        timestamp: '6m ago',
      },
      {
        round: 4,
        question: 'Vesper Prey: Final question. Why should I write a $5M lead check today instead of letting you bleed cash for another 6 months?',
        founderAnswer: 'Because tier-1 NATO sovereign funds are drafting terms as we speak, and in 6 months our Series A valuation triples upon deploying with US Space Command.',
        hypeDelta: 10,
        riskDelta: -4,
        moatDelta: 8,
        critiqueNote: 'Predator conviction accepted. Term sheet authorized.',
        timestamp: '2m ago',
      },
    ],
    offers: [
      {
        id: 'offer-seed-1',
        dealId: 'seed-deal-1',
        vcName: 'Marcus Sterling',
        vcEmail: 'marcus@blackrock-cyber.vc',
        firmName: 'Blackrock Cyber Syndicate',
        valuationMillions: 45,
        checkSizeMillions: 6,
        covenants: 'Pro-rata rights, 1 board seat, clean liquidation preference.',
        status: 'pending',
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
    ],
    intros: [],
  },
  {
    id: 'seed-deal-2',
    startupName: 'Synthetix Telomere Labs',
    founderName: 'Kairos Chen',
    founderEmail: 'kairos@synthetixtelo.bio',
    founderTwitter: '@kairoschen_bio',
    category: 'BioTech / Longevity',
    elevatorPitch: 'CRISPR-targeted epigenomic reprogramming nanobots that reverse cellular senescence in vascular endothelia, resetting biological age by 12 years in primate trials.',
    traction: {
      mrr: '$110,000',
      momGrowth: '22%',
      activeUsers: '8 Tier-1 Research Hospitals',
      burnRate: '$90,000/mo',
    },
    hypeScore: 88,
    riskScore: 35,
    moatScore: 86,
    status: 'verified',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    transcript: [
      {
        round: 1,
        question: 'Vesper Prey: FDA clinical trials are the graveyard of Silicon Valley bio founders. How do you survive the Phase II valley of death?',
        founderAnswer: 'We run parallel clinical cohorts under accelerated breakthrough designations in Singapore and Switzerland while generating B2B licensing royalties from longevity clinics.',
        hypeDelta: 9,
        riskDelta: -5,
        moatDelta: 7,
        critiqueNote: 'Dual-jurisdiction approach mitigates FDA regulatory bottleneck.',
        timestamp: '1h ago',
      },
    ],
    offers: [],
    intros: [],
  },
  {
    id: 'seed-deal-3',
    startupName: 'NeuroMatrix Quantum',
    founderName: 'Sora Lindqvist',
    founderEmail: 'sora@neuromatrix.ai',
    founderTwitter: '@soralind',
    category: 'Quantum Infra',
    elevatorPitch: 'Room-temperature photonic quantum accelerator cards for sovereign LLM training clusters, reducing megawatt datacenter power consumption by 91%.',
    traction: {
      mrr: '$520,000',
      momGrowth: '48%',
      activeUsers: '4 Hyperscaler Pilots',
      burnRate: '$140,000/mo',
    },
    hypeScore: 96,
    riskScore: 22,
    moatScore: 95,
    status: 'verified',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    transcript: [],
    offers: [],
    intros: [],
  },
];

const LOCAL_STORAGE_KEY = 'venture_predator_deals_v2';
const CHANNEL_NAME = 'venture_predator_realtime_bus';

class DealStoreService {
  private channel: BroadcastChannel | null = null;
  private listeners: Array<(deals: Deal[]) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          if (event.data?.type === 'DEAL_UPDATE') {
            this.notifyListeners();
          }
        };
      } catch {
        // BroadcastChannel fallback
      }
    }
  }

  public subscribe(callback: (deals: Deal[]) => void): () => void {
    this.listeners.push(callback);
    callback(this.getDealsSync());

    // Also connect Supabase Realtime if configured
    let supabaseChannel: ReturnType<NonNullable<typeof supabase>['channel']> | null = null;
    if (isSupabaseConfigured && supabase) {
      supabaseChannel = supabase
        .channel('deals_stream')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'deals' },
          () => {
            this.notifyListeners();
          }
        )
        .subscribe();
    }

    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
      if (supabaseChannel) {
        supabaseChannel.unsubscribe();
      }
    };
  }

  private notifyListeners() {
    const deals = this.getDealsSync();
    this.listeners.forEach((callback) => callback(deals));
  }

  public getDealsSync(): Deal[] {
    if (typeof window === 'undefined') return SEED_DEALS;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    // Default seed
    this.saveDealsLocally(SEED_DEALS);
    return SEED_DEALS;
  }

  public async getDeals(): Promise<Deal[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('deals')
          .select('*, deal_offers(*), direct_intros(*)')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: Deal[] = data.map((d: any) => ({
            id: d.id,
            startupName: d.startup_name,
            founderName: d.founder_name,
            founderEmail: d.founder_email,
            founderTwitter: d.founder_twitter,
            category: d.category,
            elevatorPitch: d.elevator_pitch,
            traction: d.traction,
            hypeScore: d.hype_score,
            riskScore: d.risk_score,
            moatScore: d.moat_score,
            status: d.status,
            transcript: d.transcript || [],
            autopsyCritique: d.autopsy_critique,
            createdAt: d.created_at,
            offers: (d.deal_offers || []).map((o: any) => ({
              id: o.id,
              dealId: o.deal_id,
              vcName: o.vc_name,
              vcEmail: o.vc_email,
              firmName: o.firm_name,
              valuationMillions: Number(o.valuation_millions),
              checkSizeMillions: Number(o.check_size_millions),
              covenants: o.covenants,
              status: o.status,
              createdAt: o.created_at,
            })),
            intros: (d.direct_intros || []).map((i: any) => ({
              id: i.id,
              dealId: i.deal_id,
              vcName: i.vc_name,
              vcEmail: i.vc_email,
              firmName: i.firm_name,
              thesisMatchNote: i.thesis_match_note,
              createdAt: i.created_at,
            })),
          }));
          this.saveDealsLocally(mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase fetch failed, using local store:', err);
      }
    }
    return this.getDealsSync();
  }

  private saveDealsLocally(deals: Deal[]) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(deals));
      } catch {
        // ignore
      }
    }
  }

  public async addDeal(deal: Deal): Promise<Deal> {
    const deals = this.getDealsSync();
    const updated = [deal, ...deals];
    this.saveDealsLocally(updated);

    if (this.channel) {
      this.channel.postMessage({ type: 'DEAL_UPDATE', dealId: deal.id });
    }
    this.notifyListeners();

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('deals').insert({
          id: deal.id,
          startup_name: deal.startupName,
          founder_name: deal.founderName,
          founder_email: deal.founderEmail,
          founder_twitter: deal.founderTwitter,
          category: deal.category,
          elevator_pitch: deal.elevatorPitch,
          traction: deal.traction,
          hype_score: deal.hypeScore,
          risk_score: deal.riskScore,
          moat_score: deal.moatScore,
          status: deal.status,
          transcript: deal.transcript,
          autopsy_critique: deal.autopsyCritique,
        });
      } catch (err) {
        console.error('Failed to sync deal to Supabase:', err);
      }
    }

    return deal;
  }

  public async addOffer(offer: DealOffer): Promise<void> {
    const deals = this.getDealsSync();
    const updated = deals.map((d) => {
      if (d.id === offer.dealId) {
        return {
          ...d,
          offers: [...(d.offers || []), offer],
        };
      }
      return d;
    });

    this.saveDealsLocally(updated);
    if (this.channel) {
      this.channel.postMessage({ type: 'DEAL_UPDATE', dealId: offer.dealId });
    }
    this.notifyListeners();

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('deal_offers').insert({
          id: offer.id,
          deal_id: offer.dealId,
          vc_name: offer.vcName,
          vc_email: offer.vcEmail,
          firm_name: offer.firmName,
          valuation_millions: offer.valuationMillions,
          check_size_millions: offer.checkSizeMillions,
          covenants: offer.covenants,
          status: offer.status,
        });
      } catch (err) {
        console.error('Failed to sync offer to Supabase:', err);
      }
    }
  }

  public async addDirectIntro(intro: DirectIntroRequest): Promise<void> {
    const deals = this.getDealsSync();
    const updated = deals.map((d) => {
      if (d.id === intro.dealId) {
        return {
          ...d,
          intros: [...(d.intros || []), intro],
        };
      }
      return d;
    });

    this.saveDealsLocally(updated);
    if (this.channel) {
      this.channel.postMessage({ type: 'DEAL_UPDATE', dealId: intro.dealId });
    }
    this.notifyListeners();

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('direct_intros').insert({
          id: intro.id,
          deal_id: intro.dealId,
          vc_name: intro.vcName,
          vc_email: intro.vcEmail,
          firm_name: intro.firmName,
          thesis_match_note: intro.thesisMatchNote,
        });
      } catch (err) {
        console.error('Failed to sync intro to Supabase:', err);
      }
    }
  }

  public resetToSeeds() {
    this.saveDealsLocally(SEED_DEALS);
    if (this.channel) {
      this.channel.postMessage({ type: 'DEAL_UPDATE' });
    }
    this.notifyListeners();
  }
}

export const dealStore = new DealStoreService();
