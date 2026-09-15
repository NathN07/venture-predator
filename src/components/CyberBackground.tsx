'use client';

import React, { useEffect, useRef } from 'react';

export default function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let gridOffset = 0;

    const render = () => {
      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, width, height);

      // Render perspective grid in bottom 60% of viewport
      const horizonY = height * 0.45;
      const gridSpacing = 40;
      gridOffset = (gridOffset + 0.4) % gridSpacing;

      ctx.save();
      ctx.strokeStyle = 'rgba(255, 0, 60, 0.08)';
      ctx.lineWidth = 1;

      // Vanishing lines from horizon to bottom
      const vanishingX = width / 2 + (mouseX - width / 2) * 0.15;
      const numRays = 24;
      for (let i = -numRays; i <= numRays; i++) {
        const xBottom = vanishingX + i * 80;
        ctx.beginPath();
        ctx.moveTo(vanishingX, horizonY);
        ctx.lineTo(xBottom, height);
        ctx.stroke();
      }

      // Horizontal grid lines moving down
      for (let y = horizonY; y < height; y += 15) {
        const p = (y - horizonY) / (height - horizonY);
        const yPos = horizonY + Math.pow(p, 1.8) * (height - horizonY) + gridOffset * p;
        if (yPos > horizonY && yPos < height) {
          ctx.beginPath();
          ctx.moveTo(0, yPos);
          ctx.lineTo(width, yPos);
          ctx.stroke();
        }
      }
      ctx.restore();

      // Render floating cyber particles and connect lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 0, 60, ${p.alpha * 0.8})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ff003c';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 42, 95, ${0.15 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Scanline CRT overlay */}
      <div className="absolute inset-0 scanline-bg opacity-40 mix-blend-overlay pointer-events-none" />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,12,0.85)_100%)] pointer-events-none" />
    </div>
  );
}
