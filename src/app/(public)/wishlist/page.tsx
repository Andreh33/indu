import type { Metadata } from 'next';
import Container from '@/components/ui/container';
import WishlistClient from './wishlist-client';
import { getPublishedProducts } from '@/server/queries/products';

export const metadata: Metadata = {
  title: 'Tu lista',
  description: 'Productos guardados para más tarde.',
  robots: { index: false, follow: false },
};

export default async function WishlistPage() {
  const products = await getPublishedProducts();
  return (
    <Container size="max" className="py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
        {'// FAVORITOS'}
      </p>
      <h1
        className="mt-2 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
        style={{ fontSize: 'var(--text-4xl)' }}
      >
        Tu lista.
      </h1>
      <p className="mt-3 max-w-prose text-[var(--color-fg-muted)]">
        Lo que has guardado para volver más tarde. Se sincroniza con tu navegador.
      </p>
      <div className="mt-12">
        <WishlistClient allProducts={products} />
      </div>
    </Container>
  );
}
