'use client';

import { useTransition } from 'react';
import { deletePostAction } from '@/server/actions/posts';

export default function DeletePostButton({ id, title }: { id: string; title: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => {
        if (!confirm(`¿Borrar el post "${title}"? No se puede deshacer.`)) return;
        start(() => deletePostAction(id));
      }}
      disabled={pending}
      className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-blood-400)] hover:text-[var(--color-blood-300)] disabled:opacity-50"
    >
      {pending ? 'Borrando…' : 'Borrar post'}
    </button>
  );
}
