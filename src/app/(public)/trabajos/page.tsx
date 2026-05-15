import type { Metadata } from 'next';
import Container from '@/components/ui/container';
import WorkCard from '@/components/shop/work-card';
import { getPublishedWorks } from '@/server/queries/works';

export const metadata: Metadata = {
  title: 'Trabajos',
  description: 'Casos reales: gimnasios, fighters, eventos y marcas que han pasado por nuestro taller.',
};

export default async function WorksIndexPage() {
  const works = await getPublishedWorks();
  return (
    <>
      <section className="border-b border-[var(--color-border)]">
        <Container size="max" className="py-20">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
            {'// CASOS REALES, CLIENTES REALES'}
          </p>
          <h1
            className="mt-3 font-display uppercase leading-[0.85] tracking-[-0.02em] text-[var(--color-canvas-0)]"
            style={{ fontSize: 'var(--text-5xl)' }}
          >
            Trabajos.
          </h1>
        </Container>
      </section>

      <Container size="max" className="py-16">
        {works.length === 0 ? (
          <p className="py-24 text-center text-[var(--color-fg-muted)]">Aún no hay nada.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {works.map((w) => (
              <li key={w.id}>
                <WorkCard work={w} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
