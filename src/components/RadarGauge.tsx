"use client";

import { motion } from "framer-motion";
import { Metrics } from "@/lib/types";

const SIZE = 280;
const CENTER = SIZE / 2;
const MAX_R = 105;

// Three metric arms, spaced 120° apart, each length = metric value
const ARMS: { key: keyof Metrics; label: string; angleDeg: number; color: string }[] = [
  { key: "vcInterest", label: "INTEREST", angleDeg: -90, color: "var(--color-amber)" },
  { key: "hype", label: "HYPE", angleDeg: 30, color: "var(--color-venom)" },
  { key: "risk", label: "RISK", angleDeg: 150, color: "var(--color-blood)" },
];

function polar(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CENTER + r * Math.cos(rad), y: CENTER + r * Math.sin(rad) };
}

export default function RadarGauge({ metrics, thinking = false }: { metrics: Metrics; thinking?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[280px] mx-auto">
      <div className="relative w-full aspect-square">
        <svg width="100%" height="100%" viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {/* rings */}
          {[0.35, 0.65, 1].map((f) => (
            <circle
              key={f}
              cx={CENTER}
              cy={CENTER}
              r={MAX_R * f}
              fill="none"
              stroke="var(--color-line)"
              strokeWidth={1}
            />
          ))}
          {/* crosshair */}
          <line x1={CENTER - MAX_R} y1={CENTER} x2={CENTER + MAX_R} y2={CENTER} stroke="var(--color-line)" strokeWidth={1} />
          <line x1={CENTER} y1={CENTER - MAX_R} x2={CENTER} y2={CENTER + MAX_R} stroke="var(--color-line)" strokeWidth={1} />

          {/* continuous sweep — speeds up while Vesper is "thinking" */}
          <motion.g
            style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, ease: "linear", duration: thinking ? 1 : 4 }}
          >
            <path
              d={`M ${CENTER} ${CENTER} L ${CENTER + MAX_R} ${CENTER} A ${MAX_R} ${MAX_R} 0 0 1 ${polar(30, MAX_R).x} ${polar(30, MAX_R).y} Z`}
              fill={thinking ? "var(--color-blood)" : "var(--color-venom)"}
              opacity={thinking ? 0.12 : 0.06}
            />
          </motion.g>

          {/* metric arms */}
          {ARMS.map((arm) => {
            const r = (metrics[arm.key] / 100) * MAX_R;
            const tip = polar(arm.angleDeg, r);
            const labelPt = polar(arm.angleDeg, MAX_R + 20);
            return (
              <g key={arm.key}>
                <motion.line
                  x1={CENTER}
                  y1={CENTER}
                  initial={{ x2: CENTER, y2: CENTER }}
                  animate={{ x2: tip.x, y2: tip.y }}
                  transition={{ type: "spring", stiffness: 90, damping: 14 }}
                  stroke={arm.color}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
                <motion.circle
                  initial={{ cx: CENTER, cy: CENTER }}
                  animate={{ cx: tip.x, cy: tip.y }}
                  transition={{ type: "spring", stiffness: 90, damping: 14 }}
                  r={5}
                  fill={arm.color}
                />
                <text
                  x={labelPt.x}
                  y={labelPt.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="var(--font-mono)"
                  fontSize="9"
                  letterSpacing="0.1em"
                  fill="var(--color-paper-dim)"
                >
                  {arm.label}
                </text>
              </g>
            );
          })}

          {/* center blip: the prey — pulses while Vesper is deciding */}
          <motion.circle
            cx={CENTER}
            cy={CENTER}
            r={4}
            fill={thinking ? "var(--color-blood)" : "var(--color-paper)"}
            animate={thinking ? { r: [4, 7, 4], opacity: [1, 0.5, 1] } : { r: 4, opacity: 1 }}
            transition={thinking ? { repeat: Infinity, duration: 0.9, ease: "easeInOut" } : undefined}
          />
        </svg>
      </div>

      <div className="flex gap-6 font-mono text-xs">
        {ARMS.map((arm) => (
          <div key={arm.key} className="flex flex-col items-center gap-1">
            <span style={{ color: arm.color }} className="text-lg font-semibold tabular-nums">
              {Math.round(metrics[arm.key])}
            </span>
            <span className="text-paper-dim tracking-widest text-[10px]">{arm.label}</span>
          </div>
        ))}
      </div>

      {thinking && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
          className="font-mono text-[10px] tracking-[0.25em] text-blood uppercase"
        >
          Vesper is reading you
        </motion.p>
      )}
    </div>
  );
}
