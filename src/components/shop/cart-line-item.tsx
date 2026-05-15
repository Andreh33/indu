'use client';

import { useCartStore } from '@/lib/cart/store';
import { formatPriceEUR } from '@/lib/utils/format-price';
import type { CartItem } from '@/types/cart';

export default function CartLineItem({ item }: { item: CartItem }) {
  const remove = useCartStore((s) => s.remove);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const summary: string[] = [];
  if (item.variants.size) summary.push(`Talla ${item.variants.size}`);
  if (item.variants.weight) summary.push(item.variants.weight);
  if (item.variants.color) summary.push(item.variants.color);
  if (item.customization.frontText) summary.push(`"${item.customization.frontText}"`);
  if (item.customization.flag) summary.push(`🏳 ${item.customization.flag}`);

  return (
    <li className="flex gap-4 border-b border-[var(--color-border)] py-5">
      <div className="h-20 w-20 flex-none overflow-hidden bg-[var(--color-bg-card)]">
        {item.productImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.productImage} alt={item.productName} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-display text-sm uppercase leading-tight text-[var(--color-canvas-0)]">
            {item.productName}
          </h4>
          <button
            onClick={() => remove(item.id)}
            aria-label="Eliminar"
            className="font-mono text-xs text-[var(--color-fg-subtle)] hover:text-[var(--color-blood-300)]"
          >
            ×
          </button>
        </div>
        {summary.length > 0 ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-muted)]">
            {summary.join(' · ')}
          </p>
        ) : null}
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center border border-[var(--color-border)]">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="h-7 w-7 font-mono text-xs text-[var(--color-fg)] hover:bg-[var(--color-bg-card)]"
              aria-label="Reducir"
            >
              −
            </button>
            <span className="flex h-7 w-7 items-center justify-center font-mono text-xs tabular-nums">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="h-7 w-7 font-mono text-xs text-[var(--color-fg)] hover:bg-[var(--color-bg-card)]"
              aria-label="Aumentar"
            >
              +
            </button>
          </div>
          <p className="font-mono text-sm tabular-nums text-[var(--color-canvas-0)]">
            {formatPriceEUR(item.basePriceCents * item.quantity)}
          </p>
        </div>
      </div>
    </li>
  );
}
