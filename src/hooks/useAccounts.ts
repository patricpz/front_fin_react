import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/apiError'
import { queryKeys } from '@/lib/queryKeys'
import {
  createAccount,
  deleteAccount,
  fetchAccountBalance,
  fetchAccountById,
  fetchAccounts,
  updateAccount,
} from '@/services/financeApi'
import type { CreateAccountPayload, UpdateAccountPayload } from '@/services/financeApi'

export function useAccounts() {
  return useQuery({
    queryKey: queryKeys.accounts,
    queryFn: fetchAccounts,
  })
}

export function useAccount(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.account(id ?? ''),
    queryFn: () => fetchAccountById(id!),
    enabled: Boolean(id),
  })
}

export function useAccountBalance(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.accountBalance(id ?? ''),
    queryFn: () => fetchAccountBalance(id!),
    enabled: Boolean(id),
  })
}

export function useCreateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAccountPayload) => createAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts })
      toast.success('Conta criada com sucesso!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível criar a conta.'))
    },
  })
}

export function useUpdateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAccountPayload }) => updateAccount(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts })
      queryClient.invalidateQueries({ queryKey: queryKeys.account(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.accountBalance(id) })
      toast.success('Conta atualizada com sucesso!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível atualizar a conta.'))
    },
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts })
      toast.success('Conta removida com sucesso!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível remover a conta.'))
    },
  })
}