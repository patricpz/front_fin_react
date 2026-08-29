import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/apiError'
import { queryKeys } from '@/lib/queryKeys'
import { fetchMe, login, logout, register } from '@/services/financeApi'
import { useAuthStore } from '@/store/authStore'

export function useCurrentUser() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const setUser = useAuthStore((state) => state.setUser)
  const clearSession = useAuthStore((state) => state.clearSession)

  return useQuery({
    queryKey: queryKeys.me,
    queryFn: async () => {
      const user = await fetchMe()
      setUser(user)
      return user
    },
    enabled: Boolean(accessToken),
    retry: false,
    staleTime: 1000 * 60 * 5,
    throwOnError: false,
    meta: { onAuthError: clearSession },
  })
}

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const tokens = await login(email, password)
      const user = await fetchMe()
      setSession(user, tokens.accessToken, tokens.refreshToken)
      return user
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
      toast.success('Login realizado com sucesso!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível entrar.'))
    },
  })
}

export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { name: string; email: string; password: string }) => {
      await register(payload)
      const tokens = await login(payload.email, payload.password)
      const user = await fetchMe()
      setSession(user, tokens.accessToken, tokens.refreshToken)
      return user
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
      toast.success('Conta criada com sucesso!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível criar a conta.'))
    },
  })
}

export function useLogout() {
  const clearSession = useAuthStore((state) => state.clearSession)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearSession()
      queryClient.clear()
    },
  })
}
