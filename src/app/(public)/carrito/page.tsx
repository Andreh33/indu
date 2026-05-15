import type { Metadata } from 'next';
import Container from '@/components/ui/container';
import CartPageClient from './cart-page-client';
import { getContact } from '@/server/queries/settings';

export const metadata: Metadata = {
  title: 'Carrito',
  description: 'Revisa tu pedido antes de cerrarlo por WhatsApp.',
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  const contact = await getContact();
  return (
    <Container size="lg" className="py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
        {'// TU ESQUINA'}
      </p>
      <h1
        className="mt-2 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
        style={{ fontSize: 'var(--text-4xl)' }}
      >
        Carrito.
      </h1>
      <p className="mt-3 max-w-prose text-[var(--color-fg-muted)]">
        Revisa lo que vas a pedir. Cuando estés listo, abrimos la conversación de WhatsApp con todo
        el resumen pre-rellenado.
      </p>

      <div className="mt-12">
        <CartPageClient whatsappNumber={contact.whatsapp} />
      </div>
    </Container>
  );
}
