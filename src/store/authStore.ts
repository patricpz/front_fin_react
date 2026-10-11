import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { tokenStorage } from '@/services/tokenStorage'
import type { User } from '@/types'
import { tokenValido } from '@/utils/auth'

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
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<AuthState>

        if (!tokenValido(persisted.accessToken ?? null)) {
          tokenStorage.clear()
          return currentState
        }

        return {
          ...currentState,
          ...persisted,
          isAuthenticated: true,
        }
      },
      onRehydrateStorage: () => (state) => {
        const accessToken = state?.accessToken ?? null
        if (accessToken && tokenValido(accessToken)) {
          tokenStorage.set(accessToken, state?.refreshToken)
        }
      },
    },
  ),
)
