import { create } from 'zustand';

export type CursorMode = 'default' | 'link' | 'image' | 'punch' | 'drag';

type CursorState = {
  mode: CursorMode;
  label: string | null;
  setCursor: (mode: CursorMode, label?: string | null) => void;
  reset: () => void;
};

export const useCursorStore = create<CursorState>((set) => ({
  mode: 'default',
  label: null,
  setCursor: (mode, label = null) => set({ mode, label }),
  reset: () => set({ mode: 'default', label: null }),
}));
