'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils/cn';

type Props = {
  /** Factor de velocidad: 0 = quieto, 1 = scroll normal, -0.5 = mitad scroll en contrario */
  speed?: number;
  className?: string;
  children: React.ReactNode;
};

/**
 * Capa con parallax al scroll. Útil para apilar 3-4 layers en hero con
 * velocidades distintas y dar profundidad cinematográfica.
 */
export default function ParallaxLayer({ speed = 0.3, className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // Convertimos progress 0..1 a desplazamiento Y en % según speed.
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 50}%`, `${speed * 50}%`]);

  return (
    <motion.div ref={ref} style={{ y }} className={cn('will-change-transform', className)}>
      {children}
    </motion.div>
  );
}
