'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import LogoWordmark from '@/components/brand/logo-wordmark';

const STORAGE_KEY = 'if-intro-shown';
const DURATION_MS = 1600;

/**
 * Intro fullscreen al primer load por sesión. Aparece el wordmark + barra de
 * progreso + cierre con clip-path. Se persiste para no repetir entre páginas.
 */
export default function LoadingIntro() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return !sessionStorage.getItem(STORAGE_KEY);
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem(STORAGE_KEY, '1');
      } catch {
        /* ignore */
      }
    }, DURATION_MS);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          aria-hidden
          initial={{ opacity: 1 }}
          exit={{
            clipPath: 'inset(0 0 100% 0)',
            transition: { duration: 0.7, ease: [0.7, 0, 0.2, 1] },
          }}
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[var(--color-canvas-950)]"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="text-[var(--color-canvas-0)]"
          >
            <LogoWordmark className="h-9 md:h-12" />
          </motion.div>

          {/* Barra de progreso */}
          <div className="mt-12 h-px w-64 overflow-hidden bg-[var(--color-canvas-800)] md:w-80">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: DURATION_MS / 1000 - 0.2, ease: [0.7, 0, 0.2, 1] }}
              style={{ originX: 0 }}
              className="h-full bg-[var(--color-blood-400)]"
            />
          </div>

          {/* Eyebrow inferior */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="absolute bottom-8 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--color-blood-400)]"
          >
            DE DONDE VENIMOS SE LUCHA CADA DÍA
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
