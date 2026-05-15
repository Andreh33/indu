'use client';

import { useTransition } from 'react';
import { deleteInstagramItemAction } from '@/server/actions/instagram';

export default function DeleteItemButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => {
        if (!confirm('¿Borrar este item?')) return;
        start(() => deleteInstagramItemAction(id));
      }}
      disabled={pending}
      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-[var(--color-canvas-950)]/80 font-mono text-xs text-[var(--color-canvas-0)] opacity-0 transition-opacity hover:bg-[var(--color-blood-400)] group-hover:opacity-100 disabled:opacity-50"
    >
      ×
    </button>
  );
}
