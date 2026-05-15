'use client';

import Link from 'next/link';
import { useCartStore, selectSubtotalCents } from '@/lib/cart/store';
import { formatPriceEUR } from '@/lib/utils/format-price';
import CartLineItem from '@/components/shop/cart-line-item';
import CheckoutWhatsAppButton from '@/components/shop/checkout-whatsapp-button';

export default function CartPageClient({ whatsappNumber }: { whatsappNumber: string }) {
  const items = useCartStore((s) => s.items);
  const hydrated = useCartStore((s) => s.hydrated);
  const subtotal = useCartStore(selectSubtotalCents);
  const clear = useCartStore((s) => s.clear);

  if (!hydrated) {
    return (
      <div className="grid gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse bg-[var(--color-bg-card)]" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-6 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-12">
        <p className="font-display text-3xl uppercase leading-[0.9] text-[var(--color-canvas-0)]">
          No hay nada en tu esquina.
        </p>
        <p className="max-w-prose text-[var(--color-fg-muted)]">
          Empieza por la tienda. Cada producto se personaliza al añadirlo al carrito.
        </p>
        <Link
          href="/shop"
          className="flex h-12 items-center justify-center bg-[var(--color-blood-400)] px-8 font-display text-sm uppercase tracking-[0.06em] text-[var(--color-canvas-0)] hover:bg-[var(--color-blood-300)]"
        >
          Ir a la tienda →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
      <div>
        <ul>
          {items.map((item) => (
            <CartLineItem key={item.id} item={item} />
          ))}
        </ul>
        <button
          onClick={clear}
          className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)] hover:text-[var(--color-blood-300)]"
        >
          Vaciar carrito
        </button>
      </div>
      <aside className="h-fit border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
          Resumen
        </h2>
        <div className="mt-4 flex items-center justify-between font-mono text-sm">
          <span className="text-[var(--color-fg-muted)]">Subtotal</span>
          <span className="tabular-nums text-[var(--color-canvas-0)]">
            {formatPriceEUR(subtotal)}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
          <span>Envío</span>
          <span>A negociar</span>
        </div>
        <div className="mt-6">
          <CheckoutWhatsAppButton whatsappNumber={whatsappNumber} />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-[var(--color-fg-subtle)]">
          El pedido se cierra por WhatsApp. Te confirmaremos disponibilidad, plazos, envío y
          forma de pago en cuanto recibamos el mensaje.
        </p>
      </aside>
    </div>
  );
}
