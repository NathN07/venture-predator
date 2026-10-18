export type Role = "founder" | "investor";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: Role | null;
  firm: string | null;
  created_at: string;
};

export type Startup = {
  id: string;
  owner_id: string;
  name: string;
  category: string;
  founder_name: string | null;
  founder_email: string | null;
  twitter: string | null;
  mrr: number;
  mom_growth: number;
  contracts: number;
  burn: number;
  pitch: string;
  created_at: string;
};

export type Turn = {
  round: number;
  question: string;
  answer?: string;
  score?: number;
  critique?: string;
  source: "gemini" | "preloaded";
};

export type Interrogation = {
  id: string;
  startup_id: string;
  owner_id: string;
  status: "in_progress" | "completed";
  engine: "gemini" | "preloaded";
  turns: Turn[];
  final_score: number | null;
  verdict: "verified" | "rejected" | null;
  autopsy: string | null;
  verified: boolean;
  created_at: string;
  completed_at: string | null;
};

export type Deal = Interrogation & { startups: Startup };

export type TermSheet = {
  id: string;
  investor_id: string;
  interrogation_id: string;
  startup_id: string;
  investor_name: string | null;
  investor_firm: string | null;
  pre_money: number;
  check_size: number;
  covenants: string | null;
  created_at: string;
};

export type IntroRequest = {
  id: string;
  investor_id: string;
  interrogation_id: string;
  startup_id: string;
  investor_name: string | null;
  investor_firm: string | null;
  message: string | null;
  created_at: string;
};
