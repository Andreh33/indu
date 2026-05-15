'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { useCursorStore } from '@/lib/cursor/store';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils/cn';

type MagneticButtonProps = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  strength?: number;
  cursorLabel?: string;
  className?: string;
};

export default function MagneticButton({
  href,
  onClick,
  children,
  strength = 0.4,
  cursorLabel = 'VER',
  className,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isCoarse = useMediaQuery('(pointer: coarse)');
  const setCursor = useCursorStore((s) => s.setCursor);
  const reset = useCursorStore((s) => s.reset);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const innerX = useMotionValue(0);
  const innerY = useMotionValue(0);

  const sx = useSpring(x, { damping: 20, stiffness: 250, mass: 0.5 });
  const sy = useSpring(y, { damping: 20, stiffness: 250, mass: 0.5 });
  const six = useSpring(innerX, { damping: 20, stiffness: 250, mass: 0.5 });
  const siy = useSpring(innerY, { damping: 20, stiffness: 250, mass: 0.5 });

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (isCoarse || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    x.set(dx);
    y.set(dy);
    innerX.set(dx * 0.5);
    innerY.set(dy * 0.5);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
    innerX.set(0);
    innerY.set(0);
    reset();
  }

  function onEnter() {
    setCursor('link', cursorLabel);
  }

  const Tag: 'a' | 'button' = href ? 'a' : 'button';

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerEnter={onEnter}
      style={{ x: sx, y: sy }}
      className="inline-block"
    >
      <Tag
        href={href}
        onClick={onClick}
        className={cn('inline-block', className)}
      >
        <motion.span style={{ x: six, y: siy, display: 'inline-block' }}>{children}</motion.span>
      </Tag>
    </motion.div>
  );
}
