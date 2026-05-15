'use client';

import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils/cn';

type Props = {
  /** Texto completo. Palabras a destacar en rojo: envuélvelas con asteriscos `*así*`. */
  phrase: string;
  className?: string;
};

/**
 * Reveal de texto palabra a palabra al hacer scroll.
 * Las palabras envueltas en *asteriscos* se rellenan en rojo, el resto en blanco.
 * Color base: gris oscuro. Color final: blanco hueso o rojo bandera.
 */
export default function ScrollFillText({ phrase, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.5'],
  });

  // Tokenizar manteniendo info de "destacada"
  const tokens = phrase.split(/(\s+)/).filter(Boolean);
  const wordTokens = tokens.filter((t) => /\S/.test(t));
  const totalWords = wordTokens.length;

  let wordIndex = 0;

  return (
    <div
      ref={containerRef}
      className={cn(
        'font-display uppercase leading-[0.95] tracking-[-0.02em]',
        className,
      )}
      style={{ fontSize: 'var(--text-5xl)' }}
    >
      <p className="flex flex-wrap">
        {tokens.map((t, i) => {
          if (!/\S/.test(t)) {
            return <span key={i}>{t}</span>;
          }
          const idx = wordIndex++;
          const start = idx / totalWords;
          const end = Math.min(1, (idx + 1.5) / totalWords);
          const highlight = /^\*.+\*$/.test(t);
          const word = highlight ? t.slice(1, -1) : t;
          return (
            <ScrollWord
              key={i}
              progress={scrollYProgress}
              range={[start, end]}
              highlight={highlight}
            >
              {word}
            </ScrollWord>
          );
        })}
      </p>
    </div>
  );
}

function ScrollWord({
  progress,
  range,
  highlight,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  highlight: boolean;
  children: React.ReactNode;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const color = useTransform(
    progress,
    range,
    highlight ? ['#3D3B33', '#ED2939'] : ['#3D3B33', '#FAFAF7'],
  );
  return (
    <motion.span style={{ opacity, color }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  );
}
