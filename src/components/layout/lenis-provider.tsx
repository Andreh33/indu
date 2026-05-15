'use client';

import { ReactLenis } from 'lenis/react';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  return (
    <ReactLenis
      root
      options={{
        lerp: reduced ? 1 : 0.08,
        wheelMultiplier: 1,
        smoothWheel: !reduced,
        syncTouch: false,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
