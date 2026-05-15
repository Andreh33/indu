'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function PunchingBag() {
  const [hits, setHits] = useState(0);
  const broken = hits >= 10;
  const swing = Math.min(hits * 1.5, 18);

  function hit() {
    if (broken) return;
    setHits((h) => h + 1);
  }

  return (
    <div className="flex flex-col items-center">
      <svg
        width="60"
        height="40"
        viewBox="0 0 60 40"
        aria-hidden
        className="text-[var(--color-fg-subtle)]"
      >
        <line x1="30" y1="0" x2="30" y2="40" stroke="currentColor" strokeWidth="1" />
        <circle cx="30" cy="40" r="2" fill="currentColor" />
      </svg>

      <motion.button
        type="button"
        onClick={hit}
        disabled={broken}
        aria-label={broken ? 'Saco roto' : 'Golpear saco'}
        animate={broken ? { y: 240, rotate: 50, opacity: 0.3 } : { rotate: [-swing, swing, -swing] }}
        transition={
          broken
            ? { duration: 0.8, ease: [0.7, 0, 0.2, 1] }
            : { duration: Math.max(2.4 - hits * 0.15, 0.6), repeat: Infinity, ease: 'easeInOut' }
        }
        style={{ originY: 0 }}
        className="select-none focus-visible:outline-2 focus-visible:outline-[var(--color-blood-400)]"
      >
        <svg width="120" height="200" viewBox="0 0 120 200" aria-hidden>
          {/* Bag body */}
          <rect
            x="20"
            y="20"
            width="80"
            height="160"
            rx="40"
            fill="var(--color-canvas-800)"
            stroke="var(--color-canvas-600)"
            strokeWidth="2"
          />
          {/* Stripes */}
          <line x1="20" y1="70" x2="100" y2="70" stroke="var(--color-blood-700)" strokeWidth="3" />
          <line x1="20" y1="130" x2="100" y2="130" stroke="var(--color-blood-700)" strokeWidth="3" />
          {/* Strap */}
          <rect x="55" y="10" width="10" height="20" fill="var(--color-canvas-600)" />
          {/* Brand */}
          <text
            x="60"
            y="105"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="11"
            letterSpacing="2"
            fill="var(--color-blood-400)"
          >
            IF
          </text>
        </svg>
      </motion.button>

      <div className="mt-4 h-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
        {broken ? (
          <span className="text-[var(--color-blood-300)]">SE ROMPIÓ LA CADENA · ROUND PERDIDO</span>
        ) : hits > 0 ? (
          <span>HITS {hits} / 10</span>
        ) : null}
      </div>
    </div>
  );
}
