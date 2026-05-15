'use client';

import { useCartStore, selectItemCount } from '@/lib/cart/store';
import { motion } from 'framer-motion';

export default function CartBadge() {
  const count = useCartStore(selectItemCount);
  const open = useCartStore((s) => s.open);

  return (
    <button
      onClick={open}
      aria-label={`Abrir carrito · ${count} item${count === 1 ? '' : 's'}`}
      className="relative flex items-center gap-2 px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-canvas-0)] hover:text-[var(--color-blood-300)]"
    >
      <span>Carrito</span>
      <motion.span
        key={count}
        initial={{ scale: 1.4 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        className={
          count > 0
            ? 'inline-flex h-5 min-w-5 items-center justify-center bg-[var(--color-blood-400)] px-1 text-[10px] tabular-nums text-[var(--color-canvas-0)]'
            : 'inline-flex h-5 min-w-5 items-center justify-center border border-[var(--color-canvas-500)] px-1 text-[10px] tabular-nums text-[var(--color-fg-subtle)]'
        }
      >
        {count}
      </motion.span>
    </button>
  );
}
