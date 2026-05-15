import Link from 'next/link';
import PunchingBag from '@/components/easter-eggs/punching-bag';

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 py-16 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
        {'// ROUND PERDIDO'}
      </p>
      <h1
        className="mt-6 font-display uppercase leading-[0.85] tracking-[-0.03em] text-[var(--color-canvas-0)]"
        style={{ fontSize: 'var(--text-5xl)' }}
      >
        404
      </h1>
      <p className="mt-4 max-w-prose text-[var(--color-fg-muted)]">
        Esto no está. O nunca estuvo. O alguien se llevó la pieza al taller.
      </p>

      <div className="mt-12">
        <PunchingBag />
      </div>

      <Link
        href="/"
        className="mt-12 inline-flex h-12 items-center bg-[var(--color-blood-400)] px-8 font-display text-sm uppercase tracking-[0.06em] text-[var(--color-canvas-0)] hover:bg-[var(--color-blood-300)]"
      >
        Volver al inicio →
      </Link>
    </main>
  );
}
