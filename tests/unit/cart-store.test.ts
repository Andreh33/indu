import { beforeEach, describe, expect, it } from 'vitest';
import { selectItemCount, selectSubtotalCents, useCartStore } from '@/lib/cart/store';
import type { CartItem } from '@/types/cart';

function makeItem(overrides: Partial<Omit<CartItem, 'id' | 'addedAt'>> = {}) {
  return {
    productId: 'p1',
    productSlug: 'shorts-rojo',
    productName: 'Shorts Rojo',
    productImage: 'https://example.test/img.jpg',
    category: 'muay-thai',
    basePriceCents: 8500,
    variants: { size: 'L', color: 'Rojo bandera' },
    customization: {},
    ...overrides,
  };
}

beforeEach(() => {
  useCartStore.setState({ items: [], isOpen: false, hydrated: true });
  localStorage.clear();
});

describe('cart store', () => {
  it('starts empty', () => {
    expect(useCartStore.getState().items).toEqual([]);
    expect(selectItemCount(useCartStore.getState())).toBe(0);
    expect(selectSubtotalCents(useCartStore.getState())).toBe(0);
  });

  it('adds an item and opens the drawer', () => {
    useCartStore.getState().add(makeItem());
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().isOpen).toBe(true);
  });

  it('increments quantity when adding the same product with same config', () => {
    useCartStore.getState().add(makeItem());
    useCartStore.getState().add(makeItem({ quantity: 2 }));
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0]!.quantity).toBe(3);
  });

  it('treats different sizes as different items', () => {
    useCartStore.getState().add(makeItem({ variants: { size: 'S' } }));
    useCartStore.getState().add(makeItem({ variants: { size: 'L' } }));
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it('treats different customizations as different items', () => {
    useCartStore.getState().add(makeItem({ customization: { frontText: 'TONY' } }));
    useCartStore.getState().add(makeItem({ customization: { frontText: 'IRENE' } }));
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it('removes an item', () => {
    useCartStore.getState().add(makeItem());
    const id = useCartStore.getState().items[0]!.id;
    useCartStore.getState().remove(id);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('updates quantity with a floor of 1', () => {
    useCartStore.getState().add(makeItem());
    const id = useCartStore.getState().items[0]!.id;
    useCartStore.getState().updateQuantity(id, 0);
    expect(useCartStore.getState().items[0]!.quantity).toBe(1);
    useCartStore.getState().updateQuantity(id, 5);
    expect(useCartStore.getState().items[0]!.quantity).toBe(5);
  });

  it('clears the cart', () => {
    useCartStore.getState().add(makeItem());
    useCartStore.getState().add(makeItem({ productId: 'p2', productName: 'Otro' }));
    useCartStore.getState().clear();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('computes subtotal in cents and item count', () => {
    useCartStore.getState().add(makeItem({ quantity: 2 }));
    useCartStore.getState().add(
      makeItem({
        productId: 'p2',
        productName: 'Guantes',
        basePriceCents: 9500,
        variants: { weight: '12oz' },
        quantity: 1,
      }),
    );
    expect(selectItemCount(useCartStore.getState())).toBe(3);
    expect(selectSubtotalCents(useCartStore.getState())).toBe(8500 * 2 + 9500);
  });

  it('controls drawer open/close/toggle', () => {
    expect(useCartStore.getState().isOpen).toBe(false);
    useCartStore.getState().open();
    expect(useCartStore.getState().isOpen).toBe(true);
    useCartStore.getState().close();
    expect(useCartStore.getState().isOpen).toBe(false);
    useCartStore.getState().toggle();
    expect(useCartStore.getState().isOpen).toBe(true);
  });
});
