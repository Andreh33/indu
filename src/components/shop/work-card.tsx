'use client';

import Link from 'next/link';
import { useCursorStore } from '@/lib/cursor/store';
import type { Work, WorkImage } from '@/lib/db/schema';

const TYPE_LABEL: Record<string, string> = {
  gym: 'Gimnasio',
  fighter: 'Fighter',
  event: 'Evento',
  brand: 'Marca',
};

type Props = {
  work: Work & { images: WorkImage[] };
  /** Variante visual: tarjeta grande o estándar de grid. */
  size?: 'sm' | 'md';
};

export default function WorkCard({ work, size = 'md' }: Props) {
  const setCursor = useCursorStore((s) => s.setCursor);
  const reset = useCursorStore((s) => s.reset);
  const hero = work.images.find((i) => i.type === 'hero') ?? work.images[0];

  return (
    <Link
      href={`/trabajos/${work.slug}`}
      onPointerEnter={() => setCursor('image', 'VER CASO')}
      onPointerLeave={reset}
      onClick={reset}
      className="group block overflow-hidden border border-[var(--color-border)]/0 transition-colors duration-300 hover:border-[var(--color-blood-400)]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-bg-card)]">
        {hero?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hero.url}
            alt={hero.alt ?? work.title}
            className="h-full w-full object-cover grayscale-[0.3] transition-all duration-[900ms] ease-[var(--ease-fight)] group-hover:scale-[1.06] group-hover:grayscale-0"
          />
        ) : null}

        {/* Borde rojo que se "dibuja" desde la esquina superior izquierda al hover */}
        <span className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-[var(--color-blood-400)] transition-all duration-500 ease-out group-hover:w-full" />
        <span className="pointer-events-none absolute right-0 top-0 h-0 w-px bg-[var(--color-blood-400)] transition-all delay-200 duration-500 ease-out group-hover:h-full" />
        <span className="pointer-events-none absolute right-0 bottom-0 h-px w-0 bg-[var(--color-blood-400)] transition-all delay-300 duration-500 ease-out group-hover:w-full" />
        <span className="pointer-events-none absolute left-0 bottom-0 h-0 w-px bg-[var(--color-blood-400)] transition-all delay-500 duration-500 ease-out group-hover:h-full" />

        {/* Overlay con info */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-canvas-300)]">
            {TYPE_LABEL[work.type] ?? work.type} · {work.city ?? ''}
            {work.year ? ` · ${work.year}` : ''}
          </p>
          <h3
            className={
              size === 'sm'
                ? 'mt-1 font-display text-xl uppercase leading-tight text-[var(--color-canvas-0)]'
                : 'mt-1 font-display text-2xl uppercase leading-tight text-[var(--color-canvas-0)]'
            }
          >
            {work.title}
          </h3>
          {/* Línea revelable */}
          <p className="mt-3 max-h-0 overflow-hidden font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-blood-300)] opacity-0 transition-all duration-500 group-hover:max-h-6 group-hover:opacity-100">
            VER CASO →
          </p>
        </div>
      </div>
    </Link>
  );
}
