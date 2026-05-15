/**
 * Quita 'use cache' + cacheLife() + cacheTag() y reemplaza updateTag → revalidateTag.
 * Necesario al apagar cacheComponents.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const FILES = [
  'src/server/queries/products.ts',
  'src/server/queries/works.ts',
  'src/server/queries/settings.ts',
  'src/server/actions/products.ts',
  'src/server/actions/works.ts',
  'src/server/actions/settings.ts',
];

let total = 0;
for (const f of FILES) {
  const before = readFileSync(f, 'utf8');
  const after = before
    // Borrar 'use cache'; lines (con cualquier indent)
    .replace(/^\s*['"]use cache['"];\s*\n/gm, '')
    // Borrar cacheLife('...');
    .replace(/^\s*cacheLife\([^)]*\);\s*\n/gm, '')
    // Borrar cacheTag(...);
    .replace(/^\s*cacheTag\([^)]*\);\s*\n/gm, '')
    // Reemplazar updateTag → revalidateTag (Next 15 / 16 sin cacheComponents)
    .replace(/\bupdateTag\b/g, 'revalidateTag')
    // Limpiar imports: cacheLife / cacheTag / updateTag de next/cache
    .replace(
      /import \{[^}]*\} from ['"]next\/cache['"];?\n/g,
      (m) => {
        const inner = m.match(/\{([^}]*)\}/)?.[1] ?? '';
        const names = inner
          .split(',')
          .map((s) => s.trim())
          .filter((n) => n && !['cacheLife', 'cacheTag', 'updateTag'].includes(n))
          .map((n) => (n === 'updateTag' ? 'revalidateTag' : n));
        const uniq = Array.from(new Set([...names, ...(m.includes('updateTag') ? ['revalidateTag'] : [])]));
        return uniq.length === 0
          ? ''
          : `import { ${uniq.join(', ')} } from 'next/cache';\n`;
      },
    );

  if (before !== after) {
    writeFileSync(f, after);
    total += 1;
    console.log(`  · ${f}`);
  }
}
console.log(`\n✅ ${total} files updated.`);
