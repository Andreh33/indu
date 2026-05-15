'use client';

import Link from 'next/link';
import { selectWishlistCount, useWishlistStore } from '@/lib/wishlist/store';

export default function WishlistBadge() {
  const count = useWishlistStore(selectWishlistCount);
  return (
    <Link
      href="/wishlist"
      aria-label={`Lista de favoritos · ${count}`}
      className="flex items-center gap-2 px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-canvas-0)] hover:text-[var(--color-blood-300)]"
    >
      <span>Lista</span>
      <span
        className={
          count > 0
            ? 'inline-flex h-5 min-w-5 items-center justify-center bg-[var(--color-blood-400)] px-1 text-[10px] tabular-nums text-[var(--color-canvas-0)]'
            : 'inline-flex h-5 min-w-5 items-center justify-center border border-[var(--color-canvas-500)] px-1 text-[10px] tabular-nums text-[var(--color-fg-subtle)]'
        }
      >
        {count}
      </span>
    </Link>
  );
}
