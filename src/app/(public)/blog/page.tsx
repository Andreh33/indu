import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/container';
import { getPublishedPosts } from '@/server/queries/posts';

export const metadata: Metadata = {
  title: 'Diario',
  description:
    'Historias del taller, fighters, gimnasios y combates. Lo que pasa entre rounds.',
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();
  return (
    <>
      <section className="border-b border-[var(--color-border)]">
        <Container size="max" className="py-20">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
            {'// DIARIO DE TALLER'}
          </p>
          <h1
            className="mt-3 font-display uppercase leading-[0.85] tracking-[-0.02em] text-[var(--color-canvas-0)]"
            style={{ fontSize: 'var(--text-5xl)' }}
          >
            Lo que pasa
            <br /> entre rounds.
          </h1>
        </Container>
      </section>

      <Container size="max" className="py-16">
        {posts.length === 0 ? (
          <p className="py-24 text-center text-[var(--color-fg-muted)]">
            Aún no hemos publicado nada. Pronto.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-x-6 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col gap-4"
                >
                  {p.coverUrl ? (
                    <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-bg-card)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.coverUrl}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-[800ms] ease-[var(--ease-fight)] group-hover:scale-105"
                      />
                    </div>
                  ) : null}
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
                      {p.publishedAt?.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      }) ?? ''}
                      {p.tags.length > 0 ? ` · ${p.tags.join(' · ')}` : ''}
                    </p>
                    <h2 className="mt-2 font-display text-2xl uppercase leading-tight text-[var(--color-canvas-0)] group-hover:text-[var(--color-blood-300)]">
                      {p.title}
                    </h2>
                    {p.excerpt ? (
                      <p className="mt-3 text-sm text-[var(--color-fg-muted)]">{p.excerpt}</p>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
