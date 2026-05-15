'use client';

import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

type Props = {
  text: string;
  /** Velocidad del stagger entre letras (s) */
  staggerChildren?: number;
  /** Delay antes de empezar (s) */
  delayChildren?: number;
  /** Animar al entrar en viewport en lugar de al mount */
  whenInView?: boolean;
  className?: string;
  /** Heading level si quieres semántica. Default: div */
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
};

const container: Variants = {
  hidden: {},
  visible: (custom: { stagger: number; delay: number }) => ({
    transition: { staggerChildren: custom.stagger, delayChildren: custom.delay },
  }),
};

const child: Variants = {
  hidden: { y: '110%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.55, ease: [0.7, 0, 0.2, 1] },
  },
};

/**
 * SplitText: separa el texto en letras y las anima con stagger desde abajo.
 * Útil para titulares grandes. Respeta los saltos de línea (`\n`).
 */
export default function SplitText({
  text,
  staggerChildren = 0.025,
  delayChildren = 0,
  whenInView = false,
  className,
  as = 'div',
}: Props) {
  const lines = text.split('\n');
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      className={cn('overflow-hidden', className)}
      variants={container}
      custom={{ stagger: staggerChildren, delay: delayChildren }}
      initial="hidden"
      animate={whenInView ? undefined : 'visible'}
      whileInView={whenInView ? 'visible' : undefined}
      viewport={whenInView ? { once: true, amount: 0.4 } : undefined}
    >
      {lines.map((line, lineIdx) => (
        <span key={lineIdx} className="block overflow-hidden">
          {Array.from(line).map((char, i) => (
            <motion.span
              key={`${lineIdx}-${i}`}
              variants={child}
              className="inline-block"
              style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </MotionTag>
  );
}
