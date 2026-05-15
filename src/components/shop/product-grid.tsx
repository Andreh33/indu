import ProductCard from './product-card';
import type { ProductWithImages } from '@/server/queries/products';

export default function ProductGrid({ products }: { products: ProductWithImages[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-32 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
          {'// SACO VACÍO'}
        </p>
        <h2 className="font-display text-3xl uppercase text-[var(--color-canvas-0)]">
          Aún no hay nada
          <br /> en esta categoría.
        </h2>
        <p className="max-w-md text-[var(--color-fg-muted)]">Pronto.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
