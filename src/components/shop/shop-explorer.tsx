'use client';

import { useMemo, useState } from 'react';
import ProductGrid from './product-grid';
import { cn } from '@/lib/utils/cn';
import type { ProductWithImages } from '@/server/queries/products';

type SortKey = 'order' | 'price-asc' | 'price-desc' | 'name';

export default function ShopExplorer({ products }: { products: ProductWithImages[] }) {
  const [query, setQuery] = useState('');
  const [sizes, setSizes] = useState<Set<string>>(new Set());
  const [colors, setColors] = useState<Set<string>>(new Set());
  const [weights, setWeights] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortKey>('order');

  // Construir opciones únicas a partir de los productos
  const allSizes = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.availableSizes))).sort(),
    [products],
  );
  const allColors = useMemo(() => {
    const map = new Map<string, { name: string; hex: string }>();
    products.forEach((p) =>
      p.availableColors.forEach((c) => {
        if (!map.has(c.name)) map.set(c.name, c);
      }),
    );
    return Array.from(map.values());
  }, [products]);
  const allWeights = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.availableWeights))).sort(),
    [products],
  );

  const filtered = useMemo(() => {
    let out = products.filter((p) => {
      if (query) {
        const q = query.toLowerCase();
        const hay =
          p.name.toLowerCase().includes(q) ||
          (p.shortDescription ?? '').toLowerCase().includes(q) ||
          (p.type ?? '').toLowerCase().includes(q);
        if (!hay) return false;
      }
      if (sizes.size > 0 && !p.availableSizes.some((s) => sizes.has(s))) return false;
      if (colors.size > 0 && !p.availableColors.some((c) => colors.has(c.name))) return false;
      if (weights.size > 0 && !p.availableWeights.some((w) => weights.has(w))) return false;
      return true;
    });
    switch (sort) {
      case 'price-asc':
        out = [...out].sort((a, b) => a.basePriceCents - b.basePriceCents);
        break;
      case 'price-desc':
        out = [...out].sort((a, b) => b.basePriceCents - a.basePriceCents);
        break;
      case 'name':
        out = [...out].sort((a, b) => a.name.localeCompare(b.name, 'es'));
        break;
      default:
        out = [...out].sort((a, b) => a.displayOrder - b.displayOrder);
    }
    return out;
  }, [products, query, sizes, colors, weights, sort]);

  function toggle<T>(setState: React.Dispatch<React.SetStateAction<Set<T>>>, value: T) {
    setState((s) => {
      const next = new Set(s);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  function reset() {
    setQuery('');
    setSizes(new Set());
    setColors(new Set());
    setWeights(new Set());
    setSort('order');
  }

  const hasFilters = query || sizes.size > 0 || colors.size > 0 || weights.size > 0 || sort !== 'order';

  return (
    <div>
      {/* Search + sort */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar producto..."
          className="h-11 w-full max-w-md border border-[var(--color-border)] bg-[var(--color-bg)] px-4 font-mono text-sm text-[var(--color-canvas-0)] placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-blood-400)] focus:outline-none"
          aria-label="Buscar producto"
        />
        <label className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            Ordenar
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-11 border border-[var(--color-border)] bg-[var(--color-bg)] px-4 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-canvas-0)] focus:border-[var(--color-blood-400)] focus:outline-none"
          >
            <option value="order">Destacado</option>
            <option value="price-asc">Precio · menor a mayor</option>
            <option value="price-desc">Precio · mayor a menor</option>
            <option value="name">Nombre A→Z</option>
          </select>
        </label>
      </div>

      {/* Filtros multi-select */}
      <div className="mb-8 flex flex-col gap-5">
        {allSizes.length > 0 ? (
          <FilterRow
            label="Talla"
            options={allSizes.map((s) => ({ value: s, label: s }))}
            selected={sizes}
            onToggle={(v) => toggle(setSizes, v)}
          />
        ) : null}
        {allWeights.length > 0 ? (
          <FilterRow
            label="Peso"
            options={allWeights.map((w) => ({ value: w, label: w }))}
            selected={weights}
            onToggle={(v) => toggle(setWeights, v)}
          />
        ) : null}
        {allColors.length > 0 ? (
          <FilterRow
            label="Color"
            options={allColors.map((c) => ({
              value: c.name,
              label: c.name,
              swatch: c.hex,
            }))}
            selected={colors}
            onToggle={(v) => toggle(setColors, v)}
          />
        ) : null}

        {hasFilters ? (
          <button
            onClick={reset}
            className="self-start font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-blood-400)] hover:text-[var(--color-blood-300)]"
          >
            Limpiar filtros ×
          </button>
        ) : null}
      </div>

      {/* Counter */}
      <p className="mb-6 font-mono text-xs text-[var(--color-fg-muted)]">
        {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
      </p>

      <ProductGrid products={filtered} />
    </div>
  );
}

function FilterRow({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { value: string; label: string; swatch?: string }[];
  selected: Set<string>;
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)] md:w-16">
        {label}
      </span>
      <ul className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = selected.has(o.value);
          return (
            <li key={o.value}>
              <button
                onClick={() => onToggle(o.value)}
                className={cn(
                  'flex h-9 items-center gap-2 border px-3 font-mono text-xs uppercase transition-colors',
                  active
                    ? 'border-[var(--color-blood-400)] bg-[var(--color-blood-400)] text-[var(--color-canvas-0)]'
                    : 'border-[var(--color-border)] text-[var(--color-fg)] hover:border-[var(--color-canvas-300)]',
                )}
              >
                {o.swatch ? (
                  <span
                    aria-hidden
                    className="inline-block h-3 w-3 rounded-full border border-[var(--color-border)]"
                    style={{ background: o.swatch }}
                  />
                ) : null}
                {o.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
