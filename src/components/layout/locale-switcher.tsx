'use client';

import { useLocaleStore } from '@/i18n/locale-store';
import type { Locale } from '@/i18n/dictionaries';
import { cn } from '@/lib/utils/cn';

const LANGS: { code: Locale; label: string }[] = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
];

export default function LocaleSwitcher({ className }: { className?: string }) {
  const current = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);

  return (
    <ul
      className={cn(
        'flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.3em]',
        className,
      )}
    >
      {LANGS.map((l, i) => (
        <li key={l.code} className="flex items-center gap-1">
          <button
            onClick={() => setLocale(l.code)}
            aria-label={`Cambiar idioma a ${l.label}`}
            aria-current={current === l.code}
            className={
              current === l.code
                ? 'text-[var(--color-blood-400)]'
                : 'text-[var(--color-fg-muted)] hover:text-[var(--color-canvas-0)]'
            }
          >
            {l.label}
          </button>
          {i < LANGS.length - 1 ? <span className="text-[var(--color-fg-subtle)]">·</span> : null}
        </li>
      ))}
    </ul>
  );
}
