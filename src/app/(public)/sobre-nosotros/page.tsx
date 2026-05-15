import type { Metadata } from 'next';
import Container from '@/components/ui/container';
import { getSetting } from '@/server/queries/settings';

type AboutSettings = { slogan: string; manifesto: string; origin: string };

export const metadata: Metadata = {
  title: 'Sobre nosotros',
  description: 'Quiénes son Industrial Fighters y por qué cosemos cada prenda.',
};

const FALLBACK: AboutSettings = {
  slogan: 'De donde venimos se lucha cada día.',
  manifesto:
    'No vendemos ropa. Vendemos lo que te pones para trabajar. Cada pantalón lo hacemos porque alguien tiene un combate el sábado. Cada guante porque alguien entrena a las seis de la mañana. Cada camiseta porque un gimnasio cumple diez años y sus alumnos quieren llevarlo puesto.',
  origin:
    'Empezamos en un gimnasio de barrio en 2019. Una máquina de coser de segunda mano y dos clientes. Hoy seguimos cosiendo nosotros mismos cada prenda.',
};

const VALUES = [
  {
    title: 'Hecho a mano',
    body: 'Cada prenda pasa por más de diez manos antes de salir del taller.',
  },
  {
    title: 'Personalización real',
    body: 'No imprimimos. Bordamos. Cosemos. Tatuamos cada prenda con tu identidad.',
  },
  {
    title: 'De barrio',
    body: 'Empezamos en un gimnasio de barrio. Seguimos vistiendo a gimnasios de barrio.',
  },
];

export default async function AboutPage() {
  const about = (await getSetting<AboutSettings>('about')) ?? FALLBACK;
  return (
    <>
      <section className="relative flex min-h-[80vh] items-center overflow-hidden border-b border-[var(--color-border)]">
        <Container size="max" className="py-24">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
            {'// CAPÍTULO 02 — IDENTIDAD'}
          </p>
          <h1
            className="mt-6 font-display uppercase leading-[0.85] tracking-[-0.03em] text-[var(--color-canvas-0)]"
            style={{ fontSize: 'var(--text-hero)' }}
          >
            {about.slogan.split(' ').slice(0, 3).join(' ')}
            <br />
            {about.slogan.split(' ').slice(3).join(' ')}
          </h1>
        </Container>
      </section>

      <section className="py-24">
        <Container size="md">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            Manifiesto
          </h2>
          <p className="mt-6 whitespace-pre-line text-xl leading-relaxed text-[var(--color-fg)]">
            {about.manifesto}
          </p>
          <p className="mt-12 font-display text-4xl uppercase text-[var(--color-blood-400)]">
            Industrial Fighters.
          </p>
        </Container>
      </section>

      <section className="border-t border-[var(--color-border)] py-24">
        <Container size="lg">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            Origen
          </h2>
          <p className="mt-6 max-w-prose text-xl leading-relaxed text-[var(--color-fg)]">
            {about.origin}
          </p>
        </Container>
      </section>

      <section className="border-t border-[var(--color-border)] py-24">
        <Container size="max">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            Valores
          </h2>
          <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <li
                key={v.title}
                className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  {`// 0${i + 1}`}
                </p>
                <h3 className="mt-3 font-display text-2xl uppercase leading-tight text-[var(--color-canvas-0)]">
                  {v.title}
                </h3>
                <p className="mt-3 text-[var(--color-fg-muted)]">{v.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
