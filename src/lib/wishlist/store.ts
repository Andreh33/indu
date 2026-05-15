'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type WishlistState = {
  slugs: string[];
  hydrated: boolean;
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
  clear: () => void;
  setHydrated: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      slugs: [],
      hydrated: false,
      toggle: (slug) =>
        set((s) => ({
          slugs: s.slugs.includes(slug) ? s.slugs.filter((v) => v !== slug) : [...s.slugs, slug],
        })),
      has: (slug) => get().slugs.includes(slug),
      clear: () => set({ slugs: [] }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'if-wishlist-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ slugs: state.slugs }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);

export const selectWishlistCount = (state: WishlistState) => state.slugs.length;
