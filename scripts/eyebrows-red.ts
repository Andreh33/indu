/**
 * Sustituye los eyebrows `text-[var(--color-fg-subtle)]` por `--color-blood-400`
 * sólo cuando van inmediatamente seguidos de un texto que empieza con "// ".
 * No tocamos otros usos legítimos del color sutil.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const FILES = [
  'src/app/(public)/page.tsx',
  'src/app/(public)/sobre-nosotros/page.tsx',
  'src/app/(public)/trabajos/page.tsx',
  'src/app/(public)/carrito/page.tsx',
  'src/app/(public)/shop/page.tsx',
  'src/app/(public)/shop/[category]/page.tsx',
  'src/app/(public)/producto/[slug]/_components/product-content.tsx',
  'src/app/(public)/trabajos/[slug]/_components/work-content.tsx',
  'src/app/(secret)/esquina/page.tsx',
  'src/app/not-found.tsx',
  'src/components/shop/product-grid.tsx',
  'src/components/easter-eggs/punching-bag.tsx',
  'src/components/shop/cart-drawer.tsx',
];

// Regex: encuentra `text-[var(--color-fg-subtle)]` seguido por contenido + `{'//`
// El truco: matcheamos hasta el `{'// ` permitiendo cualquier whitespace/etiquetas en medio
// pero limitando a 300 chars para no agarrar otros tag.
const re =
  /text-\[var\(--color-fg-subtle\)\](?=[^]{0,300}\{\s*'\/\/ )/g;

let total = 0;
for (const f of FILES) {
  try {
    const before = readFileSync(f, 'utf8');
    const after = before.replace(re, 'text-[var(--color-blood-400)]');
    if (before !== after) {
      const count = (before.match(re) ?? []).length;
      writeFileSync(f, after);
      total += count;
      console.log(`  · ${f} — ${count} replaced`);
    }
  } catch (e) {
    console.log(`  · skip ${f} (${(e as Error).message})`);
  }
}
console.log(`\n✅ ${total} eyebrows changed.`);
