'use client';

import { useActionState, useEffect, useRef } from 'react';
import {
  addInstagramItemAction,
  type InstagramFormState,
} from '@/server/actions/instagram';

const INITIAL: InstagramFormState = { error: null };

export default function InstagramForm() {
  const [state, formAction, pending] = useActionState(addInstagramItemAction, INITIAL);
  const formRef = useRef<HTMLFormElement>(null);

  // Reset form on success (error null + not pending)
  useEffect(() => {
    if (!pending && state.error === null) {
      formRef.current?.reset();
    }
  }, [pending, state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <Field label="URL imagen" name="imageUrl" type="url" required placeholder="https://..." />
      <Field label="Caption" name="caption" as="textarea" rows={3} />
      <Field label="Permalink al post de Instagram" name="permalink" type="url" />
      <Field label="Orden" name="displayOrder" type="number" defaultValue="0" />

      {state.error ? (
        <p className="border border-[var(--color-blood-500)] bg-[var(--color-blood-900)]/40 px-3 py-2 font-mono text-xs text-[var(--color-blood-200)]">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="h-11 bg-[var(--color-blood-400)] font-display text-sm uppercase tracking-[0.06em] text-[var(--color-canvas-0)] hover:bg-[var(--color-blood-300)] disabled:opacity-60"
      >
        {pending ? 'Subiendo…' : 'Añadir al feed'}
      </button>
    </form>
  );
}

function Field({
  label,
  as,
  rows,
  ...props
}: {
  label: string;
  as?: 'textarea';
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
        {label}
      </span>
      {as === 'textarea' ? (
        <textarea
          rows={rows}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          className="border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-canvas-0)] focus:border-[var(--color-blood-400)] focus:outline-none"
        />
      ) : (
        <input
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          className="h-11 border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-sm text-[var(--color-canvas-0)] focus:border-[var(--color-blood-400)] focus:outline-none"
        />
      )}
    </label>
  );
}
