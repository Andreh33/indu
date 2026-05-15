'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

type Props = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  /** ms desde que se monta hasta el viewport-check. Útil con scroll triggers tardíos. */
  threshold?: number;
};

export default function ScrollReveal({
  children,
  delay = 0,
  y = 40,
  className,
  threshold = 0.15,
}: Props) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: threshold }}
      transition={{ duration: 0.7, delay, ease: [0.7, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
