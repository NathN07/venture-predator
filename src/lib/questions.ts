import type { Startup } from "@/lib/types";

/**
 * Preloaded question bank, used whenever GEMINI_API_KEY is missing or Gemini
 * is unavailable. Three variants per round; the variant is picked from the
 * interrogation id so a retry feels different.
 */

type Ctx = Pick<Startup, "name" | "category" | "mrr" | "burn" | "mom_growth">;

const money = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `$${Math.round(n / 1_000)}k`
      : `$${Math.round(n)}`;

const BANK: Record<number, Array<(c: Ctx) => string>> = {
  1: [
    (c) =>
      `${c.name}, walk me through your unit economics. What does it cost to win one customer, what do they pay you in a year, and how many months until that cost comes back?`,
    (c) =>
      c.mrr > 0 && c.burn > 0
        ? `You report ${money(c.mrr)} in monthly revenue against ${money(c.burn)} of monthly burn. What is your gross margin today, and what has to be true for payback to land under twelve months?`
        : `Most ${c.category} startups look healthy until sales cycles and support costs show up. Which costs are you leaving out of your margin today?`,
    () =>
      `Pick your cheapest and your most expensive customer to acquire. What did each cost you, and why should I believe the cheap channel scales?`,
  ],
  2: [
    (c) =>
      `If a well-funded team copied ${c.name} in six months, what would you still own that they could not buy?`,
    () =>
      `A large platform ships this as a free feature next year. Why does a customer still pay you?`,
    () =>
      `An open-source project reaches eighty percent of what you do. What is the other twenty percent worth, and who pays for it?`,
  ],
  3: [
    (c) =>
      `What share of revenue comes from your three largest customers, and what happens to ${c.name} if the biggest one leaves?`,
    () =>
      `Give me logo churn and net revenue retention. If you lack a year of data, what is the earliest evidence that customers stay?`,
    () =>
      `Which customers increased what they pay you, and what did they use that the others did not?`,
  ],
  4: [
    (c) =>
      `I am deciding whether to lead a $5M round in ${c.name} today instead of waiting two quarters. What do you know that makes waiting the more expensive option?`,
    () =>
      `You receive $5M. What do you do with it in the first twelve months, and which single number proves it worked?`,
    (c) =>
      `Name the most likely reason ${c.name} fails. Then tell me why I should write the cheque anyway.`,
  ],
};

export function hashSeed(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function bankQuestion(round: number, startup: Ctx, seed: string) {
  const variants = BANK[round] ?? BANK[1];
  const pick = variants[(hashSeed(seed) + round) % variants.length];
  return pick(startup);
}
