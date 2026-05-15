'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/cart/store';
import { formatPriceEUR } from '@/lib/utils/format-price';
import { cn } from '@/lib/utils/cn';
import type { Product, ProductImage } from '@/lib/db/schema';
import type { Category } from '@/lib/db/schema';
import type { ProductConfiguration, ProductCustomization } from '@/types/cart';

type Props = {
  product: Product & { images: ProductImage[] };
  category: Category | null;
};

export default function ProductCustomizer({ product, category }: Props) {
  const cfg = product.customizationConfig ?? {};
  const sizes = product.availableSizes;
  const colors = product.availableColors;
  const weights = product.availableWeights;

  const [size, setSize] = useState<string | undefined>(sizes[0]);
  const [color, setColor] = useState<string | undefined>(colors[0]?.name);
  const [weight, setWeight] = useState<string | undefined>(weights[0]);
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [flag, setFlag] = useState<string | undefined>(cfg.flag?.options?.[0]);
  const [font, setFont] = useState<string | undefined>(cfg.font?.options?.[0]);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const add = useCartStore((s) => s.add);

  function onAdd() {
    const variants: ProductConfiguration = {};
    if (size) variants.size = size;
    if (color) variants.color = color;
    if (weight) variants.weight = weight;

    const customization: ProductCustomization = {};
    if (frontText.trim()) customization.frontText = frontText.trim();
    if (backText.trim()) customization.backText = backText.trim();
    if (flag && flag !== 'Ninguna') customization.flag = flag;
    if (font) customization.font = font;
    if (notes.trim()) customization.embroideryNotes = notes.trim();

    const primary = product.images.find((i) => i.isPrimary) ?? product.images[0];

    add({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      productImage: primary?.url ?? '',
      category: category?.slug ?? 'otros',
      basePriceCents: product.basePriceCents,
      variants,
      customization,
      quantity,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Talla */}
      {sizes.length > 0 ? (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
              Talla
            </span>
            <span className="font-mono text-[10px] text-[var(--color-fg-subtle)]">
              {size ?? '—'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={cn(
                  'h-10 min-w-12 border px-3 font-mono text-sm uppercase transition-colors',
                  size === s
                    ? 'border-[var(--color-blood-400)] bg-[var(--color-blood-400)] text-[var(--color-canvas-0)]'
                    : 'border-[var(--color-border)] text-[var(--color-fg)] hover:border-[var(--color-canvas-300)]',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Peso */}
      {weights.length > 0 ? (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
              Peso
            </span>
            <span className="font-mono text-[10px] text-[var(--color-fg-subtle)]">
              {weight ?? '—'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {weights.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWeight(w)}
                className={cn(
                  'h-10 min-w-14 border px-3 font-mono text-sm uppercase transition-colors',
                  weight === w
                    ? 'border-[var(--color-blood-400)] bg-[var(--color-blood-400)] text-[var(--color-canvas-0)]'
                    : 'border-[var(--color-border)] text-[var(--color-fg)] hover:border-[var(--color-canvas-300)]',
                )}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Color */}
      {colors.length > 0 ? (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
              Color
            </span>
            <span className="font-mono text-[10px] text-[var(--color-fg-subtle)]">
              {color ?? '—'}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {colors.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setColor(c.name)}
                aria-label={c.name}
                title={c.name}
                className={cn(
                  'h-10 w-10 border-2 transition-transform',
                  color === c.name
                    ? 'border-[var(--color-blood-400)] scale-110'
                    : 'border-[var(--color-border)] hover:border-[var(--color-canvas-300)]',
                )}
                style={{ background: c.hex }}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* Personalización */}
      {cfg.frontText?.enabled ? (
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            Texto frontal · max {cfg.frontText.maxLength}
          </span>
          <input
            type="text"
            value={frontText}
            onChange={(e) => setFrontText(e.target.value.slice(0, cfg.frontText!.maxLength))}
            placeholder="TONY"
            className="h-11 border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 font-mono text-sm uppercase tracking-[0.2em] text-[var(--color-canvas-0)] placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-blood-400)] focus:outline-none"
          />
        </label>
      ) : null}

      {cfg.backText?.enabled ? (
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            Texto trasero · max {cfg.backText.maxLength}
          </span>
          <input
            type="text"
            value={backText}
            onChange={(e) => setBackText(e.target.value.slice(0, cfg.backText!.maxLength))}
            placeholder="SPAIN"
            className="h-11 border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 font-mono text-sm uppercase tracking-[0.2em] text-[var(--color-canvas-0)] placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-blood-400)] focus:outline-none"
          />
        </label>
      ) : null}

      {cfg.flag?.enabled && cfg.flag.options.length > 0 ? (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
              Bandera
            </span>
            <span className="font-mono text-[10px] text-[var(--color-fg-subtle)]">
              {flag ?? '—'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {cfg.flag.options.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFlag(f)}
                className={cn(
                  'h-10 border px-4 font-mono text-xs uppercase',
                  flag === f
                    ? 'border-[var(--color-blood-400)] bg-[var(--color-blood-400)] text-[var(--color-canvas-0)]'
                    : 'border-[var(--color-border)] text-[var(--color-fg)] hover:border-[var(--color-canvas-300)]',
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {cfg.font?.enabled && cfg.font.options.length > 0 ? (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
              Fuente
            </span>
            <span className="font-mono text-[10px] text-[var(--color-fg-subtle)]">
              {font ?? '—'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {cfg.font.options.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFont(f)}
                className={cn(
                  'h-10 border px-4 font-mono text-xs uppercase',
                  font === f
                    ? 'border-[var(--color-blood-400)] bg-[var(--color-blood-400)] text-[var(--color-canvas-0)]'
                    : 'border-[var(--color-border)] text-[var(--color-fg)] hover:border-[var(--color-canvas-300)]',
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          Notas adicionales
        </span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, 300))}
          placeholder="Cuéntanos cualquier detalle especial."
          rows={3}
          className="border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-3 text-sm text-[var(--color-canvas-0)] placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-blood-400)] focus:outline-none"
        />
      </label>

      {/* Quantity + add */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 items-center border border-[var(--color-border)]">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-full w-10 items-center justify-center font-mono text-[var(--color-fg)] hover:bg-[var(--color-bg-card)]"
            aria-label="Reducir cantidad"
          >
            −
          </button>
          <span className="flex h-full w-10 items-center justify-center font-mono text-sm tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            className="flex h-full w-10 items-center justify-center font-mono text-[var(--color-fg)] hover:bg-[var(--color-bg-card)]"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="flex h-12 flex-1 items-center justify-center gap-3 bg-[var(--color-blood-400)] px-6 font-display text-base uppercase tracking-[0.06em] text-[var(--color-canvas-0)] transition-colors hover:bg-[var(--color-blood-300)]"
        >
          {added ? '✓ Añadido' : 'Añadir al carrito'}
          <span className="font-mono text-sm opacity-80">
            · {formatPriceEUR(product.basePriceCents * quantity)}
          </span>
        </button>
      </div>
    </div>
  );
}
