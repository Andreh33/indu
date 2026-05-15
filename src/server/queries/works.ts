import 'server-only';
import { asc, desc, eq } from 'drizzle-orm';
import { cacheLife, cacheTag } from 'next/cache';
import { db } from '@/lib/db/client';
import { workImages, works } from '@/lib/db/schema';

export async function getPublishedWorks() {
  'use cache';
  cacheLife('hours');
  cacheTag('works');
  const rows = await db
    .select()
    .from(works)
    .where(eq(works.published, true))
    .orderBy(asc(works.displayOrder));
  const images = rows.length
    ? await db.select().from(workImages).orderBy(asc(workImages.displayOrder))
    : [];
  return rows.map((w) => ({ ...w, images: images.filter((i) => i.workId === w.id) }));
}

export async function getFeaturedWorks(limit = 3) {
  'use cache';
  cacheLife('hours');
  cacheTag('works', `works:featured:${limit}`);
  const rows = await db
    .select()
    .from(works)
    .where(eq(works.published, true))
    .orderBy(desc(works.publishedAt))
    .limit(limit);
  const ids = rows.map((w) => w.id);
  const images = ids.length
    ? await db.select().from(workImages).orderBy(asc(workImages.displayOrder))
    : [];
  return rows.map((w) => ({ ...w, images: images.filter((i) => i.workId === w.id) }));
}

export async function getWorkBySlug(slug: string) {
  'use cache';
  cacheLife('hours');
  cacheTag('works', `work:${slug}`);
  const rows = await db.select().from(works).where(eq(works.slug, slug)).limit(1);
  const work = rows[0];
  if (!work || !work.published) return null;
  const images = await db
    .select()
    .from(workImages)
    .where(eq(workImages.workId, work.id))
    .orderBy(asc(workImages.displayOrder));
  return { ...work, images };
}
