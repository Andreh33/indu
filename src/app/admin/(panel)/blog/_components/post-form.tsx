'use client';

import { useActionState } from 'react';
import type { Post } from '@/lib/db/schema';
import {
  createPostAction,
  updatePostAction,
  type PostFormState,
} from '@/server/actions/posts';

const INITIAL: PostFormState = { error: null };

export default function PostForm({ post }: { post?: Post }) {
  const action = post ? updatePostAction.bind(null, post.id) : createPostAction;
  const [state, formAction, pending] = useActionState(action, INITIAL);

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        <Field label="Título" name="title" defaultValue={post?.title ?? ''} required />
        <Field
          label="Slug"
          name="slug"
          defaultValue={post?.slug ?? ''}
          hint="kebab-case · se autogenera si lo dejas vacío"
        />
        <Field
          label="Resumen"
          name="excerpt"
          defaultValue={post?.excerpt ?? ''}
          as="textarea"
          rows={2}
        />
        <Field
          label="Contenido (markdown / texto plano)"
          name="content"
          defaultValue={post?.content ?? ''}
          as="textarea"
          rows={20}
          required
        />
      </div>

      <aside className="flex h-fit flex-col gap-4 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
        <SelectField
          label="Estado"
          name="status"
          defaultValue={post?.status ?? 'draft'}
          options={[
            { value: 'draft', label: 'Borrador' },
            { value: 'published', label: 'Publicado' },
          ]}
        />
        <Field label="Imagen de portada (URL)" name="coverUrl" defaultValue={post?.coverUrl ?? ''} />
        <Field
          label="Autor"
          name="authorName"
          defaultValue={post?.authorName ?? 'Industrial Fighters'}
        />
        <Field
          label="Tags (separados por coma)"
          name="tags"
          defaultValue={(post?.tags ?? []).join(', ')}
          hint="Ej: materiales, taller, equipos"
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
          {pending ? 'Guardando…' : post ? 'Guardar cambios' : 'Crear post'}
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
      {hint ? (
        <span className="font-mono text-[10px] text-[var(--color-fg-subtle)]">{hint}</span>
      ) : null}
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
