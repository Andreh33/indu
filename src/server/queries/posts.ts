import 'server-only';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { posts } from '@/lib/db/schema';

export async function getPublishedPosts() {
  return db
    .select()
    .from(posts)
    .where(eq(posts.status, 'published'))
    .orderBy(desc(posts.publishedAt));
}

export async function getPostBySlug(slug: string) {
  const rows = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  const post = rows[0];
  if (!post || post.status !== 'published') return null;
  return post;
}

export async function getAllPostsAdmin() {
  return db.select().from(posts).orderBy(desc(posts.createdAt));
}

export async function getPostById(id: string) {
  const rows = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getRelatedPosts(currentSlug: string, limit = 3) {
  return db
    .select()
    .from(posts)
    .where(and(eq(posts.status, 'published')))
    .orderBy(desc(posts.publishedAt))
    .limit(limit + 1)
    .then((rows) => rows.filter((r) => r.slug !== currentSlug).slice(0, limit));
}
