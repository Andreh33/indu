'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Props = { messages: string[] };

const DISMISS_KEY = 'if-announcement-dismissed';
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function subscribe(cb: () => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === DISMISS_KEY) cb();
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}

function isDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const v = localStorage.getItem(DISMISS_KEY);
    return !!v && Date.now() - Number(v) < DISMISS_DURATION_MS;
  } catch {
    return false;
  }
}

export default function AnnouncementBar({ messages }: Props) {
  // SSR snapshot devuelve false (no dismissed) para evitar mismatch.
  // El cliente lee del localStorage tras hidratar y oculta sin un setState extra.
  const dismissed = useSyncExternalStore(
    subscribe,
    () => isDismissed(),
    () => false,
  );
  const [localDismissed, setLocalDismissed] = useState(false);
  const [index, setIndex] = useState(0);
  const visible = !dismissed && !localDismissed;

  useEffect(() => {
    if (!visible || messages.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [visible, messages.length]);

  if (!visible || messages.length === 0) return null;

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setLocalDismissed(true);
  }

  return (
    <div className="relative z-[5] flex h-8 items-center justify-center overflow-hidden bg-[var(--color-blood-400)] text-[var(--color-canvas-0)]">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.7, 0, 0.2, 1] }}
          className="px-12 text-center font-mono text-[10px] uppercase tracking-[0.2em] md:text-xs"
        >
          {messages[index]}
        </motion.span>
      </AnimatePresence>
      <button
        onClick={dismiss}
        aria-label="Cerrar anuncio"
        className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-[var(--color-canvas-0)] opacity-70 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}
