import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type LayoutMode = 'auto' | 'mobile' | 'web'

interface LayoutState {
  mode: LayoutMode
  setMode: (mode: LayoutMode) => void
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      mode: 'auto',
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'finance-layout-mode',
    },
  ),
)
