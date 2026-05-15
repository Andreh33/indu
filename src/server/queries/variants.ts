import 'server-only';
import { and, asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { productVariants } from '@/lib/db/schema';

export async function getVariantsByProductId(productId: string) {
  return db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, productId))
    .orderBy(asc(productVariants.createdAt));
}

export async function isProductInStock(productId: string): Promise<boolean> {
  const rows = await db
    .select()
    .from(productVariants)
    .where(and(eq(productVariants.productId, productId), eq(productVariants.active, true)));
  if (rows.length === 0) return true; // sin variantes = stock infinito
  return rows.some((v) => v.stockQuantity === null || (v.stockQuantity ?? 0) > 0);
}

/** Stock map por slug → boolean para batch en /shop */
export async function getInStockMap(): Promise<Record<string, boolean>> {
  const all = await db.select().from(productVariants).where(eq(productVariants.active, true));
  const byProduct = new Map<string, boolean>();
  for (const v of all) {
    const has = v.stockQuantity === null || (v.stockQuantity ?? 0) > 0;
    if (!byProduct.has(v.productId)) byProduct.set(v.productId, has);
    else if (has) byProduct.set(v.productId, true);
  }
  return Object.fromEntries(byProduct.entries());
}
