import { ROUNDS, VERIFY_THRESHOLD } from "@/lib/rounds";
import type { Startup, Turn } from "@/lib/types";

const KEYWORDS: Record<number, string[]> = {
  1: ["cac", "ltv", "payback", "margin", "gross", "acquisition", "sales cycle", "acv", "arpu", "cost", "pricing"],
  2: ["data", "network", "switching", "proprietary", "integration", "distribution", "contract", "patent", "regulat", "workflow", "brand", "exclusive", "compound"],
  3: ["churn", "retention", "nrr", "renewal", "expansion", "cohort", "concentration", "upsell", "logo", "usage", "contract"],
  4: ["milestone", "runway", "hire", "metric", "risk", "plan", "revenue", "because", "growth", "customers", "month"],
};

const FLUFF =
  /(revolution|disrupt|game.?chang|no competit|first.?mover|world.?class|synerg|passionate|paradigm|10x|unicorn)/gi;

const WORD_NUMBERS =
  /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty|hundred|thousand|million|billion|percent|half|quarter)\b/gi;

export type RoundScore = { score: number; critique: string };

/** Transparent fallback evaluator. Also used to sanity-check LLM scores. */
export function heuristicScore(round: number, answer: string): RoundScore {
  const text = answer.trim();
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean).length;
  const numbers =
    (text.match(/\$?\d[\d,.]*\s?(%|k|m|x)?/gi) ?? []).length +
    (text.match(WORD_NUMBERS) ?? []).length;
  const kw = (KEYWORDS[round] ?? []).filter((k) => lower.includes(k)).length;
  const fluff = (text.match(FLUFF) ?? []).length;

  const raw =
    12 +
    (Math.min(words, 60) / 60) * 30 +
    Math.min(numbers, 4) * 8 +
    Math.min(kw, 4) * 8 -
    fluff * 10;
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  let critique: string;
  if (words < 25) {
    critique = "Too thin. Answer in full sentences and give the specifics behind each claim.";
  } else if (numbers === 0) {
    critique = "No numbers. Investors expect figures here, even rough ones with stated assumptions.";
  } else if (fluff > 0) {
    critique = "Buzzwords weaken the answer. Say what is actually true today and how you know.";
  } else if (kw < 2) {
    const r = ROUNDS[round - 1];
    critique = `You skirted the question. This round is about: ${r.blurb.toLowerCase()}`;
  } else {
    critique = "Solid specifics. Now pressure-test the assumptions behind your figures.";
  }
  return { score, critique };
}

/** Self-reported traction nudges the score by at most 8 points. */
export function tractionBonus(s: Pick<Startup, "mrr" | "mom_growth" | "contracts" | "burn">) {
  let b = 0;
  b += s.mrr >= 1000 ? 2 : s.mrr > 0 ? 1 : 0;
  b += s.mom_growth >= 10 ? 2 : s.mom_growth > 0 ? 1 : 0;
  b += s.contracts >= 3 ? 2 : s.contracts > 0 ? 1 : 0;
  b += s.mrr > 0 && s.burn > 0 && s.burn / s.mrr <= 3 ? 2 : 0;
  return Math.min(8, b);
}

export function finalScore(turns: Turn[], startup: Startup) {
  const scores = turns.map((t) => t.score ?? 0);
  const avg = scores.reduce((a, b) => a + b, 0) / Math.max(scores.length, 1);
  return Math.max(0, Math.min(100, Math.round(avg * 0.95 + tractionBonus(startup))));
}

export function verdictFor(score: number) {
  return score >= VERIFY_THRESHOLD ? ("verified" as const) : ("rejected" as const);
}

/** Plain-language post-mortem built from the two weakest rounds. */
export function fallbackAutopsy(turns: Turn[]) {
  const weakest = [...turns]
    .filter((t) => typeof t.score === "number")
    .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
    .slice(0, 2);
  const lines = weakest.map((t) => {
    const r = ROUNDS[t.round - 1];
    return `${r.title} (${t.score}/100): ${t.critique}`;
  });
  return `Where the pitch lost points:\n${lines.join("\n")}`;
}
