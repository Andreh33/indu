import { desc } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { orderAttempts } from '@/lib/db/schema';
import { formatPriceEUR } from '@/lib/utils/format-price';
import OrderRowDetail from './order-row-detail';

export default async function AdminOrdersPage() {
  const rows = await db
    .select()
    .from(orderAttempts)
    .orderBy(desc(orderAttempts.createdAt))
    .limit(200);

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
        {'// LOG'}
      </p>
      <h1
        className="mt-2 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
        style={{ fontSize: 'var(--text-3xl)' }}
      >
        Pedidos
      </h1>
      <p className="mt-2 max-w-prose text-sm text-[var(--color-fg-muted)]">
        Cada vez que alguien pulsa el botón verde de WhatsApp se registra aquí. No son pedidos
        confirmados; son intentos de checkout. Se auto-borran a los 90 días.
      </p>

      <div className="mt-8 overflow-hidden border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-bg-elevated)]">
            <tr className="text-left font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">IP</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {rows.map((o) => {
              const items = (o.items ?? []) as Array<{ productName?: string }>;
              return (
                <tr key={o.id}>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--color-fg-muted)]">
                    {o.createdAt.toLocaleString('es-ES')}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-canvas-0)]">{items.length}</td>
                  <td className="px-4 py-3 font-mono tabular-nums text-[var(--color-canvas-0)]">
                    {formatPriceEUR(o.totalCents)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--color-fg-muted)]">
                    {o.ipTruncated ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <OrderRowDetail items={items as never[]} />
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[var(--color-fg-muted)]">
                  Sin pedidos todavía.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
