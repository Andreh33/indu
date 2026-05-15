import Link from 'next/link';
import { Suspense } from 'react';
import { requireAdmin } from '@/lib/auth/require-admin';
import { logoutAction } from '@/server/actions/auth';

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/productos', label: 'Productos' },
  { href: '/admin/galeria', label: 'Galería' },
  { href: '/admin/pedidos', label: 'Pedidos' },
  { href: '/admin/ajustes', label: 'Ajustes' },
];

/**
 * Shell estático: sidebar + topbar móvil. El auth check va en sub-components
 * envueltos en Suspense para que Cache Components no falle el prerender.
 */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh">
      <aside className="hidden w-60 flex-none flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-elevated)] md:flex">
        <div className="border-b border-[var(--color-border)] px-6 py-5">
          <Link
            href="/"
            className="block font-display text-base uppercase leading-none text-[var(--color-canvas-0)]"
          >
            Industrial
          </Link>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            Admin
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-canvas-0)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Suspense fallback={<SessionFooterFallback />}>
          <SessionFooter />
        </Suspense>
      </aside>

      {/* Mobile topbar */}
      <header className="fixed inset-x-0 top-0 z-[20] flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 md:hidden">
        <Link href="/admin" className="font-display text-sm uppercase">
          Industrial · Admin
        </Link>
        <form action={logoutAction}>
          <button className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
            Salir
          </button>
        </form>
      </header>

      <main className="flex-1 px-6 py-8 pt-20 md:px-10 md:pt-8 lg:px-12">
        <Suspense fallback={<PanelChildrenFallback />}>
          <AuthGate>{children}</AuthGate>
        </Suspense>
      </main>
    </div>
  );
}

async function AuthGate({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}

async function SessionFooter() {
  const session = await requireAdmin();
  return (
    <div className="border-t border-[var(--color-border)] px-6 py-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
        {session.email}
      </p>
      <form action={logoutAction} className="mt-2">
        <button
          type="submit"
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-blood-300)]"
        >
          Cerrar sesión →
        </button>
      </form>
    </div>
  );
}

function SessionFooterFallback() {
  return (
    <div className="border-t border-[var(--color-border)] px-6 py-4">
      <div className="h-3 w-24 animate-pulse bg-[var(--color-canvas-700)]" />
    </div>
  );
}

function PanelChildrenFallback() {
  return (
    <div className="space-y-4">
      <div className="h-6 w-32 animate-pulse bg-[var(--color-canvas-700)]" />
      <div className="h-10 w-1/2 animate-pulse bg-[var(--color-canvas-700)]" />
      <div className="h-64 w-full animate-pulse bg-[var(--color-canvas-700)]" />
    </div>
  );
}
