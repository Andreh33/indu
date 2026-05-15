'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

type Props = { items: { q: string; a: string }[] };

export default function FaqAccordion({ items }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <ul className="border-t border-[var(--color-border)]">
      {items.map((item, i) => {
        const open = i === openIdx;
        return (
          <li key={i} className="border-b border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => setOpenIdx(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-[var(--color-blood-300)]"
            >
              <span className="font-display text-xl uppercase leading-tight text-[var(--color-canvas-0)] md:text-2xl">
                {item.q}
              </span>
              <span
                aria-hidden
                className={`flex h-8 w-8 flex-none items-center justify-center border border-[var(--color-border)] font-mono text-base transition-all ${
                  open
                    ? 'rotate-45 border-[var(--color-blood-400)] text-[var(--color-blood-400)]'
                    : 'text-[var(--color-fg-muted)]'
                }`}
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.7, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-prose pb-6 text-base leading-relaxed text-[var(--color-fg)]">
                    {item.a}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
