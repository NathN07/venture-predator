import { scoreTone } from "@/lib/format";
import type { CSSProperties } from "react";

const COLORS = {
  verified: "var(--color-verified)",
  caution: "var(--color-caution)",
  signal: "var(--color-signal)",
};

export function ScoreDial({
  score,
  size = 140,
  label = "Final score",
  animate = true,
}: {
  score: number;
  size?: number;
  label?: string;
  animate?: boolean;
}) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = COLORS[scoreTone(score)];

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label}: ${score} out of 100`}
    >
      <svg viewBox="0 0 120 120" width={size} height={size} className="-rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-paper-2)" strokeWidth="9" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className={animate ? "dial-arc" : undefined}
          style={{ "--dial-circ": circ } as CSSProperties}
        />
        {/* the 80-point verification line */}
        <line
          x1="60"
          y1="3"
          x2="60"
          y2="13"
          stroke="var(--color-ink)"
          strokeWidth="2"
          transform="rotate(288 60 60)"
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-display text-4xl leading-none font-semibold tabular-nums" style={{ color }}>
          {score}
        </div>
        <div className="mt-1 text-[11px] text-muted">{label}</div>
      </div>
    </div>
  );
}
