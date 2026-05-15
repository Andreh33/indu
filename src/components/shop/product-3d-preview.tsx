'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

type Props = {
  imageUrl: string;
  alt: string;
  /** Texto opcional que aparece como "bordado" en una capa por encima */
  embroidery?: string;
  /** Bandera emoji opcional, capa intermedia */
  flag?: string;
};

/**
 * Pseudo-3D inspect: el mouse rota la imagen con perspectiva, y las capas
 * (texto bordado, bandera) flotan a Z distintos creando parallax interno.
 */
export default function Product3DPreview({ imageUrl, alt, embroidery, flag }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const sx = useSpring(mx, { damping: 25, stiffness: 200, mass: 0.4 });
  const sy = useSpring(my, { damping: 25, stiffness: 200, mass: 0.4 });

  // Rangos: -1..1 mouse → -14..14 deg de rotación
  const rotateY = useTransform(sx, [0, 1], [-14, 14]);
  const rotateX = useTransform(sy, [0, 1], [10, -10]);

  // Para capas a distinto Z
  const shiftX = useTransform(sx, [0, 1], ['-8px', '8px']);
  const shiftY = useTransform(sy, [0, 1], ['-6px', '6px']);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  function onLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative aspect-[4/5] w-full select-none overflow-hidden bg-[var(--color-bg-card)]"
      style={{ perspective: '1500px' }}
    >
      {/* Capa imagen base */}
      <motion.div
        className="absolute inset-0"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={alt} className="h-full w-full object-cover" />

        {/* Capa "bordado" del nombre con depth */}
        {embroidery ? (
          <motion.div
            className="absolute inset-x-0 bottom-[24%] flex justify-center"
            style={{
              x: shiftX,
              y: shiftY,
              transform: 'translateZ(34px)',
              transformStyle: 'preserve-3d',
            }}
          >
            <span
              className="font-display text-[clamp(2rem,6vw,3.5rem)] uppercase leading-none tracking-[-0.02em] text-[var(--color-blood-400)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
              style={{ WebkitTextStroke: '0.5px rgba(0,0,0,0.6)' }}
            >
              {embroidery}
            </span>
          </motion.div>
        ) : null}

        {/* Capa bandera */}
        {flag ? (
          <motion.div
            className="absolute right-[12%] bottom-[18%] text-4xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
            style={{
              transform: 'translateZ(20px)',
              transformStyle: 'preserve-3d',
            }}
          >
            {flag}
          </motion.div>
        ) : null}
      </motion.div>

      {/* Hint indicador */}
      <p className="absolute left-3 bottom-3 z-[2] font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-canvas-0)]/70">
        {'// mueve el cursor'}
      </p>
    </div>
  );
}
