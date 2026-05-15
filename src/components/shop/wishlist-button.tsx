'use client';

import { motion } from 'framer-motion';
import { useWishlistStore } from '@/lib/wishlist/store';
import { cn } from '@/lib/utils/cn';

type Props = { slug: string; className?: string };

export default function WishlistButton({ slug, className }: Props) {
  const has = useWishlistStore((s) => s.slugs.includes(slug));
  const toggle = useWishlistStore((s) => s.toggle);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-label={has ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      aria-pressed={has}
      className={cn(
        'flex h-9 w-9 items-center justify-center border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/80 backdrop-blur-sm transition-colors',
        has
          ? 'border-[var(--color-blood-400)] text-[var(--color-blood-400)]'
          : 'text-[var(--color-canvas-0)] hover:border-[var(--color-blood-400)]',
        className,
      )}
    >
      <motion.svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill={has ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={has ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </motion.svg>
    </button>
  );
}
