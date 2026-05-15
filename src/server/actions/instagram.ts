'use server';

import { revalidateTag } from 'next/cache';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { instagramItems } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth/require-admin';

const ItemSchema = z.object({
  imageUrl: z.string().url(),
  caption: z.string().max(500).optional().nullable(),
  permalink: z.string().url().optional().nullable(),
  displayOrder: z.number().int().min(0).max(999),
});

export type InstagramFormState = { error: string | null };

export async function addInstagramItemAction(
  _prev: InstagramFormState,
  formData: FormData,
): Promise<InstagramFormState> {
  await requireAdmin();
  const parsed = ItemSchema.safeParse({
    imageUrl: (formData.get('imageUrl') as string)?.trim(),
    caption: ((formData.get('caption') as string) || '').trim() || null,
    permalink: ((formData.get('permalink') as string) || '').trim() || null,
    displayOrder: Number(formData.get('displayOrder') ?? 0),
  });
  if (!parsed.success) return { error: 'URL de imagen inválida.' };

  await db.insert(instagramItems).values({
    imageUrl: parsed.data.imageUrl,
    caption: parsed.data.caption,
    permalink: parsed.data.permalink,
    displayOrder: parsed.data.displayOrder,
    isManual: true,
  });
  revalidateTag('instagram', 'default');
  return { error: null };
}

export async function deleteInstagramItemAction(id: string) {
  await requireAdmin();
  await db.delete(instagramItems).where(eq(instagramItems.id, id));
  revalidateTag('instagram', 'default');
}
