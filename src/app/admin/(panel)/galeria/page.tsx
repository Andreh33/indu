import Link from 'next/link';
import { asc } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { works } from '@/lib/db/schema';

const TYPE_LABEL: Record<string, string> = {
  gym: 'Gimnasio',
  fighter: 'Fighter',
  event: 'Evento',
  brand: 'Marca',
};

export default async function AdminWorksPage() {
  const rows = await db.select().from(works).orderBy(asc(works.displayOrder));

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            {'// PORTFOLIO'}
          </p>
          <h1
            className="mt-2 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
            style={{ fontSize: 'var(--text-3xl)' }}
          >
            Trabajos
          </h1>
        </div>
        <Link
          href="/admin/galeria/nuevo"
          className="inline-flex h-11 items-center bg-[var(--color-blood-400)] px-6 font-display text-sm uppercase tracking-[0.06em] text-[var(--color-canvas-0)] hover:bg-[var(--color-blood-300)]"
        >
          Nuevo trabajo
        </Link>
      </div>

      <div className="mt-8 overflow-hidden border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-bg-elevated)]">
            <tr className="text-left font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Año</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {rows.map((w) => (
              <tr key={w.id}>
                <td className="px-4 py-3">
                  <p className="text-[var(--color-canvas-0)]">{w.title}</p>
                  <p className="font-mono text-[10px] text-[var(--color-fg-subtle)]">{w.slug}</p>
                </td>
                <td className="px-4 py-3 text-[var(--color-fg-muted)]">{w.clientName}</td>
                <td className="px-4 py-3 text-[var(--color-fg-muted)]">{TYPE_LABEL[w.type]}</td>
                <td className="px-4 py-3 font-mono text-xs tabular-nums">{w.year ?? '—'}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      w.published
                        ? 'inline-block bg-[var(--color-success)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-canvas-0)]'
                        : 'inline-block border border-[var(--color-border)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]'
                    }
                  >
                    {w.published ? 'PUBLISHED' : 'DRAFT'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/galeria/${w.id}/editar`}
                    className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-blood-400)] hover:text-[var(--color-blood-300)]"
                  >
                    Editar →
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[var(--color-fg-muted)]">
                  Sin trabajos.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
