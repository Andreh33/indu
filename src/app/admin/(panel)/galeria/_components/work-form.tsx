'use client';

import { useActionState } from 'react';
import type { Work, WorkImage } from '@/lib/db/schema';
import { createWorkAction, updateWorkAction, type WorkFormState } from '@/server/actions/works';

const INITIAL: WorkFormState = { error: null };

type Props = { work?: Work & { images: WorkImage[] } };

export default function WorkForm({ work }: Props) {
  const action = work ? updateWorkAction.bind(null, work.id) : createWorkAction;
  const [state, formAction, pending] = useActionState(action, INITIAL);

  const heroUrls = (work?.images ?? []).filter((i) => i.type === 'hero').map((i) => i.url).join('\n');
  const resultUrls = (work?.images ?? []).filter((i) => i.type === 'result').map((i) => i.url).join('\n');
  const quote = work?.quote ?? null;

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        <Field label="Título" name="title" defaultValue={work?.title} required />
        <Field label="Slug" name="slug" defaultValue={work?.slug} hint="kebab-case" />
        <Field label="Cliente" name="clientName" defaultValue={work?.clientName} required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Ciudad" name="city" defaultValue={work?.city ?? ''} />
          <Field
            label="Año"
            name="year"
            type="number"
            defaultValue={(work?.year ?? new Date().getFullYear()).toString()}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Tipo"
            name="type"
            defaultValue={work?.type ?? 'gym'}
            options={[
              { value: 'gym', label: 'Gimnasio' },
              { value: 'fighter', label: 'Fighter' },
              { value: 'event', label: 'Evento' },
              { value: 'brand', label: 'Marca' },
            ]}
          />
          <Field
            label="Unidades"
            name="units"
            type="number"
            defaultValue={(work?.units ?? 1).toString()}
          />
        </div>
        <Field label="Brief" name="brief" defaultValue={work?.brief ?? ''} as="textarea" rows={4} />
        <Field
          label="Proceso"
          name="process"
          defaultValue={work?.process ?? ''}
          as="textarea"
          rows={4}
        />

        <fieldset className="border border-[var(--color-border)] p-4">
          <legend className="px-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            Cita (opcional)
          </legend>
          <div className="flex flex-col gap-4">
            <Field
              label="Texto"
              name="quoteText"
              defaultValue={quote?.text ?? ''}
              as="textarea"
              rows={2}
            />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Autor" name="quoteAuthor" defaultValue={quote?.author ?? ''} />
              <Field label="Rol" name="quoteRole" defaultValue={quote?.role ?? ''} />
            </div>
          </div>
        </fieldset>

        <Field
          label="Imágenes Hero (una URL por línea)"
          name="heroImageUrls"
          defaultValue={heroUrls}
          as="textarea"
          rows={3}
        />
        <Field
          label="Imágenes Resultado (una URL por línea)"
          name="resultImageUrls"
          defaultValue={resultUrls}
          as="textarea"
          rows={4}
        />
      </div>

      <aside className="flex h-fit flex-col gap-4 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="published"
            defaultChecked={work?.published ?? false}
            className="h-4 w-4 accent-[var(--color-blood-400)]"
          />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-canvas-0)]">
            Publicado
          </span>
        </label>
        <Field
          label="Orden"
          name="displayOrder"
          type="number"
          defaultValue={(work?.displayOrder ?? 0).toString()}
        />
        {state.error ? (
          <p className="border border-[var(--color-blood-500)] bg-[var(--color-blood-900)]/40 px-3 py-2 font-mono text-xs text-[var(--color-blood-200)]">
            {state.error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-2 h-12 bg-[var(--color-blood-400)] font-display text-sm uppercase tracking-[0.06em] text-[var(--color-canvas-0)] hover:bg-[var(--color-blood-300)] disabled:opacity-60"
        >
          {pending ? 'Guardando…' : work ? 'Guardar cambios' : 'Crear trabajo'}
        </button>
      </aside>
    </form>
  );
}

function Field({
  label,
  hint,
  as,
  rows,
  ...props
}: {
  label: string;
  hint?: string;
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
      {hint ? <span className="font-mono text-[10px] text-[var(--color-fg-subtle)]">{hint}</span> : null}
    </label>
  );
}

function SelectField({
  label,
  options,
  ...props
}: {
  label: string;
  options: { value: string; label: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
        {label}
      </span>
      <select
        {...props}
        className="h-11 border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-sm text-[var(--color-canvas-0)] focus:border-[var(--color-blood-400)] focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
