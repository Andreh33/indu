import Link from 'next/link';

export const metadata = { title: 'Sin conexión' };

export default function OfflinePage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
        {'// SIN SEÑAL'}
      </p>
      <h1
        className="mt-6 font-display uppercase leading-[0.85] tracking-[-0.03em] text-[var(--color-canvas-0)]"
        style={{ fontSize: 'var(--text-5xl)' }}
      >
        Sin conexión.
      </h1>
      <p className="mt-6 max-w-prose text-[var(--color-fg-muted)]">
        Esta página aún no se ha guardado en tu dispositivo. Conéctate y vuelve a cargar.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex h-12 items-center bg-[var(--color-blood-400)] px-8 font-display text-sm uppercase tracking-[0.06em] text-[var(--color-canvas-0)] hover:bg-[var(--color-blood-300)]"
      >
        Reintentar →
      </Link>
    </main>
  );
}
