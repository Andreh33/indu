import { asc } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { instagramItems } from '@/lib/db/schema';
import InstagramForm from './instagram-form';
import DeleteItemButton from './delete-button';

export default async function AdminInstagramPage() {
  const items = await db
    .select()
    .from(instagramItems)
    .orderBy(asc(instagramItems.displayOrder));

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
        {'// FEED MANUAL'}
      </p>
      <h1
        className="mt-2 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
        style={{ fontSize: 'var(--text-3xl)' }}
      >
        Instagram
      </h1>
      <p className="mt-3 max-w-prose text-sm text-[var(--color-fg-muted)]">
        Mientras la API de Instagram no esté conectada, gestionamos el feed a mano. Sube la URL
        de la imagen, el caption y el permalink al post original.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[400px_1fr]">
        <InstagramForm />

        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            Items ({items.length})
          </h2>
          {items.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--color-fg-muted)]">
              Sin items todavía. Añade uno con el formulario.
            </p>
          ) : (
            <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
              {items.map((it) => (
                <li
                  key={it.id}
                  className="group relative aspect-square overflow-hidden bg-[var(--color-bg-card)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.imageUrl}
                    alt={it.caption ?? ''}
                    className="h-full w-full object-cover"
                  />
                  <DeleteItemButton id={it.id} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
