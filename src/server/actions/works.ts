'use server';

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { workImages, works } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth/require-admin';
import { slugify } from '@/lib/utils/slugify';

const WorkSchema = z.object({
  title: z.string().min(2).max(120),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  clientName: z.string().min(1).max(120),
  city: z.string().max(80).optional().nullable(),
  year: z.number().int().min(2000).max(2100).optional().nullable(),
  type: z.enum(['gym', 'fighter', 'event', 'brand']),
  units: z.number().int().min(1).max(10000),
  brief: z.string().max(2000).optional().nullable(),
  process: z.string().max(2000).optional().nullable(),
  quoteText: z.string().max(280).optional().nullable(),
  quoteAuthor: z.string().max(120).optional().nullable(),
  quoteRole: z.string().max(120).optional().nullable(),
  published: z.boolean(),
  displayOrder: z.number().int().min(0).max(999),
  heroImageUrls: z.array(z.string().url()).max(3),
  resultImageUrls: z.array(z.string().url()).max(20),
});

export type WorkFormState = {
  error: string | null;
  fieldErrors?: Record<string, string[]>;
};

function parseForm(formData: FormData) {
  const arr = (key: string) =>
    (formData.get(key) as string | null)
      ?.split('\n')
      .map((s) => s.trim())
      .filter(Boolean) ?? [];
  return {
    title: formData.get('title') as string,
    slug:
      (formData.get('slug') as string)?.trim() ||
      slugify(formData.get('title') as string),
    clientName: formData.get('clientName') as string,
    city: ((formData.get('city') as string) || '').trim() || null,
    year: formData.get('year') ? Number(formData.get('year')) : null,
    type: formData.get('type') as 'gym' | 'fighter' | 'event' | 'brand',
    units: Number(formData.get('units') || 1),
    brief: ((formData.get('brief') as string) || '').trim() || null,
    process: ((formData.get('process') as string) || '').trim() || null,
    quoteText: ((formData.get('quoteText') as string) || '').trim() || null,
    quoteAuthor: ((formData.get('quoteAuthor') as string) || '').trim() || null,
    quoteRole: ((formData.get('quoteRole') as string) || '').trim() || null,
    published: formData.get('published') === 'on',
    displayOrder: Number(formData.get('displayOrder') || 0),
    heroImageUrls: arr('heroImageUrls'),
    resultImageUrls: arr('resultImageUrls'),
  };
}

function buildImageRows(workId: string, heroUrls: string[], resultUrls: string[]) {
  const rows: (typeof workImages.$inferInsert)[] = [];
  heroUrls.forEach((url, i) =>
    rows.push({
      id: crypto.randomUUID(),
      workId,
      url,
      type: 'hero',
      displayOrder: i,
    }),
  );
  resultUrls.forEach((url, i) =>
    rows.push({
      id: crypto.randomUUID(),
      workId,
      url,
      type: 'result',
      displayOrder: i,
    }),
  );
  return rows;
}

export async function createWorkAction(
  _prev: WorkFormState,
  formData: FormData,
): Promise<WorkFormState> {
  await requireAdmin();
  const raw = parseForm(formData);
  const parsed = WorkSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: 'Datos inválidos.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await db
    .select()
    .from(works)
    .where(eq(works.slug, parsed.data.slug))
    .limit(1);
  if (existing[0]) return { error: 'Ese slug ya existe.' };

  const id = crypto.randomUUID();
  const quote =
    parsed.data.quoteText && parsed.data.quoteAuthor
      ? {
          text: parsed.data.quoteText,
          author: parsed.data.quoteAuthor,
          role: parsed.data.quoteRole ?? undefined,
        }
      : null;

  await db.insert(works).values({
    id,
    slug: parsed.data.slug,
    title: parsed.data.title,
    clientName: parsed.data.clientName,
    city: parsed.data.city,
    year: parsed.data.year,
    type: parsed.data.type,
    units: parsed.data.units,
    brief: parsed.data.brief,
    process: parsed.data.process,
    quote,
    published: parsed.data.published,
    publishedAt: parsed.data.published ? new Date() : null,
    displayOrder: parsed.data.displayOrder,
  });

  const imgs = buildImageRows(id, parsed.data.heroImageUrls, parsed.data.resultImageUrls);
  if (imgs.length) await db.insert(workImages).values(imgs);

  updateTag('works');
  redirect(`/admin/galeria/${id}/editar`);
}

export async function updateWorkAction(
  id: string,
  _prev: WorkFormState,
  formData: FormData,
): Promise<WorkFormState> {
  await requireAdmin();
  const raw = parseForm(formData);
  const parsed = WorkSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: 'Datos inválidos.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await db
    .select()
    .from(works)
    .where(eq(works.slug, parsed.data.slug))
    .limit(1);
  if (existing[0] && existing[0].id !== id) {
    return { error: 'Ese slug ya lo usa otro trabajo.' };
  }

  const quote =
    parsed.data.quoteText && parsed.data.quoteAuthor
      ? {
          text: parsed.data.quoteText,
          author: parsed.data.quoteAuthor,
          role: parsed.data.quoteRole ?? undefined,
        }
      : null;

  const prev = await db.select().from(works).where(eq(works.id, id)).limit(1);
  const prevPublished = prev[0]?.published ?? false;

  await db
    .update(works)
    .set({
      slug: parsed.data.slug,
      title: parsed.data.title,
      clientName: parsed.data.clientName,
      city: parsed.data.city,
      year: parsed.data.year,
      type: parsed.data.type,
      units: parsed.data.units,
      brief: parsed.data.brief,
      process: parsed.data.process,
      quote,
      published: parsed.data.published,
      publishedAt:
        parsed.data.published && !prevPublished
          ? new Date()
          : parsed.data.published
            ? prev[0]?.publishedAt ?? new Date()
            : null,
      displayOrder: parsed.data.displayOrder,
    })
    .where(eq(works.id, id));

  await db.delete(workImages).where(eq(workImages.workId, id));
  const imgs = buildImageRows(id, parsed.data.heroImageUrls, parsed.data.resultImageUrls);
  if (imgs.length) await db.insert(workImages).values(imgs);

  updateTag('works');
  return { error: null };
}

export async function deleteWorkAction(id: string) {
  await requireAdmin();
  await db.delete(works).where(eq(works.id, id));
  updateTag('works');
  redirect('/admin/galeria');
}
