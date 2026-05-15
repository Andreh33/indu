'use server';

import { revalidateTag } from 'next/cache';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { productVariants } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth/require-admin';

const VariantSchema = z.object({
  productId: z.string().uuid(),
  sku: z.string().min(1).max(80),
  size: z.string().max(20).optional().nullable(),
  color: z.string().max(40).optional().nullable(),
  weight: z.string().max(20).optional().nullable(),
  stockQuantity: z.number().int().min(0).nullable(),
  priceCents: z.number().int().min(0).nullable(),
  active: z.boolean(),
});

export type VariantFormState = { error: string | null };

function parse(formData: FormData) {
  const stockRaw = (formData.get('stockQuantity') as string) ?? '';
  const priceRaw = (formData.get('priceEuros') as string) ?? '';
  return {
    productId: formData.get('productId') as string,
    sku: (formData.get('sku') as string).trim(),
    size: ((formData.get('size') as string) || '').trim() || null,
    color: ((formData.get('color') as string) || '').trim() || null,
    weight: ((formData.get('weight') as string) || '').trim() || null,
    stockQuantity: stockRaw === '' ? null : Number(stockRaw),
    priceCents: priceRaw === '' ? null : Math.round(Number(priceRaw) * 100),
    active: formData.get('active') === 'on',
  };
}

export async function createVariantAction(
  _prev: VariantFormState,
  formData: FormData,
): Promise<VariantFormState> {
  await requireAdmin();
  const parsed = VariantSchema.safeParse(parse(formData));
  if (!parsed.success) return { error: 'Datos inválidos.' };

  await db.insert(productVariants).values({
    productId: parsed.data.productId,
    sku: parsed.data.sku,
    size: parsed.data.size,
    color: parsed.data.color,
    weight: parsed.data.weight,
    stockQuantity: parsed.data.stockQuantity,
    priceCents: parsed.data.priceCents,
    active: parsed.data.active,
  });

  revalidateTag('products', 'default');
  return { error: null };
}

export async function deleteVariantAction(id: string) {
  await requireAdmin();
  await db.delete(productVariants).where(eq(productVariants.id, id));
  revalidateTag('products', 'default');
}
