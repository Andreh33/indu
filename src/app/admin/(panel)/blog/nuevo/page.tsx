import Link from 'next/link';
import PostForm from '../_components/post-form';

export default function NewPostPage() {
  return (
    <div>
      <Link
        href="/admin/blog"
        className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-canvas-0)]"
      >
        ← Volver
      </Link>
      <h1
        className="mt-3 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
        style={{ fontSize: 'var(--text-3xl)' }}
      >
        Nuevo post
      </h1>
      <div className="mt-8">
        <PostForm />
      </div>
    </div>
  );
}
