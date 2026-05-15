import Link from 'next/link';
import type { Category } from '@/lib/db/schema';
import { cn } from '@/lib/utils/cn';

type Props = { categories: Category[]; activeSlug?: string };

export default function FilterBar({ categories, activeSlug }: Props) {
  return (
    <div className="sticky top-16 z-[6] border-b border-[var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-bg)_92%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[var(--container-max)] items-center gap-3 overflow-x-auto px-6 py-4 md:px-10 lg:px-16">
        <Link
          href="/shop"
          className={cn(
            'whitespace-nowrap border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors',
            !activeSlug
              ? 'border-[var(--color-blood-400)] bg-[var(--color-blood-400)] text-[var(--color-canvas-0)]'
              : 'border-[var(--color-border)] text-[var(--color-fg-muted)] hover:border-[var(--color-canvas-300)]',
          )}
        >
          Todos
        </Link>
        {categories.map((c) => {
          const active = activeSlug === c.slug;
          return (
            <Link
              key={c.id}
              href={`/shop/${c.slug}`}
              className={cn(
                'whitespace-nowrap border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors',
                active
                  ? 'border-[var(--color-blood-400)] bg-[var(--color-blood-400)] text-[var(--color-canvas-0)]'
                  : 'border-[var(--color-border)] text-[var(--color-fg-muted)] hover:border-[var(--color-canvas-300)]',
              )}
            >
              {c.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
