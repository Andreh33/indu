import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Container from '@/components/ui/container';
import JsonLd from '@/components/seo/json-ld';
import { getPostBySlug, getRelatedPosts } from '@/server/queries/posts';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://industrialfighters.com';

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'No encontrado' };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverUrl ? [{ url: post.coverUrl }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post.slug, 3);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverUrl,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { '@type': 'Organization', name: post.authorName ?? 'Industrial Fighters' },
    publisher: { '@type': 'Organization', name: 'Industrial Fighters' },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <>
      <JsonLd data={articleLd} />
      <article>
        {post.coverUrl ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-bg-card)] md:aspect-[21/9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverUrl} alt={post.title} className="h-full w-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-canvas-950)] via-transparent to-transparent" />
          </div>
        ) : null}

        <Container size="md" className="py-16">
          <nav className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            <Link href="/blog" className="hover:text-[var(--color-blood-300)]">
              Diario
            </Link>
            {' / '}
            <span className="text-[var(--color-fg-muted)]">{post.title}</span>
          </nav>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
            {post.publishedAt?.toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            }) ?? ''}
            {post.tags.length > 0 ? ` · ${post.tags.join(' · ')}` : ''}
          </p>
          <h1
            className="mt-4 font-display uppercase leading-[0.95] tracking-[-0.02em] text-[var(--color-canvas-0)]"
            style={{ fontSize: 'var(--text-4xl)' }}
          >
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-6 text-xl leading-relaxed text-[var(--color-fg)]">{post.excerpt}</p>
          ) : null}

          {/* Body — markdown muy básico (split por dobles saltos en párrafos) */}
          <div className="mt-12 space-y-6 text-lg leading-relaxed text-[var(--color-fg)]">
            {post.content.split(/\n\s*\n/).map((para, i) => (
              <p key={i} className="whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>

          <footer className="mt-16 border-t border-[var(--color-border)] pt-6 font-mono text-xs text-[var(--color-fg-muted)]">
            — {post.authorName ?? 'Industrial Fighters'}
          </footer>
        </Container>
      </article>

      {related.length > 0 ? (
        <section className="border-t border-[var(--color-border)] py-16">
          <Container size="max">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
              {'// SIGUE LEYENDO'}
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={`/blog/${r.slug}`} className="group block">
                    {r.coverUrl ? (
                      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-bg-card)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={r.coverUrl}
                          alt={r.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    ) : null}
                    <h3 className="mt-3 font-display text-xl uppercase leading-tight text-[var(--color-canvas-0)] group-hover:text-[var(--color-blood-300)]">
                      {r.title}
                    </h3>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </>
  );
}
