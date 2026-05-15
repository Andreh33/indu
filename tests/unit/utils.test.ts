import { describe, expect, it } from 'vitest';
import { slugify } from '@/lib/utils/slugify';
import { formatPriceEUR } from '@/lib/utils/format-price';

describe('slugify', () => {
  it('lowercases and dashifies', () => {
    expect(slugify('Shorts Muay Thai')).toBe('shorts-muay-thai');
  });
  it('strips accents (ñ → n, á → a)', () => {
    expect(slugify('camiseta con eñe y á')).toBe('camiseta-con-ene-y-a');
  });
  it('collapses multiple spaces and dashes', () => {
    expect(slugify('A   B---C')).toBe('a-b-c');
  });
  it('truncates to 80 chars max', () => {
    const long = 'a'.repeat(200);
    expect(slugify(long).length).toBe(80);
  });
});

describe('formatPriceEUR', () => {
  it('formats whole-euro amounts without decimals', () => {
    expect(formatPriceEUR(8500).replace(/\s/g, ' ')).toMatch(/85\s?€/);
  });
  it('formats cent amounts with two decimals', () => {
    const out = formatPriceEUR(8550).replace(/\s/g, ' ');
    expect(out).toMatch(/85,50\s?€/);
  });
});
