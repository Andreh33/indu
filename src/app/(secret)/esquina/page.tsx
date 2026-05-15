import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Esquina',
  description: 'Si has llegado aquí, ya eres de la esquina.',
  robots: { index: false, follow: false },
};

export default function EsquinaPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 py-16 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
        {'// ESQUINA · RUTA NO ENLAZADA'}
      </p>

      <h1
        className="mt-8 font-display uppercase leading-[0.85] tracking-[-0.03em] text-[var(--color-canvas-0)]"
        style={{ fontSize: 'var(--text-5xl)' }}
      >
        Si has llegado
        <br />
        hasta aquí,
        <br />
        ya eres
        <br />
        de la esquina.
      </h1>

      <div className="mt-16 max-w-md space-y-5 text-left text-[var(--color-fg)]">
        <p>
          Esta página no aparece en ningún menú. La descubrirás —o la encontrará alguien que sí
          conoces— porque alguien te la enseñó, porque pasaste por aquí un mediodía aburrido o
          porque te aburres entre rounds.
        </p>
        <p>
          No vendemos nada nuevo en esta página. Solo te decimos lo mismo de siempre, pero más
          de cerca.
        </p>
        <p className="font-mono text-sm text-[var(--color-fg-muted)]">
          De donde venimos se lucha cada día. Nosotros cosemos. Tú haces el resto.
        </p>
      </div>

      <p className="mt-20 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
        — equipo IF
      </p>
    </main>
  );
}
