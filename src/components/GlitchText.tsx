'use client';

import React, { useState, useEffect } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p' | 'div';
  glitchOnHover?: boolean;
  glow?: boolean;
}

export default function GlitchText({
  text,
  className = '',
  as: Component = 'span',
  glitchOnHover = false,
  glow = true,
}: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(!glitchOnHover);

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}—=+*^?#_';

  const triggerGlitch = () => {
    let iteration = 0;
    const maxIterations = text.length;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
      }

      iteration += 1 / 2;
    }, 28);
  };

  useEffect(() => {
    setDisplayText(text);
    triggerGlitch();
    // Periodic subtle flicker
    const timer = setInterval(() => {
      if (Math.random() > 0.65) {
        triggerGlitch();
      }
    }, 7000);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <Component
      onMouseEnter={() => {
        if (glitchOnHover) triggerGlitch();
      }}
      className={`relative inline-block tracking-wider uppercase font-bold select-none ${
        glow ? 'text-glow-red' : ''
      } ${className}`}
    >
      <span className="relative z-10">{displayText}</span>
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 -translate-x-[1px] translate-y-[0.5px] text-[#00f0ff] opacity-40 z-0 pointer-events-none select-none"
      >
        {displayText}
      </span>
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 translate-x-[1px] -translate-y-[0.5px] text-[#ff003c] opacity-50 z-0 pointer-events-none select-none"
      >
        {displayText}
      </span>
    </Component>
  );
}
