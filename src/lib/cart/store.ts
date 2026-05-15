'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem } from '@/types/cart';

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  hydrated: boolean;
  add: (item: Omit<CartItem, 'id' | 'addedAt' | 'quantity'> & { quantity?: number }) => void;
  remove: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setHydrated: () => void;
};

function configKey(
  variants: CartItem['variants'],
  customization: CartItem['customization'],
): string {
  return JSON.stringify({ variants, customization });
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      hydrated: false,
      add: (input) => {
        const quantity = input.quantity ?? 1;
        const key = configKey(input.variants, input.customization);
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === input.productId && configKey(i.variants, i.customization) === key,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i,
              ),
              isOpen: true,
            };
          }
          const item: CartItem = {
            id: crypto.randomUUID(),
            addedAt: Date.now(),
            quantity,
            ...input,
          };
          return { items: [...state.items, item], isOpen: true };
        });
      },
      remove: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i))
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'if-cart-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);

export const selectSubtotalCents = (state: CartState) =>
  state.items.reduce((acc, i) => acc + i.basePriceCents * i.quantity, 0);

export const selectItemCount = (state: CartState) =>
  state.items.reduce((acc, i) => acc + i.quantity, 0);
