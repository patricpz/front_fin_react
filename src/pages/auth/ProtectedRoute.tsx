import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { ROUTES } from '@/constants'
import { useAuthStore } from '@/store/authStore'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return children
}
