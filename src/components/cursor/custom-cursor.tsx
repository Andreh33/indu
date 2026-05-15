'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useCursorStore } from '@/lib/cursor/store';
import { useMediaQuery } from '@/hooks/use-media-query';

const RING_SIZES: Record<string, number> = {
  default: 32,
  link: 64,
  image: 72,
  punch: 56,
  drag: 80,
};

const TRAIL_LENGTH = 8;

type Particle = { id: number; x: number; y: number };

export default function CustomCursor() {
  const isCoarse = useMediaQuery('(pointer: coarse)');
  const mode = useCursorStore((s) => s.mode);
  const label = useCursorStore((s) => s.label);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { damping: 30, stiffness: 350, mass: 0.4 });
  const sy = useSpring(y, { damping: 30, stiffness: 350, mass: 0.4 });

  const [particles, setParticles] = useState<Particle[]>([]);
  const idRef = useRef(0);
  const lastTrailRef = useRef(0);

  useEffect(() => {
    if (isCoarse) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      // Generamos trail solo cada 35ms para no saturar
      const now = performance.now();
      if (now - lastTrailRef.current < 35) return;
      lastTrailRef.current = now;
      const id = idRef.current++;
      setParticles((prev) => {
        const next = [...prev, { id, x: e.clientX, y: e.clientY }];
        return next.length > TRAIL_LENGTH ? next.slice(-TRAIL_LENGTH) : next;
      });
      // Auto-remove tras la animación
      window.setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 600);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [x, y, isCoarse]);

  if (isCoarse) return null;

  const ringSize = RING_SIZES[mode] ?? RING_SIZES.default;

  return (
    <>
      {/* Trail de partículas */}
      {particles.map((p, i) => {
        const ageRatio = (i + 1) / particles.length; // último = 1
        return (
          <motion.div
            key={p.id}
            aria-hidden
            initial={{ opacity: 0.6 * ageRatio, scale: 1 }}
            animate={{ opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="pointer-events-none fixed left-0 top-0 z-[98] rounded-full bg-[var(--color-blood-400)]"
            style={{
              x: p.x,
              y: p.y,
              width: 4,
              height: 4,
              translateX: '-50%',
              translateY: '-50%',
            }}
          />
        );
      })}

      {/* Punto central */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full bg-[var(--color-blood-400)]"
        style={{
          x: sx,
          y: sy,
          width: 8,
          height: 8,
          translateX: '-50%',
          translateY: '-50%',
          opacity: mode === 'default' ? 1 : 0,
          transition: 'opacity 200ms var(--ease-fight)',
        }}
      />

      {/* Anillo magnético con label */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99] flex items-center justify-center rounded-full border border-[var(--color-blood-400)] font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-blood-400)]"
        style={{
          x: sx,
          y: sy,
          width: ringSize,
          height: ringSize,
          translateX: '-50%',
          translateY: '-50%',
          transition: 'width 250ms var(--ease-fight), height 250ms var(--ease-fight)',
          mixBlendMode: 'difference',
        }}
      >
        {label && mode !== 'default' ? <span className="px-1 text-center">{label}</span> : null}
      </motion.div>

      <style jsx global>{`
        html,
        body {
          cursor: none;
        }
        a,
        button,
        input,
        textarea,
        select,
        [role='button'] {
          cursor: none;
        }
      `}</style>
    </>
  );
}
