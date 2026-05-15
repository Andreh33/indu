'use client';

import { useActionState, useTransition } from 'react';
import {
  createVariantAction,
  deleteVariantAction,
  type VariantFormState,
} from '@/server/actions/variants';
import type { ProductVariant } from '@/lib/db/schema';
import { formatPriceEUR } from '@/lib/utils/format-price';

const INITIAL: VariantFormState = { error: null };

type Props = {
  productId: string;
  basePriceCents: number;
  variants: ProductVariant[];
};

export default function VariantsSection({ productId, basePriceCents, variants }: Props) {
  const [state, formAction, pending] = useActionState(createVariantAction, INITIAL);

  return (
    <section className="mt-12 border-t border-[var(--color-border)] pt-8">
      <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
        {'// VARIANTES (SKU + STOCK)'}
      </h2>
      <p className="mt-1 max-w-prose text-sm text-[var(--color-fg-muted)]">
        Cada variante es una combinación específica (talla, color, peso). Si no añades
        ninguna, el producto se vende como stock infinito.
      </p>

      {variants.length > 0 ? (
        <ul className="mt-6 divide-y divide-[var(--color-border)] border border-[var(--color-border)]">
          {variants.map((v) => (
            <li key={v.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-xs text-[var(--color-fg-muted)]">{v.sku}</span>
                {v.size ? (
                  <span className="font-mono text-xs">T·{v.size}</span>
                ) : null}
                {v.color ? <span className="font-mono text-xs">C·{v.color}</span> : null}
                {v.weight ? <span className="font-mono text-xs">P·{v.weight}</span> : null}
                <span className="font-mono text-xs text-[var(--color-canvas-0)]">
                  Stock:{' '}
                  {v.stockQuantity === null ? '∞' : v.stockQuantity}
                </span>
                <span className="font-mono text-xs text-[var(--color-canvas-0)]">
                  {formatPriceEUR(v.priceCents ?? basePriceCents)}
                </span>
                {!v.active ? (
                  <span className="font-mono text-[10px] uppercase text-[var(--color-fg-subtle)]">
                    inactiva
                  </span>
                ) : null}
              </div>
              <DeleteVariantButton id={v.id} sku={v.sku} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-[var(--color-fg-subtle)]">Sin variantes aún.</p>
      )}

      <form action={formAction} className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-7">
        <input type="hidden" name="productId" value={productId} />
        <Field label="SKU" name="sku" required placeholder="MT-RJ-L" className="col-span-2" />
        <Field label="Talla" name="size" placeholder="L" />
        <Field label="Color" name="color" placeholder="Rojo bandera" />
        <Field label="Peso" name="weight" placeholder="12oz" />
        <Field label="Stock (vacío = ∞)" name="stockQuantity" type="number" min="0" />
        <Field
          label={`Precio € (vacío = ${(basePriceCents / 100).toFixed(0)})`}
          name="priceEuros"
          type="number"
          step="0.01"
          min="0"
        />

        <label className="col-span-2 flex items-end gap-2 md:col-span-1">
          <input
            type="checkbox"
            name="active"
            defaultChecked
            className="h-4 w-4 accent-[var(--color-blood-400)]"
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Activa</span>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="col-span-2 h-11 bg-[var(--color-blood-400)] px-4 font-display text-sm uppercase tracking-[0.06em] text-[var(--color-canvas-0)] hover:bg-[var(--color-blood-300)] disabled:opacity-60 md:col-span-7"
        >
          {pending ? 'Añadiendo…' : 'Añadir variante'}
        </button>

        {state.error ? (
          <p className="col-span-full font-mono text-xs text-[var(--color-blood-300)]">
            {state.error}
          </p>
        ) : null}
      </form>
    </section>
  );
}

function Field({
  label,
  className,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`flex flex-col gap-1 ${className ?? ''}`}>
      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
        {label}
      </span>
      <input
        {...props}
        className="h-10 border border-[var(--color-border)] bg-[var(--color-bg)] px-3 font-mono text-xs text-[var(--color-canvas-0)] focus:border-[var(--color-blood-400)] focus:outline-none"
      />
    </label>
  );
}

function DeleteVariantButton({ id, sku }: { id: string; sku: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => {
        if (!confirm(`¿Borrar variante "${sku}"?`)) return;
        start(() => deleteVariantAction(id));
      }}
      disabled={pending}
      className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-blood-400)] hover:text-[var(--color-blood-300)] disabled:opacity-50"
    >
      {pending ? '…' : '×'}
    </button>
  );
}
