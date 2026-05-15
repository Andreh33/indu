import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@/components/ui/container';
import FilterBar from '@/components/shop/filter-bar';
import ProductGrid from '@/components/shop/product-grid';
import {
  getCategories,
  getCategoryBySlug,
  getPublishedProductsByCategorySlug,
} from '@/server/queries/products';

type Params = { category: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) return { title: 'No encontrado' };
  return {
    title: cat.name,
    description: `Catálogo de ${cat.name} de Industrial Fighters.`,
  };
}

export default async function ShopCategoryPage({ params }: { params: Promise<Params> }) {
  const { category } = await params;
  const [categories, cat, products] = await Promise.all([
    getCategories(),
    getCategoryBySlug(category),
    getPublishedProductsByCategorySlug(category),
  ]);
  if (!cat) notFound();

  return (
    <>
      <section className="relative flex h-[40vh] items-end overflow-hidden border-b border-[var(--color-border)]">
        <Container size="max" className="py-12">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            {`// CATEGORÍA · ${cat.name.toUpperCase()}`}
          </p>
          <h1
            className="mt-2 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
            style={{ fontSize: 'var(--text-5xl)' }}
          >
            {cat.name}.
          </h1>
        </Container>
      </section>

      <FilterBar categories={categories} activeSlug={cat.slug} />

      <Container size="max" className="py-16">
        <ProductGrid products={products} />
      </Container>
    </>
  );
}
