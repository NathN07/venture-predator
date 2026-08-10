"use client";

let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function setMuted(value: boolean) {
  muted = value;
}

export function isMuted() {
  return muted;
}

function tone(
  freq: number,
  duration: number,
  {
    type = "sine",
    startGain = 0.08,
    delay = 0,
    freqEnd,
  }: { type?: OscillatorType; startGain?: number; delay?: number; freqEnd?: number } = {}
) {
  const audio = getCtx();
  if (!audio || muted) return;

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audio.currentTime + delay);
  if (freqEnd) {
    osc.frequency.exponentialRampToValueAtTime(freqEnd, audio.currentTime + delay + duration);
  }
  gain.gain.setValueAtTime(startGain, audio.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + delay + duration);

  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(audio.currentTime + delay);
  osc.stop(audio.currentTime + delay + duration + 0.05);
}

// Sharp, dry click for buttons
export function playClick() {
  tone(650, 0.06, { type: "square", startGain: 0.05 });
}

// Descending "whoosh" when a new question drops in
export function playWhoosh() {
  tone(420, 0.25, { type: "sawtooth", startGain: 0.04, freqEnd: 160 });
}

// Quick tick for radar/metric updates
export function playTick() {
  tone(900, 0.04, { type: "square", startGain: 0.035 });
}

// Rising arpeggio for a funded verdict
export function playFund() {
  [523, 659, 784, 1047].forEach((f, i) =>
    tone(f, 0.28, { type: "triangle", startGain: 0.07, delay: i * 0.09 })
  );
}

// Low, blunt buzzer for a passed/rejected verdict
export function playPass() {
  tone(160, 0.5, { type: "sawtooth", startGain: 0.09, freqEnd: 60 });
  tone(80, 0.6, { type: "square", startGain: 0.05, delay: 0.05 });
}
