import type { Metadata } from 'next';
import Container from '@/components/ui/container';
import FilterBar from '@/components/shop/filter-bar';
import ShopExplorer from '@/components/shop/shop-explorer';
import { getCategories, getPublishedProducts } from '@/server/queries/products';

export const metadata: Metadata = {
  title: 'Tienda',
  description: 'Todo el catálogo de Industrial Fighters: shorts, guantes, ropa MMA y bucales.',
};

export default async function ShopPage() {
  const [categories, products] = await Promise.all([getCategories(), getPublishedProducts()]);

  return (
    <>
      <section className="relative flex h-[40vh] items-end overflow-hidden border-b border-[var(--color-border)]">
        <Container size="max" className="py-12">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
            {'// ESQUINA 01 — TIENDA'}
          </p>
          <h1
            className="mt-2 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
            style={{ fontSize: 'var(--text-5xl)' }}
          >
            Equipamiento.
          </h1>
          <p className="mt-3 max-w-prose text-[var(--color-fg-muted)]">
            Cada prenda se cose por encargo y se personaliza por defecto. Pídelo, te lo hacemos.
          </p>
        </Container>
      </section>

      <FilterBar categories={categories} />

      <Container size="max" className="py-16">
        <ShopExplorer products={products} />
      </Container>
    </>
  );
}
