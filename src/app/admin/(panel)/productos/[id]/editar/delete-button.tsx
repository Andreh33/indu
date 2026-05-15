'use client';

import { useTransition } from 'react';
import { deleteProductAction } from '@/server/actions/products';

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => {
        if (!confirm(`¿Borrar "${name}"? Esta acción no se puede deshacer.`)) return;
        start(() => deleteProductAction(id));
      }}
      disabled={pending}
      className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-blood-400)] hover:text-[var(--color-blood-300)] disabled:opacity-50"
    >
      {pending ? 'Borrando…' : 'Borrar producto'}
    </button>
  );
}
