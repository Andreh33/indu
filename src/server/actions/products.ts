'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { productImages, products } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth/require-admin';
import { slugify } from '@/lib/utils/slugify';

const ColorSchema = z.object({
  name: z.string().min(1).max(40),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

const ProductSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'slug debe ser kebab-case (a-z, 0-9, guiones)'),
  categoryId: z.string().uuid('Categoría inválida'),
  type: z.string().max(40).optional().nullable(),
  shortDescription: z.string().max(280).optional().nullable(),
  longDescription: z.string().max(4000).optional().nullable(),
  basePriceCents: z.number().int().min(100).max(1_000_000),
  status: z.enum(['draft', 'published', 'archived']),
  displayOrder: z.number().int().min(0).max(999),
  availableSizes: z.array(z.string().min(1).max(8)).max(20),
  availableColors: z.array(ColorSchema).max(20),
  availableWeights: z.array(z.string().min(1).max(8)).max(10),
  imageUrls: z.array(z.string().url()).max(10),
});

export type ProductFormState = {
  error: string | null;
  fieldErrors?: Record<string, string[]>;
};

function parseFormData(formData: FormData) {
  const arr = (key: string) =>
    (formData.get(key) as string | null)
      ?.split('\n')
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  const colors: { name: string; hex: string }[] = [];
  for (const line of arr('availableColors')) {
    const [name, hex] = line.split('|').map((s) => s.trim());
    if (name && hex) colors.push({ name, hex });
  }

  return {
    name: formData.get('name') as string,
    slug: (formData.get('slug') as string)?.trim() || slugify(formData.get('name') as string),
    categoryId: formData.get('categoryId') as string,
    type: ((formData.get('type') as string) || '').trim() || null,
    shortDescription: ((formData.get('shortDescription') as string) || '').trim() || null,
    longDescription: ((formData.get('longDescription') as string) || '').trim() || null,
    basePriceCents: Math.round(Number(formData.get('priceEuros') || 0) * 100),
    status: (formData.get('status') as 'draft' | 'published' | 'archived') ?? 'draft',
    displayOrder: Number(formData.get('displayOrder') || 0),
    availableSizes: arr('availableSizes'),
    availableColors: colors,
    availableWeights: arr('availableWeights'),
    imageUrls: arr('imageUrls'),
  };
}

export async function createProductAction(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();
  const raw = parseFormData(formData);
  const parsed = ProductSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: 'Datos inválidos.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // Check slug uniqueness
  const existing = await db
    .select()
    .from(products)
    .where(eq(products.slug, parsed.data.slug))
    .limit(1);
  if (existing[0]) {
    return { error: 'Ese slug ya existe.', fieldErrors: { slug: ['ya existe'] } };
  }

  const id = crypto.randomUUID();
  await db.insert(products).values({
    id,
    name: parsed.data.name,
    slug: parsed.data.slug,
    categoryId: parsed.data.categoryId,
    type: parsed.data.type,
    shortDescription: parsed.data.shortDescription,
    longDescription: parsed.data.longDescription,
    basePriceCents: parsed.data.basePriceCents,
    status: parsed.data.status,
    displayOrder: parsed.data.displayOrder,
    availableSizes: parsed.data.availableSizes,
    availableColors: parsed.data.availableColors,
    availableWeights: parsed.data.availableWeights,
    availableFits: [],
    customizationConfig: {},
    details: {},
  });

  if (parsed.data.imageUrls.length > 0) {
    await db.insert(productImages).values(
      parsed.data.imageUrls.map((url, i) => ({
        id: crypto.randomUUID(),
        productId: id,
        url,
        alt: parsed.data.name,
        isPrimary: i === 0,
        displayOrder: i,
      })),
    );
  }

  revalidateTag('products', 'default');
  revalidateTag(`product:${parsed.data.slug}`, 'default');
  redirect(`/admin/productos/${id}/editar`);
}

export async function updateProductAction(
  id: string,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();
  const raw = parseFormData(formData);
  const parsed = ProductSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: 'Datos inválidos.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // Slug uniqueness excluyendo el propio id
  const existing = await db
    .select()
    .from(products)
    .where(eq(products.slug, parsed.data.slug))
    .limit(1);
  if (existing[0] && existing[0].id !== id) {
    return { error: 'Ese slug ya lo usa otro producto.', fieldErrors: { slug: ['ya existe'] } };
  }

  await db
    .update(products)
    .set({
      name: parsed.data.name,
      slug: parsed.data.slug,
      categoryId: parsed.data.categoryId,
      type: parsed.data.type,
      shortDescription: parsed.data.shortDescription,
      longDescription: parsed.data.longDescription,
      basePriceCents: parsed.data.basePriceCents,
      status: parsed.data.status,
      displayOrder: parsed.data.displayOrder,
      availableSizes: parsed.data.availableSizes,
      availableColors: parsed.data.availableColors,
      availableWeights: parsed.data.availableWeights,
    })
    .where(eq(products.id, id));

  // Reset y reinserta imágenes (simple, suficiente para v1)
  await db.delete(productImages).where(eq(productImages.productId, id));
  if (parsed.data.imageUrls.length > 0) {
    await db.insert(productImages).values(
      parsed.data.imageUrls.map((url, i) => ({
        id: crypto.randomUUID(),
        productId: id,
        url,
        alt: parsed.data.name,
        isPrimary: i === 0,
        displayOrder: i,
      })),
    );
  }

  revalidateTag('products', 'default');
  revalidateTag(`product:${parsed.data.slug}`, 'default');
  return { error: null };
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  await db.delete(products).where(eq(products.id, id));
  revalidateTag('products', 'default');
  redirect('/admin/productos');
}
