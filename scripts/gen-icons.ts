/**
 * Genera PNG de los iconos PWA desde los SVG fuente.
 * Requiere `sharp` (Next ya lo trae como dep).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

async function gen(src: string, out: string, size: number) {
  const svg = readFileSync(src);
  const buf = await sharp(svg).resize(size, size).png().toBuffer();
  writeFileSync(out, buf);
  console.log(`  · ${out} (${size}×${size}, ${buf.length} bytes)`);
}

async function main() {
  await gen('public/icons/icon.svg', 'public/icons/icon-192.png', 192);
  await gen('public/icons/icon.svg', 'public/icons/icon-512.png', 512);
  await gen('public/icons/icon-maskable.svg', 'public/icons/icon-192-maskable.png', 192);
  await gen('public/icons/icon-maskable.svg', 'public/icons/icon-512-maskable.png', 512);
  await gen('public/icons/icon.svg', 'public/favicon-32.png', 32);
  await gen('public/icons/icon.svg', 'public/apple-touch-icon.png', 180);
  console.log('✅ Icons generated.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
