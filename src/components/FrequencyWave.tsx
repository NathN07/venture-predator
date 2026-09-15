'use client';

import React, { useEffect, useRef } from 'react';

interface FrequencyWaveProps {
  isActive: boolean;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export default function FrequencyWave({
  isActive,
  intensity = 'medium',
  className = '',
}: FrequencyWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;
    const numBars = 48;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 300);
      const height = (canvas.height = 48);

      ctx.clearRect(0, 0, width, height);

      const barWidth = Math.max(2, width / numBars - 2);
      const step = width / numBars;

      const baseAmp = isActive ? (intensity === 'high' ? 18 : intensity === 'medium' ? 12 : 6) : 2;

      for (let i = 0; i < numBars; i++) {
        const x = i * step;
        const distFromCenter = Math.abs(i - numBars / 2) / (numBars / 2);
        const windowCurve = Math.cos(distFromCenter * Math.PI * 0.5);

        // Sinusoidal harmonics + jitter
        const wave1 = Math.sin(phase + i * 0.25);
        const wave2 = Math.cos(phase * 1.5 + i * 0.15);
        const randomSpike = isActive ? (Math.random() - 0.5) * 6 : 0;

        let barHeight = Math.abs(wave1 * wave2) * baseAmp * windowCurve + 2 + Math.abs(randomSpike);
        barHeight = Math.min(height * 0.9, Math.max(2, barHeight));

        const y = (height - barHeight) / 2;

        // Gradient from crimson to cyber cyan
        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isActive) {
          grad.addColorStop(0, '#ff003c');
          grad.addColorStop(0.5, '#ff2a5f');
          grad.addColorStop(1, '#00f0ff');
        } else {
          grad.addColorStop(0, '#333745');
          grad.addColorStop(1, '#1e2230');
        }

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      phase += isActive ? 0.09 : 0.02;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isActive, intensity]);

  return (
    <div className={`w-full overflow-hidden flex items-center justify-center ${className}`}>
      <canvas ref={canvasRef} className="w-full h-12 block" />
    </div>
  );
}
