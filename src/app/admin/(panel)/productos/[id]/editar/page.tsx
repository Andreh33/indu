import Link from 'next/link';
import { notFound } from 'next/navigation';
import { asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { categories, productImages, products } from '@/lib/db/schema';
import ProductForm from '../../_components/product-form';
import DeleteProductButton from './delete-button';

type Params = { id: string };

export default async function EditProductPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  const product = rows[0];
  if (!product) notFound();

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, id))
    .orderBy(asc(productImages.displayOrder));
  const cats = await db.select().from(categories).orderBy(asc(categories.displayOrder));

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          href="/admin/productos"
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-canvas-0)]"
        >
          ← Volver
        </Link>
        <DeleteProductButton id={product.id} name={product.name} />
      </div>
      <h1
        className="mt-3 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
        style={{ fontSize: 'var(--text-3xl)' }}
      >
        {product.name}
      </h1>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
        {product.slug}
      </p>
      <div className="mt-8">
        <ProductForm categories={cats} product={{ ...product, images }} />
      </div>
    </div>
  );
}
