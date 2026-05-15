import 'server-only';
import { and, asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { categories, productImages, products } from '@/lib/db/schema';

export async function getCategories() {
  return db.select().from(categories).orderBy(asc(categories.displayOrder));
}

export async function getCategoryBySlug(slug: string) {
  const rows = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getCategoryById(id: string) {
  const rows = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return rows[0] ?? null;
}

export type ProductWithImages = Awaited<ReturnType<typeof getPublishedProducts>>[number];

export async function getPublishedProducts() {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.status, 'published'))
    .orderBy(asc(products.displayOrder));

  const ids = rows.map((p) => p.id);
  const images = ids.length
    ? await db.select().from(productImages).orderBy(asc(productImages.displayOrder))
    : [];

  return rows.map((p) => ({
    ...p,
    images: images.filter((i) => i.productId === p.id),
  }));
}

export async function getPublishedProductsByCategorySlug(slug: string) {
  const category = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  if (!category[0]) return [];
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.status, 'published'), eq(products.categoryId, category[0].id)))
    .orderBy(asc(products.displayOrder));
  const ids = rows.map((p) => p.id);
  const images = ids.length
    ? await db.select().from(productImages).orderBy(asc(productImages.displayOrder))
    : [];
  return rows.map((p) => ({ ...p, images: images.filter((i) => i.productId === p.id) }));
}

export async function getProductBySlug(slug: string) {
  const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  const product = rows[0];
  if (!product || product.status !== 'published') return null;
  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, product.id))
    .orderBy(asc(productImages.displayOrder));
  return { ...product, images };
}
