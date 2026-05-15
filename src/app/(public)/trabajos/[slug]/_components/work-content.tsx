import Link from 'next/link';
import { notFound } from 'next/navigation';
import Container from '@/components/ui/container';
import { getWorkBySlug } from '@/server/queries/works';

const TYPE_LABEL: Record<string, string> = {
  gym: 'Gimnasio',
  fighter: 'Fighter',
  event: 'Evento',
  brand: 'Marca',
};

type Params = { slug: string };

export default async function WorkContent({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) notFound();

  const hero = work.images.find((i) => i.type === 'hero') ?? work.images[0];
  const results = work.images.filter((i) => i.type === 'result');

  return (
    <>
      <section className="relative h-[70vh] overflow-hidden">
        {hero?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hero.url}
            alt={hero.alt ?? work.title}
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black" />
        <div className="relative flex h-full items-end">
          <Container size="max" className="pb-12">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-canvas-300)]">
              {TYPE_LABEL[work.type] ?? work.type} · {work.city} · {work.year} · {work.units} ud.
            </p>
            <h1
              className="mt-3 font-display uppercase leading-[0.85] tracking-[-0.02em] text-[var(--color-canvas-0)]"
              style={{ fontSize: 'var(--text-5xl)' }}
            >
              {work.title}
            </h1>
            <p className="mt-2 font-mono text-sm uppercase tracking-[0.2em] text-[var(--color-canvas-200)]">
              {work.clientName}
            </p>
          </Container>
        </div>
      </section>

      <Container size="lg" className="py-20">
        <div className="grid gap-12 lg:grid-cols-[180px_1fr] lg:gap-20">
          <aside className="space-y-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                Cliente
              </p>
              <p className="mt-1 text-[var(--color-fg)]">{work.clientName}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                Ciudad
              </p>
              <p className="mt-1 text-[var(--color-fg)]">{work.city ?? '—'}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                Año
              </p>
              <p className="mt-1 text-[var(--color-fg)]">{work.year ?? '—'}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                Unidades
              </p>
              <p className="mt-1 text-[var(--color-fg)]">{work.units}</p>
            </div>
          </aside>

          <article className="space-y-12">
            {work.brief ? (
              <section>
                <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  Brief
                </h2>
                <p className="mt-3 text-lg leading-relaxed text-[var(--color-fg)]">{work.brief}</p>
              </section>
            ) : null}

            {work.process ? (
              <section>
                <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  Proceso
                </h2>
                <p className="mt-3 text-lg leading-relaxed text-[var(--color-fg)]">
                  {work.process}
                </p>
              </section>
            ) : null}

            {work.quote ? (
              <blockquote className="border-l-2 border-[var(--color-blood-400)] pl-6">
                <p className="font-display text-3xl uppercase italic leading-tight text-[var(--color-canvas-0)]">
                  &ldquo;{work.quote.text}&rdquo;
                </p>
                <footer className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
                  — {work.quote.author}
                  {work.quote.role ? ` · ${work.quote.role}` : ''}
                </footer>
              </blockquote>
            ) : null}
          </article>
        </div>

        {results.length > 0 ? (
          <section className="mt-20">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
              Resultado
            </h2>
            <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {results.map((img) => (
                <li
                  key={img.id}
                  className="relative aspect-[4/5] overflow-hidden bg-[var(--color-bg-card)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.alt ?? work.title}
                    className="h-full w-full object-cover"
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-24 border-t border-[var(--color-border)] pt-12">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            ¿Quieres algo así para tu equipo?
          </p>
          <h3
            className="mt-3 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
            style={{ fontSize: 'var(--text-3xl)' }}
          >
            Empieza por la tienda.
          </h3>
          <Link
            href="/shop"
            className="mt-6 inline-flex h-12 items-center bg-[var(--color-blood-400)] px-8 font-display text-sm uppercase tracking-[0.06em] text-[var(--color-canvas-0)] hover:bg-[var(--color-blood-300)]"
          >
            Ver catálogo →
          </Link>
        </section>
      </Container>
    </>
  );
}
