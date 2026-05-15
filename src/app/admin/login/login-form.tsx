'use client';

import { useActionState } from 'react';
import { loginAction, type LoginState } from '@/server/actions/auth';

const INITIAL: LoginState = { error: null };

export default function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, INITIAL);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          Email
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-12 border border-[var(--color-border)] bg-[var(--color-bg)] px-4 font-mono text-sm text-[var(--color-canvas-0)] focus:border-[var(--color-blood-400)] focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          Contraseña
        </span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="current-password"
          className="h-12 border border-[var(--color-border)] bg-[var(--color-bg)] px-4 font-mono text-sm text-[var(--color-canvas-0)] focus:border-[var(--color-blood-400)] focus:outline-none"
        />
      </label>

      {state.error ? (
        <p className="border border-[var(--color-blood-500)] bg-[var(--color-blood-900)]/40 px-4 py-3 font-mono text-xs text-[var(--color-blood-200)]">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="h-12 bg-[var(--color-blood-400)] font-display text-base uppercase tracking-[0.06em] text-[var(--color-canvas-0)] transition-colors hover:bg-[var(--color-blood-300)] disabled:opacity-60"
      >
        {pending ? 'Entrando...' : 'Entrar al taller →'}
      </button>
    </form>
  );
}
