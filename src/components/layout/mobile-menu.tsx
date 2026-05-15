'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

const LINKS = [
  { href: '/shop', label: 'Tienda' },
  { href: '/trabajos', label: 'Trabajos' },
  { href: '/blog', label: 'Diario' },
  { href: '/app', label: 'Nuestra app' },
  { href: '/wishlist', label: 'Lista' },
  { href: '/sobre-nosotros', label: 'Sobre nosotros' },
  { href: '/faq', label: 'FAQ' },
  { href: '/carrito', label: 'Carrito' },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
      >
        <span className="block h-px w-6 bg-[var(--color-canvas-0)]" />
        <span className="block h-px w-6 bg-[var(--color-canvas-0)]" />
        <span className="block h-px w-4 bg-[var(--color-canvas-0)]" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex flex-col bg-[var(--color-bg)]"
          >
            <div className="flex h-16 items-center justify-between px-6">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
                Menú
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="font-mono text-sm text-[var(--color-canvas-0)]"
              >
                CERRAR ×
              </button>
            </div>
            <nav className="flex flex-1 flex-col items-start gap-1 px-6 pt-12">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.08 * i, duration: 0.45, ease: [0.7, 0, 0.2, 1] }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block font-display text-5xl uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)] hover:text-[var(--color-blood-300)]"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <p className="px-6 pb-8 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
              De donde venimos se lucha cada día.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
