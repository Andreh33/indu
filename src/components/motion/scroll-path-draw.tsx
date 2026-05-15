'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils/cn';

type Props = {
  /** Path SVG (atributo d). Default: horizontal recta */
  d?: string;
  /** Color del stroke */
  stroke?: string;
  strokeWidth?: number;
  /** ViewBox del SVG (default `0 0 1000 80`) */
  viewBox?: string;
  className?: string;
  /** ¿La línea termina en una flecha pequeña? */
  arrow?: boolean;
};

/**
 * Path SVG que se "dibuja" según el progreso de scroll de su contenedor.
 * Útil como separador animado entre secciones. Ideal con path largo/curvo.
 */
export default function ScrollPathDraw({
  d = 'M 0 40 Q 250 0 500 40 T 1000 40',
  stroke = '#ED2939',
  strokeWidth = 2,
  viewBox = '0 0 1000 80',
  className,
  arrow = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.4'],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 1], [0, 1, 1]);

  return (
    <div ref={ref} className={cn('w-full', className)}>
      <svg
        viewBox={viewBox}
        preserveAspectRatio="none"
        className="block h-full w-full"
        aria-hidden
      >
        <motion.path
          d={d}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength, opacity }}
        />
        {arrow ? (
          <motion.polyline
            points="980,30 1000,40 980,50"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength, opacity }}
          />
        ) : null}
      </svg>
    </div>
  );
}
