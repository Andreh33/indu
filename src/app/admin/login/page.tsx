import type { Metadata } from 'next';
import LoginForm from './login-form';

export const metadata: Metadata = {
  title: 'Acceso admin',
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ next?: string }>;

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { next } = await searchParams;

  return (
    <main className="flex min-h-svh items-center justify-center bg-[var(--color-bg)] px-6">
      <div className="w-full max-w-md">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          {'// ACCESO PROHIBIDO'}
        </p>
        <h1
          className="mt-4 font-display uppercase leading-[0.85] tracking-[-0.02em] text-[var(--color-canvas-0)]"
          style={{ fontSize: 'var(--text-4xl)' }}
        >
          Esta esquina
          <br /> es nuestra.
        </h1>
        <p className="mt-6 text-sm text-[var(--color-fg-muted)]">
          Solo el equipo de Industrial Fighters tiene acceso al panel.
        </p>
        <div className="mt-10">
          <LoginForm next={next} />
        </div>
      </div>
    </main>
  );
}
