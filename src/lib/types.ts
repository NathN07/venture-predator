export type Metrics = {
  hype: number;
  risk: number;
  vcInterest: number;
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

export type VCQuestionResponse = {
  type: "question";
  question: string;
  metricDeltas: Metrics;
  reaction: string;
};

export type VCVerdictResponse = {
  type: "verdict";
  metricDeltas: Metrics;
  outcome: "funded" | "passed";
  valuation: string;
  offer: string;
  headline: string;
  feedback: string[];
  shareText: string;
};

export type VCResponse = VCQuestionResponse | VCVerdictResponse;
