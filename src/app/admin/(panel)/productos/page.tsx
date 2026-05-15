import Link from 'next/link';
import { asc } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { products, categories } from '@/lib/db/schema';
import { formatPriceEUR } from '@/lib/utils/format-price';

export default async function AdminProductsPage() {
  const [prodRows, catRows] = await Promise.all([
    db.select().from(products).orderBy(asc(products.displayOrder)),
    db.select().from(categories),
  ]);
  const catById = new Map(catRows.map((c) => [c.id, c.name]));

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            {'// CATÁLOGO'}
          </p>
          <h1
            className="mt-2 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
            style={{ fontSize: 'var(--text-3xl)' }}
          >
            Productos
          </h1>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex h-11 items-center bg-[var(--color-blood-400)] px-6 font-display text-sm uppercase tracking-[0.06em] text-[var(--color-canvas-0)] hover:bg-[var(--color-blood-300)]"
        >
          Nuevo producto
        </Link>
      </div>

      <div className="mt-8 overflow-hidden border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-bg-elevated)]">
            <tr className="text-left font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Orden</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {prodRows.map((p) => (
              <tr key={p.id} className="hover:bg-[var(--color-bg-elevated)]">
                <td className="px-4 py-3">
                  <p className="text-[var(--color-canvas-0)]">{p.name}</p>
                  <p className="font-mono text-[10px] text-[var(--color-fg-subtle)]">{p.slug}</p>
                </td>
                <td className="px-4 py-3 text-[var(--color-fg-muted)]">
                  {catById.get(p.categoryId) ?? '—'}
                </td>
                <td className="px-4 py-3 font-mono tabular-nums">
                  {formatPriceEUR(p.basePriceCents)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      p.status === 'published'
                        ? 'inline-block bg-[var(--color-success)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-canvas-0)]'
                        : 'inline-block border border-[var(--color-border)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]'
                    }
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs tabular-nums text-[var(--color-fg-muted)]">
                  {p.displayOrder}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/productos/${p.id}/editar`}
                    className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-blood-400)] hover:text-[var(--color-blood-300)]"
                  >
                    Editar →
                  </Link>
                </td>
              </tr>
            ))}
            {prodRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[var(--color-fg-muted)]">
                  Sin productos.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
