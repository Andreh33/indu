'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useCartStore, selectSubtotalCents, selectItemCount } from '@/lib/cart/store';
import { formatPriceEUR } from '@/lib/utils/format-price';
import CartLineItem from './cart-line-item';
import CheckoutWhatsAppButton from './checkout-whatsapp-button';

type Props = { whatsappNumber: string };

export default function CartDrawer({ whatsappNumber }: Props) {
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectSubtotalCents);
  const count = useCartStore(selectItemCount);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => (open ? null : close())}>
      <AnimatePresence>
        {isOpen ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.45, ease: [0.7, 0, 0.2, 1] }}
                className="fixed right-0 top-0 z-[81] flex h-full w-full max-w-[480px] flex-col border-l border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
              >
                <Dialog.Title asChild>
                  <header className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
                      Tu esquina · {count} round{count === 1 ? '' : 's'}
                    </p>
                    <Dialog.Close asChild>
                      <button className="font-mono text-sm text-[var(--color-canvas-0)] hover:text-[var(--color-blood-300)]">
                        CERRAR ×
                      </button>
                    </Dialog.Close>
                  </header>
                </Dialog.Title>
                <Dialog.Description className="sr-only">
                  Tu carrito de pedido
                </Dialog.Description>

                {items.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                    <p className="font-display text-3xl uppercase leading-[0.9] text-[var(--color-canvas-0)]">
                      Tu esquina
                      <br />
                      está vacía.
                    </p>
                    <p className="mt-4 text-[var(--color-fg-muted)]">
                      Ningún round empieza así.
                    </p>
                    <Link
                      href="/shop"
                      onClick={close}
                      className="mt-8 flex h-12 items-center justify-center bg-[var(--color-blood-400)] px-8 font-display text-sm uppercase tracking-[0.06em] text-[var(--color-canvas-0)] hover:bg-[var(--color-blood-300)]"
                    >
                      Ver tienda →
                    </Link>
                  </div>
                ) : (
                  <>
                    <ul className="flex-1 overflow-y-auto px-6">
                      {items.map((item) => (
                        <CartLineItem key={item.id} item={item} />
                      ))}
                    </ul>
                    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-6">
                      <div className="mb-4 flex items-center justify-between font-mono text-sm">
                        <span className="uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
                          Subtotal
                        </span>
                        <span className="tabular-nums text-[var(--color-canvas-0)]">
                          {formatPriceEUR(subtotal)}
                        </span>
                      </div>
                      <div className="mb-4 flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                        <span>Envío</span>
                        <span>A negociar</span>
                      </div>
                      <CheckoutWhatsAppButton whatsappNumber={whatsappNumber} />
                      <Link
                        href="/carrito"
                        onClick={close}
                        className="mt-3 block text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)] hover:text-[var(--color-canvas-0)]"
                      >
                        O revisar en /carrito
                      </Link>
                    </footer>
                  </>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
