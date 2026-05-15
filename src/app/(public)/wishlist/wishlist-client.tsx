'use client';

import Link from 'next/link';
import { useWishlistStore } from '@/lib/wishlist/store';
import ProductGrid from '@/components/shop/product-grid';
import type { ProductWithImages } from '@/server/queries/products';

export default function WishlistClient({ allProducts }: { allProducts: ProductWithImages[] }) {
  const slugs = useWishlistStore((s) => s.slugs);
  const hydrated = useWishlistStore((s) => s.hydrated);
  const clear = useWishlistStore((s) => s.clear);

  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse bg-[var(--color-bg-card)]" />
        ))}
      </div>
    );
  }

  const items = allProducts.filter((p) => slugs.includes(p.slug));

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-6 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-12">
        <p className="font-display text-3xl uppercase leading-[0.9] text-[var(--color-canvas-0)]">
          No has guardado nada todavía.
        </p>
        <p className="max-w-prose text-[var(--color-fg-muted)]">
          Pulsa el corazón sobre cualquier producto para guardarlo aquí. Se queda en tu navegador.
        </p>
        <Link
          href="/shop"
          className="flex h-12 items-center justify-center bg-[var(--color-blood-400)] px-8 font-display text-sm uppercase tracking-[0.06em] text-[var(--color-canvas-0)] hover:bg-[var(--color-blood-300)]"
        >
          Ir a la tienda →
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="font-mono text-xs text-[var(--color-fg-muted)]">
          {items.length} {items.length === 1 ? 'producto' : 'productos'}
        </p>
        <button
          onClick={clear}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)] hover:text-[var(--color-blood-300)]"
        >
          Vaciar lista
        </button>
      </div>
      <ProductGrid products={items} />
    </>
  );
}
