'use client';

import { useActionState } from 'react';
import type { Category, Product, ProductImage } from '@/lib/db/schema';
import {
  createProductAction,
  updateProductAction,
  type ProductFormState,
} from '@/server/actions/products';

const INITIAL: ProductFormState = { error: null };

type Props = {
  categories: Category[];
  product?: Product & { images: ProductImage[] };
};

export default function ProductForm({ categories, product }: Props) {
  const action = product
    ? updateProductAction.bind(null, product.id)
    : createProductAction;
  const [state, formAction, pending] = useActionState(action, INITIAL);

  const colorsLines = (product?.availableColors ?? [])
    .map((c) => `${c.name} | ${c.hex}`)
    .join('\n');

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-6">
        <Field label="Nombre" name="name" defaultValue={product?.name} required />
        <Field
          label="Slug"
          name="slug"
          defaultValue={product?.slug}
          hint="kebab-case · se autogenera si lo dejas vacío"
        />
        <Field
          label="Descripción corta"
          name="shortDescription"
          defaultValue={product?.shortDescription ?? ''}
          as="textarea"
          rows={2}
        />
        <Field
          label="Descripción larga"
          name="longDescription"
          defaultValue={product?.longDescription ?? ''}
          as="textarea"
          rows={5}
        />

        <Field
          label="Imágenes (una URL por línea, la primera es la principal)"
          name="imageUrls"
          defaultValue={product?.images?.map((i) => i.url).join('\n') ?? ''}
          as="textarea"
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Tallas (una por línea)"
            name="availableSizes"
            defaultValue={(product?.availableSizes ?? []).join('\n')}
            as="textarea"
            rows={4}
          />
          <Field
            label="Pesos (una por línea)"
            name="availableWeights"
            defaultValue={(product?.availableWeights ?? []).join('\n')}
            as="textarea"
            rows={4}
          />
        </div>

        <Field
          label="Colores (una por línea: nombre | #hex)"
          name="availableColors"
          defaultValue={colorsLines}
          as="textarea"
          rows={4}
          hint="Ej. Rojo bandera | #ED2939"
        />
      </div>

      <aside className="flex flex-col gap-4 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 h-fit">
        <SelectField
          label="Categoría"
          name="categoryId"
          defaultValue={product?.categoryId ?? categories[0]?.id}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
        <SelectField
          label="Estado"
          name="status"
          defaultValue={product?.status ?? 'draft'}
          options={[
            { value: 'draft', label: 'Borrador' },
            { value: 'published', label: 'Publicado' },
            { value: 'archived', label: 'Archivado' },
          ]}
        />
        <Field
          label="Precio (€)"
          name="priceEuros"
          type="number"
          step="0.01"
          defaultValue={product ? (product.basePriceCents / 100).toString() : ''}
          required
        />
        <Field
          label="Orden"
          name="displayOrder"
          type="number"
          defaultValue={(product?.displayOrder ?? 0).toString()}
        />
        <Field
          label="Tipo (slug interno)"
          name="type"
          defaultValue={product?.type ?? ''}
          hint="shorts, gloves, tee, etc."
        />

        {state.error ? (
          <p className="border border-[var(--color-blood-500)] bg-[var(--color-blood-900)]/40 px-3 py-2 font-mono text-xs text-[var(--color-blood-200)]">
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 h-12 bg-[var(--color-blood-400)] font-display text-sm uppercase tracking-[0.06em] text-[var(--color-canvas-0)] transition-colors hover:bg-[var(--color-blood-300)] disabled:opacity-60"
        >
          {pending ? 'Guardando…' : product ? 'Guardar cambios' : 'Crear producto'}
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
