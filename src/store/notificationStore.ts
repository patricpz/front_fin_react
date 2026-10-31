import { create } from 'zustand'

interface NotificationStore {
  isPanelOpen: boolean
  openPanel: () => void
  closePanel: () => void
  togglePanel: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  isPanelOpen: false,
  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false }),
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
}))