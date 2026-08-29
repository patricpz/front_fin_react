import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { tokenStorage } from '@/services/tokenStorage'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setSession: (user: User | null, accessToken: string, refreshToken: string) => void
  setUser: (user: User | null) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setSession: (user, accessToken, refreshToken) => {
        tokenStorage.set(accessToken, refreshToken)
        set({ user, accessToken, refreshToken, isAuthenticated: true })
      },
      setUser: (user) => set({ user }),
      clearSession: () => {
        tokenStorage.clear()
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          tokenStorage.set(state.accessToken, state.refreshToken)
        }
      },
    },
  ),
)
