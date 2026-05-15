'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const DISMISS_KEY = 'if-app-banner-dismissed';
const DISMISS_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 días
const APPEAR_AFTER_MS = 15_000;
const APPEAR_AFTER_SCROLL = 600;

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function wasDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const v = localStorage.getItem(DISMISS_KEY);
    return !!v && Date.now() - Number(v) < DISMISS_DURATION_MS;
  } catch {
    return false;
  }
}

export default function AppInstallBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone() || wasDismissed()) return;
    // Solo aparecemos en móvil (touch device de viewport reducido)
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) return;

    let triggered = false;
    const trigger = () => {
      if (triggered) return;
      triggered = true;
      setVisible(true);
    };
    const t = window.setTimeout(trigger, APPEAR_AFTER_MS);
    const onScroll = () => {
      if (window.scrollY > APPEAR_AFTER_SCROLL) trigger();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.45, ease: [0.7, 0, 0.2, 1] }}
          className="fixed inset-x-0 bottom-0 z-[70] border-t border-[var(--color-blood-400)] bg-[var(--color-bg-elevated)] px-5 py-4 md:hidden"
          role="dialog"
          aria-label="Instalar aplicación"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
                Industrial Fighters
              </p>
              <p className="mt-1 font-display text-lg uppercase leading-tight text-[var(--color-canvas-0)]">
                Llévatelo encima
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/app"
                className="flex h-10 items-center bg-[var(--color-blood-400)] px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-canvas-0)]"
                onClick={dismiss}
              >
                Instalar →
              </Link>
              <button
                onClick={dismiss}
                aria-label="Cerrar"
                className="flex h-10 w-10 items-center justify-center border border-[var(--color-border)] font-mono text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-canvas-0)]"
              >
                ×
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
