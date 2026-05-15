import Link from 'next/link';
import { notFound } from 'next/navigation';
import PostForm from '../../_components/post-form';
import DeletePostButton from './delete-button';
import { getPostById } from '@/server/queries/posts';

type Params = { id: string };

export default async function EditPostPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          href="/admin/blog"
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-canvas-0)]"
        >
          ← Volver
        </Link>
        <DeletePostButton id={post.id} title={post.title} />
      </div>
      <h1
        className="mt-3 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
        style={{ fontSize: 'var(--text-3xl)' }}
      >
        {post.title}
      </h1>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
        {post.slug}
      </p>
      <div className="mt-8">
        <PostForm post={post} />
      </div>
    </div>
  );
}
