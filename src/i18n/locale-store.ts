'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DEFAULT_LOCALE, getDict, type Dictionary, type Locale } from './dictionaries';

type LocaleState = {
  locale: Locale;
  hydrated: boolean;
  setLocale: (l: Locale) => void;
  setHydrated: () => void;
};

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      hydrated: false,
      setLocale: (locale) => {
        set({ locale });
        // Actualizar lang del html para SEO/a11y
        if (typeof document !== 'undefined') {
          document.documentElement.lang = locale;
        }
      },
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'if-locale-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ locale: s.locale }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
        if (state && typeof document !== 'undefined') {
          document.documentElement.lang = state.locale;
        }
      },
    },
  ),
);

/** Hook que devuelve el diccionario activo. */
export function useDict(): Dictionary {
  const locale = useLocaleStore((s) => s.locale);
  return getDict(locale);
}
