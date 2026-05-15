'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { posts } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth/require-admin';
import { slugify } from '@/lib/utils/slugify';

const PostSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(10).max(50_000),
  coverUrl: z.string().url().optional().nullable(),
  authorName: z.string().max(120).optional().nullable(),
  tags: z.array(z.string().min(1).max(40)).max(8),
  status: z.enum(['draft', 'published']),
});

export type PostFormState = {
  error: string | null;
  fieldErrors?: Record<string, string[]>;
};

function parseForm(formData: FormData) {
  const title = (formData.get('title') as string) || '';
  const tagsRaw = (formData.get('tags') as string | null) ?? '';
  return {
    title,
    slug: ((formData.get('slug') as string) || '').trim() || slugify(title),
    excerpt: ((formData.get('excerpt') as string) || '').trim() || null,
    content: (formData.get('content') as string) || '',
    coverUrl: ((formData.get('coverUrl') as string) || '').trim() || null,
    authorName: ((formData.get('authorName') as string) || '').trim() || null,
    tags: tagsRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    status: (formData.get('status') as 'draft' | 'published') ?? 'draft',
  };
}

export async function createPostAction(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  await requireAdmin();
  const raw = parseForm(formData);
  const parsed = PostSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: 'Datos inválidos.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await db.select().from(posts).where(eq(posts.slug, parsed.data.slug)).limit(1);
  if (existing[0]) return { error: 'Ese slug ya existe.' };

  const id = crypto.randomUUID();
  await db.insert(posts).values({
    id,
    slug: parsed.data.slug,
    title: parsed.data.title,
    excerpt: parsed.data.excerpt,
    content: parsed.data.content,
    coverUrl: parsed.data.coverUrl,
    authorName: parsed.data.authorName,
    tags: parsed.data.tags,
    status: parsed.data.status,
    publishedAt: parsed.data.status === 'published' ? new Date() : null,
  });

  revalidateTag('posts', 'default');
  redirect(`/admin/blog/${id}/editar`);
}

export async function updatePostAction(
  id: string,
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  await requireAdmin();
  const raw = parseForm(formData);
  const parsed = PostSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: 'Datos inválidos.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await db.select().from(posts).where(eq(posts.slug, parsed.data.slug)).limit(1);
  if (existing[0] && existing[0].id !== id) {
    return { error: 'Ese slug ya lo usa otro post.' };
  }

  const prev = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  const prevPublished = prev[0]?.status === 'published';

  await db
    .update(posts)
    .set({
      slug: parsed.data.slug,
      title: parsed.data.title,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      coverUrl: parsed.data.coverUrl,
      authorName: parsed.data.authorName,
      tags: parsed.data.tags,
      status: parsed.data.status,
      publishedAt:
        parsed.data.status === 'published' && !prevPublished
          ? new Date()
          : parsed.data.status === 'published'
            ? prev[0]?.publishedAt ?? new Date()
            : null,
    })
    .where(eq(posts.id, id));

  revalidateTag('posts', 'default');
  return { error: null };
}

export async function deletePostAction(id: string) {
  await requireAdmin();
  await db.delete(posts).where(eq(posts.id, id));
  revalidateTag('posts', 'default');
  redirect('/admin/blog');
}
