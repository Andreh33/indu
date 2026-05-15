import Link from 'next/link';
import { asc } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { categories } from '@/lib/db/schema';
import ProductForm from '../_components/product-form';

export default async function NewProductPage() {
  const cats = await db.select().from(categories).orderBy(asc(categories.displayOrder));
  return (
    <div>
      <Link
        href="/admin/productos"
        className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-canvas-0)]"
      >
        ← Volver
      </Link>
      <h1
        className="mt-3 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
        style={{ fontSize: 'var(--text-3xl)' }}
      >
        Nuevo producto
      </h1>
      <div className="mt-8">
        <ProductForm categories={cats} />
      </div>
    </div>
  );
}
