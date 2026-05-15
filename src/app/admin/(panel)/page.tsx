import Link from 'next/link';
import { desc } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { orderAttempts, products, works } from '@/lib/db/schema';
import { formatPriceEUR } from '@/lib/utils/format-price';

export default async function DashboardPage() {
  const [prodRows, workRows, orderRows] = await Promise.all([
    db.select().from(products),
    db.select().from(works),
    db.select().from(orderAttempts).orderBy(desc(orderAttempts.createdAt)).limit(5),
  ]);

  const productsPublished = prodRows.filter((p) => p.status === 'published').length;
  const worksPublished = workRows.filter((w) => w.published).length;
  // Server component: la "impureza" de Date.now se evalúa una vez por request, no por render.
  // eslint-disable-next-line react-hooks/purity
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const last7Days = orderRows.filter((o) => o.createdAt.getTime() > sevenDaysAgo).length;

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
        {'// PANEL'}
      </p>
      <h1
        className="mt-2 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
        style={{ fontSize: 'var(--text-4xl)' }}
      >
        Dashboard.
      </h1>

      <section className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            Productos
          </p>
          <p className="mt-3 font-display text-4xl text-[var(--color-canvas-0)]">
            {productsPublished}
            <span className="ml-2 font-mono text-sm text-[var(--color-fg-muted)]">
              / {prodRows.length}
            </span>
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
            publicados / total
          </p>
          <Link
            href="/admin/productos"
            className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)] hover:text-[var(--color-blood-300)]"
          >
            Gestionar →
          </Link>
        </article>

        <article className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            Trabajos
          </p>
          <p className="mt-3 font-display text-4xl text-[var(--color-canvas-0)]">
            {worksPublished}
            <span className="ml-2 font-mono text-sm text-[var(--color-fg-muted)]">
              / {workRows.length}
            </span>
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
            publicados / total
          </p>
          <Link
            href="/admin/galeria"
            className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)] hover:text-[var(--color-blood-300)]"
          >
            Gestionar →
          </Link>
        </article>

        <article className="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            Pedidos · 7 días
          </p>
          <p className="mt-3 font-display text-4xl text-[var(--color-canvas-0)]">{last7Days}</p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
            intentos de checkout
          </p>
          <Link
            href="/admin/pedidos"
            className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)] hover:text-[var(--color-blood-300)]"
          >
            Ver log →
          </Link>
        </article>
      </section>

      <section className="mt-12">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          Últimos pedidos
        </h2>
        {orderRows.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--color-fg-muted)]">Aún no hay intentos de pedido.</p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--color-border)] border border-[var(--color-border)]">
            {orderRows.map((o) => (
              <li key={o.id} className="flex items-center justify-between px-4 py-3">
                <p className="font-mono text-xs text-[var(--color-fg-muted)]">
                  {o.createdAt.toLocaleString('es-ES')}
                </p>
                <p className="font-mono text-sm tabular-nums text-[var(--color-canvas-0)]">
                  {formatPriceEUR(o.totalCents)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          Acciones rápidas
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/productos/nuevo"
            className="inline-flex h-11 items-center bg-[var(--color-blood-400)] px-6 font-display text-sm uppercase tracking-[0.06em] text-[var(--color-canvas-0)] hover:bg-[var(--color-blood-300)]"
          >
            Nuevo producto
          </Link>
          <Link
            href="/admin/galeria/nuevo"
            className="inline-flex h-11 items-center border border-[var(--color-canvas-300)] px-6 font-display text-sm uppercase tracking-[0.06em] text-[var(--color-canvas-0)] hover:border-[var(--color-blood-400)] hover:text-[var(--color-blood-300)]"
          >
            Nuevo trabajo
          </Link>
          <Link
            href="/admin/ajustes"
            className="inline-flex h-11 items-center border border-[var(--color-canvas-300)] px-6 font-display text-sm uppercase tracking-[0.06em] text-[var(--color-canvas-0)] hover:border-[var(--color-blood-400)] hover:text-[var(--color-blood-300)]"
          >
            Ajustes
          </Link>
        </div>
      </section>
    </div>
  );
}
