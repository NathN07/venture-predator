export const VERIFY_THRESHOLD = 80;

export const CATEGORIES = [
  "AI / ML",
  "Fintech",
  "SaaS / B2B",
  "Health",
  "Climate",
  "Consumer",
  "Developer tools",
  "Marketplace",
  "Hardware",
  "Education",
  "Other",
] as const;

export type Round = {
  n: 1 | 2 | 3 | 4;
  key: "economics" | "moat" | "retention" | "conviction";
  title: string;
  blurb: string;
};

export const ROUNDS: Round[] = [
  {
    n: 1,
    key: "economics",
    title: "Unit economics",
    blurb: "Acquisition cost, margins and payback.",
  },
  {
    n: 2,
    key: "moat",
    title: "Moat",
    blurb: "What stops a bigger or faster team copying you.",
  },
  {
    n: 3,
    key: "retention",
    title: "Retention",
    blurb: "Churn, expansion and customer concentration.",
  },
  {
    n: 4,
    key: "conviction",
    title: "The lead check",
    blurb: "Why write the first large cheque today.",
  },
];

export const TOTAL_ROUNDS = ROUNDS.length;

export function roundFor(n: number) {
  return ROUNDS[Math.min(Math.max(n, 1), TOTAL_ROUNDS) - 1];
}
