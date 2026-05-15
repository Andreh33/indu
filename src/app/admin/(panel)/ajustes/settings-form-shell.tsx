'use client';

import { useActionState } from 'react';
import { cn } from '@/lib/utils/cn';
import type { SettingsFormState } from '@/server/actions/settings';

const INITIAL: SettingsFormState = { error: null };

type ActionFn = (state: SettingsFormState, fd: FormData) => Promise<SettingsFormState>;

export default function SettingsFormShell({
  action,
  children,
  saveLabel = 'Guardar',
  className,
}: {
  action: ActionFn;
  children: React.ReactNode;
  saveLabel?: string;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, INITIAL);
  return (
    <form action={formAction} className={cn('flex flex-col gap-4', className)}>
      {children}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="h-11 bg-[var(--color-blood-400)] px-6 font-display text-sm uppercase tracking-[0.06em] text-[var(--color-canvas-0)] hover:bg-[var(--color-blood-300)] disabled:opacity-60"
        >
          {pending ? 'Guardando…' : saveLabel}
        </button>
        {state.error ? (
          <p className="font-mono text-xs text-[var(--color-blood-300)]">{state.error}</p>
        ) : null}
        {state.ok ? (
          <p className="font-mono text-xs text-[var(--color-success)]">✓ Guardado</p>
        ) : null}
      </div>
    </form>
  );
}
