import { describe, expect, it } from 'vitest';
import { buildWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp/format';
import type { CartItem } from '@/types/cart';

const SAMPLE: CartItem[] = [
  {
    id: 'i1',
    productId: 'p1',
    productSlug: 'shorts-muay-thai-rojo',
    productName: 'Shorts Muay Thai Rojo',
    productImage: '',
    category: 'muay-thai',
    basePriceCents: 8500,
    variants: { size: 'L', color: 'Rojo bandera' },
    customization: { frontText: 'TONY', flag: 'España' },
    quantity: 1,
    addedAt: 1_700_000_000_000,
  },
  {
    id: 'i2',
    productId: 'p2',
    productSlug: 'guantes-12oz-negro',
    productName: 'Guantes 12oz Negro',
    productImage: '',
    category: 'boxeo',
    basePriceCents: 9500,
    variants: { weight: '12oz' },
    customization: {},
    quantity: 2,
    addedAt: 1_700_000_000_001,
  },
];

describe('buildWhatsAppMessage', () => {
  it('includes both product names in uppercase', () => {
    const msg = buildWhatsAppMessage(SAMPLE);
    expect(msg).toContain('SHORTS MUAY THAI ROJO');
    expect(msg).toContain('GUANTES 12OZ NEGRO');
  });

  it('lists size, color, weight and customization fields', () => {
    const msg = buildWhatsAppMessage(SAMPLE);
    expect(msg).toContain('Talla: L');
    expect(msg).toContain('Color: Rojo bandera');
    expect(msg).toContain('Peso: 12oz');
    expect(msg).toContain('Frontal: "TONY"');
    expect(msg).toContain('Bandera: España');
  });

  it('computes subtotal correctly in euros (integer when applicable)', () => {
    const msg = buildWhatsAppMessage(SAMPLE);
    // 8500 + 9500*2 = 27500 → 275 €
    expect(msg).toContain('SUBTOTAL: 275 €');
    expect(msg).toContain('TOTAL ESTIMADO: 275 €');
  });

  it('uses the matching icon per category', () => {
    const msg = buildWhatsAppMessage(SAMPLE);
    expect(msg).toMatch(/🥊\s+SHORTS MUAY THAI ROJO/);
    expect(msg).toMatch(/🥊\s+GUANTES 12OZ NEGRO/);
  });

  it('omits empty customization rows', () => {
    const msg = buildWhatsAppMessage(SAMPLE);
    // Item 2 no tiene frontText
    const item2Block = msg.slice(msg.indexOf('GUANTES'));
    expect(item2Block).not.toContain('Frontal:');
    expect(item2Block).not.toContain('Bandera:');
  });
});

describe('buildWhatsAppUrl', () => {
  it('builds a wa.me URL with encoded message and the configured number', () => {
    const url = buildWhatsAppUrl(SAMPLE, '34612345678');
    expect(url.startsWith('https://wa.me/34612345678?text=')).toBe(true);
    const decoded = decodeURIComponent(url.split('?text=')[1]!);
    expect(decoded).toContain('Industrial Fighters');
    expect(decoded).toContain('TOTAL ESTIMADO: 275 €');
  });
});
