'use client';

import { useTransition } from 'react';
import { deleteWorkAction } from '@/server/actions/works';

export default function DeleteWorkButton({ id, name }: { id: string; name: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => {
        if (!confirm(`¿Borrar el trabajo "${name}"? No se puede deshacer.`)) return;
        start(() => deleteWorkAction(id));
      }}
      disabled={pending}
      className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-blood-400)] hover:text-[var(--color-blood-300)] disabled:opacity-50"
    >
      {pending ? 'Borrando…' : 'Borrar trabajo'}
    </button>
  );
}
