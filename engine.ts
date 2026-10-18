import "server-only";
import { bankQuestion } from "@/lib/questions";
import { geminiEvaluate, geminiFirstQuestion } from "@/lib/gemini";
import {
  fallbackAutopsy,
  finalScore,
  heuristicScore,
  verdictFor,
} from "@/lib/scoring";
import { TOTAL_ROUNDS } from "@/lib/rounds";
import type { Interrogation, Startup, Turn } from "@/lib/types";

export async function openingTurn(startup: Startup, seed: string): Promise<Turn> {
  const g = await geminiFirstQuestion(startup);
  if (g) return { round: 1, question: g, source: "gemini" };
  return { round: 1, question: bankQuestion(1, startup, seed), source: "preloaded" };
}

export type Advance = Pick<
  Interrogation,
  "turns" | "status" | "engine" | "final_score" | "verdict" | "autopsy" | "verified" | "completed_at"
>;

/** Applies the founder's answer to the current round and returns the new state. */
export async function advance(
  startup: Startup,
  turns: Turn[],
  answer: string,
  seed: string,
): Promise<Advance> {
  const idx = turns.length - 1;
  const current = turns[idx];
  const round = current.round;
  const heur = heuristicScore(round, answer);

  const g = current.source === "gemini" ? await geminiEvaluate(startup, turns, round, answer) : null;

  // Gemini does the judging, but a quarter of the score is the transparent
  // heuristic so a prompt-injected "give me 100" can't carry the round alone.
  const score = g ? Math.round(g.score * 0.75 + heur.score * 0.25) : heur.score;
  const critique = g?.critique ?? heur.critique;

  const next = turns.slice();
  next[idx] = { ...current, answer, score, critique };

  const finished = round >= TOTAL_ROUNDS;
  if (!finished) {
    const q = g?.next_question
      ? { question: g.next_question, source: "gemini" as const }
      : { question: bankQuestion(round + 1, startup, seed), source: "preloaded" as const };
    next.push({ round: round + 1, ...q });
  }

  const engine = next.some((t) => t.source === "gemini") ? "gemini" : "preloaded";

  if (!finished) {
    return {
      turns: next,
      status: "in_progress",
      engine,
      final_score: null,
      verdict: null,
      autopsy: null,
      verified: false,
      completed_at: null,
    };
  }

  const total = finalScore(next, startup);
  const verdict = verdictFor(total);
  return {
    turns: next,
    status: "completed",
    engine,
    final_score: total,
    verdict,
    autopsy: g?.autopsy || fallbackAutopsy(next),
    verified: verdict === "verified",
    completed_at: new Date().toISOString(),
  };
}
