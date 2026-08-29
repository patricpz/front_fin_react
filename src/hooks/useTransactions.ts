import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/apiError'
import { queryKeys } from '@/lib/queryKeys'
import { crypto } from '@/lib/crypto'
import {
  confirmTransaction,
  createTransaction,
  deleteTransaction,
  fetchTransactionById,
  fetchTransactions,
  updateTransaction,
} from '@/services/financeApi'
import type { Transaction, TransactionFilters } from '@/types'
import type { TransactionFormValues } from '@/schemas/transactionSchema'

export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: queryKeys.transactions(filters),
    queryFn: () => fetchTransactions(filters),
  })
}

export function useTransaction(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.transaction(id ?? ''),
    queryFn: () => fetchTransactionById(id!),
    enabled: Boolean(id),
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: TransactionFormValues & { destinationAccountId?: string }) => {
      const idempotencyKey = crypto.randomUUID()
      return createTransaction({ ...payload, idempotency_key: idempotencyKey }, idempotencyKey)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions() })
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
      toast.success('Transação criada com sucesso!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível criar a transação.'))
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TransactionFormValues & { destinationAccountId?: string } }) =>
      updateTransaction(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions() })
      queryClient.invalidateQueries({ queryKey: queryKeys.transaction(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
      toast.success('Transação atualizada com sucesso!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível atualizar a transação.'))
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions() })
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
      toast.success('Transação removida com sucesso!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível remover a transação.'))
    },
  })
}

export function useConfirmTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => confirmTransaction(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions() })
      queryClient.invalidateQueries({ queryKey: queryKeys.transaction(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
      toast.success('Transação confirmada!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível confirmar a transação.'))
    },
  })
}

export function transactionToFormValues(transaction: Transaction): TransactionFormValues & { destinationAccountId?: string } {
  return {
    type: transaction.type === 'transferencia' ? 'despesa' : transaction.type,
    amount: transaction.amount,
    date: transaction.date,
    categoryId: transaction.categoryId || '',
    accountId: transaction.accountId,
    destinationAccountId: transaction.destinationAccountId || undefined,
    description: transaction.description,
    observacoes: transaction.observations || undefined,
    status: transaction.status,
  }
}