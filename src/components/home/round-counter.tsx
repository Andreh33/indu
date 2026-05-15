'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/use-media-query';

const LABELS = ['01', '02', '03', '04', '05', 'FIN'];

export default function RoundCounter() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [progress, setProgress] = useState(0);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const next = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        setProgress(next);
        if (next > 0.97 && !showReward) {
          setShowReward(true);
          window.setTimeout(() => setShowReward(false), 4500);
        }
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showReward]);

  if (isMobile) return null;

  const currentIdx = Math.min(LABELS.length - 1, Math.floor(progress * LABELS.length));

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed right-6 top-1/2 z-[15] flex -translate-y-1/2 flex-col items-end gap-3 font-mono text-[10px] uppercase tracking-[0.2em]"
      >
        <span className="text-[var(--color-fg-subtle)]">ROUND</span>
        <ul className="flex flex-col gap-2">
          {LABELS.map((l, i) => {
            const active = i === currentIdx;
            const passed = i < currentIdx;
            return (
              <li
                key={l}
                className={
                  active
                    ? 'flex items-center gap-2 text-[var(--color-blood-300)]'
                    : passed
                      ? 'flex items-center gap-2 text-[var(--color-fg-muted)]'
                      : 'flex items-center gap-2 text-[var(--color-fg-subtle)]'
                }
              >
                <span
                  className={
                    active
                      ? 'inline-block h-1.5 w-6 bg-[var(--color-blood-400)]'
                      : passed
                        ? 'inline-block h-px w-6 bg-[var(--color-fg-muted)]'
                        : 'inline-block h-px w-3 bg-[var(--color-fg-subtle)]'
                  }
                />
                {l}
              </li>
            );
          })}
        </ul>
      </div>

      <AnimatePresence>
        {showReward ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className="fixed right-6 top-[calc(50%+160px)] z-[16] max-w-[200px] border border-[var(--color-success)] bg-[var(--color-bg-elevated)] p-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-canvas-0)]"
            role="status"
          >
            <p className="text-[var(--color-success)]">RESULTADO: TÚ ✓</p>
            <p className="mt-1 text-[var(--color-fg-muted)]">Gracias por leer hasta aquí.</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
