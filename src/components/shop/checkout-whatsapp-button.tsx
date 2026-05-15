'use client';

import { useCartStore } from '@/lib/cart/store';
import { buildWhatsAppUrl, buildWhatsAppMessage } from '@/lib/whatsapp/format';
import { track } from '@/lib/analytics/track';

type Props = { whatsappNumber: string };

export default function CheckoutWhatsAppButton({ whatsappNumber }: Props) {
  const items = useCartStore((s) => s.items);

  if (items.length === 0) return null;

  function onClick() {
    const message = buildWhatsAppMessage(items);
    const url = buildWhatsAppUrl(items, whatsappNumber);

    // Fallback: si el mensaje es muy largo, copiamos al portapapeles
    // y abrimos wa.me sin payload. (Algunos navegadores truncan > 2000 chars.)
    if (url.length > 1900 && navigator.clipboard) {
      navigator.clipboard.writeText(message).catch(() => {});
      window.open(`https://wa.me/${whatsappNumber}`, '_blank', 'noopener,noreferrer');
      return;
    }

    const totalCents = items.reduce((acc, i) => acc + i.basePriceCents * i.quantity, 0);

    track('checkout_whatsapp', { items: items.length, total_cents: totalCents });

    fetch('/api/track-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, totalCents }),
    }).catch(() => {});

    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <button
      onClick={onClick}
      className="flex h-14 w-full items-center justify-center gap-3 bg-[#25D366] px-6 font-display text-base uppercase tracking-[0.06em] text-white transition-colors hover:bg-[#1FB957]"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.1 1.6 5.8L0 24l6.4-1.6c1.7.9 3.6 1.4 5.6 1.4 6.6 0 12-5.4 12-12S18.6 0 12 0zm0 22c-1.8 0-3.5-.5-4.9-1.3l-.4-.2-3.6 1 1-3.5-.2-.4C2.7 16.1 2 14.1 2 12 2 6.5 6.5 2 12 2s10 4.5 10 10-4.5 10-10 10zm5.6-7.5c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1-1.3-.5-2.4-1.5c-.9-.8-1.5-1.8-1.7-2.1s0-.5.1-.6.3-.3.4-.5.2-.3.3-.5.1-.4 0-.5-.7-1.6-.9-2.2-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.4 1 2.8 1.2 3 2 3.1 4.9 4.2c.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.5-.3z" />
      </svg>
      Abrir conversación en WhatsApp
      <span aria-hidden>→</span>
    </button>
  );
}
