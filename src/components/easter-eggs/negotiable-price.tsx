'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const SHOWN_KEY = 'if-negotiation-shown';

export default function NegotiablePrice({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  function onClick(e: React.MouseEvent) {
    if (e.detail !== 3) return; // triple click
    try {
      if (sessionStorage.getItem(SHOWN_KEY)) return;
      sessionStorage.setItem(SHOWN_KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(true);
    window.setTimeout(() => setVisible(false), 5000);
  }

  return (
    <>
      <span onClick={onClick} className="cursor-pointer select-none">
        {children}
      </span>
      <AnimatePresence>
        {visible ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.35 }}
            className="fixed bottom-6 right-6 z-[90] max-w-xs border border-[var(--color-blood-400)] bg-[var(--color-bg-elevated)] p-4 font-mono text-xs leading-relaxed text-[var(--color-fg)] shadow-[var(--shadow-modal)]"
            role="status"
          >
            <p className="mb-1 uppercase tracking-[0.2em] text-[var(--color-blood-300)]">
              {'// negociación'}
            </p>
            Ojo: intentar negociar el precio aquí no te servirá. Pero respeto el intento.
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
