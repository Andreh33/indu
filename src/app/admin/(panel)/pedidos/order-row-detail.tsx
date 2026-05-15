'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import type { CartItem } from '@/types/cart';
import { buildWhatsAppMessage } from '@/lib/whatsapp/format';

export default function OrderRowDetail({ items }: { items: CartItem[] }) {
  const [open, setOpen] = useState(false);
  const message = open ? buildWhatsAppMessage(items) : '';

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-blood-400)] hover:text-[var(--color-blood-300)]">
          Ver mensaje →
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[81] max-h-[85vh] w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
          <Dialog.Title className="font-display text-xl uppercase text-[var(--color-canvas-0)]">
            Mensaje WhatsApp
          </Dialog.Title>
          <Dialog.Description className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
            Igual que el que recibirías en el chat
          </Dialog.Description>
          <pre className="mt-4 max-h-[60vh] overflow-y-auto whitespace-pre-wrap break-words border border-[var(--color-border)] bg-[var(--color-bg)] p-4 font-mono text-xs leading-relaxed text-[var(--color-fg)]">
            {message}
          </pre>
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={() => navigator.clipboard.writeText(message)}
              className="h-10 border border-[var(--color-canvas-300)] px-4 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-canvas-0)] hover:border-[var(--color-blood-400)]"
            >
              Copiar
            </button>
            <Dialog.Close asChild>
              <button className="h-10 bg-[var(--color-blood-400)] px-4 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-canvas-0)] hover:bg-[var(--color-blood-300)]">
                Cerrar
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
