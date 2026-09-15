export type StartupCategory =
  | 'AI Agents'
  | 'Cyber Warfare'
  | 'BioTech / Longevity'
  | 'Quantum Infra'
  | 'Autonomous Robotics'
  | 'FinTech / DeFi';

export interface InterrogationTurn {
  round: number;
  question: string;
  founderAnswer?: string;
  hypeDelta: number;
  riskDelta: number;
  moatDelta: number;
  critiqueNote: string;
  timestamp: string;
}

export interface DealOffer {
  id: string;
  dealId: string;
  vcName: string;
  vcEmail: string;
  firmName: string;
  valuationMillions: number;
  checkSizeMillions: number;
  covenants: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface DirectIntroRequest {
  id: string;
  dealId: string;
  vcName: string;
  vcEmail: string;
  firmName: string;
  thesisMatchNote: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  startupName: string;
  founderName: string;
  founderEmail: string;
  founderTwitter?: string;
  category: StartupCategory;
  elevatorPitch: string;
  traction: {
    mrr: string;
    momGrowth: string;
    activeUsers: string;
    burnRate: string;
  };
  hypeScore: number;
  riskScore: number;
  moatScore: number;
  status: 'verified' | 'eaten' | 'pending';
  transcript: InterrogationTurn[];
  autopsyCritique?: string;
  createdAt: string;
  offers: DealOffer[];
  intros: DirectIntroRequest[];
}

export interface InterrogationRequest {
  startupName: string;
  category: StartupCategory;
  traction: {
    mrr: string;
    momGrowth: string;
    activeUsers: string;
    burnRate: string;
  };
  elevatorPitch: string;
  currentRound: number; // 1 to 4
  currentHypeScore: number;
  currentRiskScore: number;
  currentMoatScore: number;
  founderAnswer?: string;
  history: InterrogationTurn[];
}

export interface InterrogationResponse {
  interrogation_question: string;
  hype_score_delta: number;
  risk_factor_delta: number;
  moat_delta: number;
  critique_note: string;
  round_complete: boolean;
  verdict_summary?: string;
}
