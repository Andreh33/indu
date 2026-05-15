'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useKonami } from '@/hooks/use-konami';

const BONUS_KEY = 'if-bonus-unlocked';
const BONUS_CODE = 'BARRIO-10';

export default function KonamiEasterEgg() {
  const [visible, setVisible] = useState(false);

  useKonami(() => {
    try {
      localStorage.setItem(BONUS_KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(true);
    window.setTimeout(() => setVisible(false), 9000);
  });

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.7, 0, 0.2, 1] }}
          className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 border border-[var(--color-blood-400)] bg-[var(--color-bg-elevated)] px-6 py-5 shadow-[var(--shadow-modal)] max-w-[90vw]"
          role="status"
          aria-live="polite"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-blood-300)]">
            {'// ROUND BONUS DESBLOQUEADO'}
          </p>
          <p className="mt-2 font-display text-2xl uppercase leading-tight text-[var(--color-canvas-0)]">
            10% en tu primera compra.
          </p>
          <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
            Usa el código{' '}
            <span className="bg-[var(--color-blood-400)] px-2 py-0.5 font-mono text-xs tracking-[0.2em] text-[var(--color-canvas-0)]">
              {BONUS_CODE}
            </span>{' '}
            al confirmar tu pedido por WhatsApp.
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
