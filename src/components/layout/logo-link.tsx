'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import { useRef, useState } from 'react';
import LogoWordmark from '@/components/brand/logo-wordmark';

const THRESHOLD = 5;
const WINDOW_MS = 2000;

export default function LogoLink() {
  const [open, setOpen] = useState(false);
  const clicks = useRef<number[]>([]);

  function onClick(e: React.MouseEvent) {
    const now = Date.now();
    clicks.current = clicks.current.filter((t) => now - t < WINDOW_MS);
    clicks.current.push(now);
    if (clicks.current.length >= THRESHOLD) {
      e.preventDefault();
      clicks.current = [];
      setOpen(true);
    }
  }

  return (
    <>
      <Link
        href="/"
        onClick={onClick}
        aria-label="Industrial Fighters · Inicio"
        className="block text-[var(--color-canvas-0)] transition-colors hover:text-[var(--color-blood-300)]"
      >
        <LogoWordmark className="h-10 md:h-12" />
      </Link>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[91] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 border border-[var(--color-blood-400)] bg-[var(--color-bg-elevated)] p-8">
            <Dialog.Title className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-blood-300)]">
              {'// CREDITS · 5-CLICK'}
            </Dialog.Title>
            <p className="mt-4 font-display text-3xl uppercase leading-[0.9] text-[var(--color-canvas-0)]">
              Industrial
              <br /> Fighters.
            </p>
            <dl className="mt-6 grid grid-cols-[80px_1fr] gap-y-2 font-mono text-xs">
              <dt className="text-[var(--color-fg-subtle)]">Versión</dt>
              <dd className="text-[var(--color-fg)]">v1.0</dd>
              <dt className="text-[var(--color-fg-subtle)]">Hecho en</dt>
              <dd className="text-[var(--color-fg)]">Bilbao</dd>
              <dt className="text-[var(--color-fg-subtle)]">Stack</dt>
              <dd className="text-[var(--color-fg)]">Next 16 · Turso · R3F · GSAP</dd>
            </dl>
            <p className="mt-6 text-sm text-[var(--color-fg-muted)]">
              Si has llegado hasta aquí, ya eres de la esquina.
            </p>
            <Dialog.Close asChild>
              <button className="mt-6 h-10 bg-[var(--color-blood-400)] px-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-canvas-0)] hover:bg-[var(--color-blood-300)]">
                Cerrar
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
