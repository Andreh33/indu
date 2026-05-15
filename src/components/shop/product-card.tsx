'use client';

import Link from 'next/link';
import { formatPriceEUR } from '@/lib/utils/format-price';
import { useCursorStore } from '@/lib/cursor/store';
import type { ProductWithImages } from '@/server/queries/products';

type Props = { product: ProductWithImages };

export default function ProductCard({ product }: Props) {
  const primary = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const secondary = product.images.find((i) => !i.isPrimary) ?? primary;
  const colors = product.availableColors.slice(0, 4);
  const setCursor = useCursorStore((s) => s.setCursor);
  const reset = useCursorStore((s) => s.reset);

  return (
    <Link
      href={`/producto/${product.slug}`}
      onPointerEnter={() => setCursor('image', 'CONFIGURAR')}
      onPointerLeave={reset}
      onClick={reset}
      className="group relative block overflow-hidden border border-[var(--color-border)]/0 transition-colors duration-300 hover:border-[var(--color-blood-400)]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-bg-card)]">
        {primary?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={primary.url}
            alt={primary.alt ?? product.name}
            style={{ viewTransitionName: `product-image-${product.id}` }}
            className="h-full w-full object-cover transition-all duration-[900ms] ease-[var(--ease-fight)] group-hover:scale-[1.06] group-hover:opacity-0"
          />
        ) : null}
        {secondary?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={secondary.url}
            alt={secondary.alt ?? product.name}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-[900ms] ease-[var(--ease-fight)] group-hover:scale-[1.02] group-hover:opacity-100"
          />
        ) : null}
        {/* Gradient overlay sutil al hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {/* Badge */}
        <span className="absolute left-3 top-3 bg-[var(--color-canvas-950)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-canvas-0)]">
          Personalizable
        </span>
        {/* CTA emergente desde abajo */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[var(--color-blood-400)] px-4 py-3 transition-transform duration-[500ms] ease-[var(--ease-fight)] group-hover:translate-y-0">
          <p className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-canvas-0)]">
            <span>Configurar</span>
            <span aria-hidden>→</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1 px-1 pt-4 pb-6">
        <h3 className="font-display text-base uppercase leading-tight tracking-[-0.01em] text-[var(--color-canvas-0)] transition-colors duration-300 group-hover:text-[var(--color-blood-300)]">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <ul className="flex gap-1.5">
            {colors.map((c) => (
              <li
                key={c.hex}
                aria-label={c.name}
                title={c.name}
                className="h-2.5 w-2.5 rounded-full border border-[var(--color-border)] transition-transform duration-300 group-hover:scale-110"
                style={{ background: c.hex }}
              />
            ))}
          </ul>
          <span className="font-mono text-sm tabular-nums text-[var(--color-fg)]">
            {formatPriceEUR(product.basePriceCents)}
          </span>
        </div>
      </div>
    </Link>
  );
}
