export type Metrics = {
  hype: number;      // 0-100, "is this exciting"
  risk: number;       // 0-100, "how likely this dies"
  vcInterest: number; // 0-100, "am I reaching for my checkbook"
};

export type StartupInfo = {
  name: string;
  pitch: string;
  market: string;
};

export type QARound = {
  question: string;
  answer: string;
};

export type Phase = "pitch" | "interrogating" | "verdict";

// What the /api/vc route returns while still asking questions
export type VCQuestionResponse = {
  type: "question";
  question: string;
  metricDeltas: Metrics;
  reaction: string; // one short, cutting in-character line reacting to the last answer
};

// What the /api/vc route returns on the final round
export type VCVerdictResponse = {
  type: "verdict";
  metricDeltas: Metrics;
  outcome: "funded" | "passed";
  valuation: string;      // e.g. "$4.2M pre-money" or "N/A"
  offer: string;           // e.g. "$500K for 12% equity" or "No offer"
  headline: string;        // short, brutal one-liner
  feedback: string[];      // 3-4 bullet points, sharp and specific
  shareText: string;       // <220 chars, ready to post
};

export type VCResponse = VCQuestionResponse | VCVerdictResponse;
