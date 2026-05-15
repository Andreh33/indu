import Link from 'next/link';
import { getAllPostsAdmin } from '@/server/queries/posts';

export default async function AdminBlogPage() {
  const rows = await getAllPostsAdmin();

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            {'// DIARIO'}
          </p>
          <h1
            className="mt-2 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
            style={{ fontSize: 'var(--text-3xl)' }}
          >
            Blog
          </h1>
        </div>
        <Link
          href="/admin/blog/nuevo"
          className="inline-flex h-11 items-center bg-[var(--color-blood-400)] px-6 font-display text-sm uppercase tracking-[0.06em] text-[var(--color-canvas-0)] hover:bg-[var(--color-blood-300)]"
        >
          Nuevo post
        </Link>
      </div>

      <div className="mt-8 overflow-hidden border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-bg-elevated)]">
            <tr className="text-left font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Publicado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {rows.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <p className="text-[var(--color-canvas-0)]">{p.title}</p>
                  <p className="font-mono text-[10px] text-[var(--color-fg-subtle)]">{p.slug}</p>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--color-fg-muted)]">
                  {p.tags.join(', ') || '—'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      p.status === 'published'
                        ? 'inline-block bg-[var(--color-success)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-canvas-0)]'
                        : 'inline-block border border-[var(--color-border)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]'
                    }
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--color-fg-muted)]">
                  {p.publishedAt?.toLocaleDateString('es-ES') ?? '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/blog/${p.id}/editar`}
                    className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-blood-400)] hover:text-[var(--color-blood-300)]"
                  >
                    Editar →
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[var(--color-fg-muted)]">
                  Sin posts.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
