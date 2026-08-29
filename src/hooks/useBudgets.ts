import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/apiError'
import { queryKeys } from '@/lib/queryKeys'
import {
  createBudget,
  deleteBudget,
  fetchBudgetById,
  fetchBudgetProgress,
  fetchBudgets,
  updateBudget,
} from '@/services/financeApi'
import type { BudgetFilters, CreateBudgetPayload, UpdateBudgetPayload } from '@/services/financeApi'

export function useBudgets(filters?: BudgetFilters) {
  return useQuery({
    queryKey: queryKeys.budgets(filters),
    queryFn: () => fetchBudgets(filters),
  })
}

export function useBudget(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.budgetProgress(id ?? ''),
    queryFn: () => fetchBudgetById(id!),
    enabled: Boolean(id),
  })
}

export function useBudgetProgress(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.budgetProgress(id ?? ''),
    queryFn: () => fetchBudgetProgress(id!),
    enabled: Boolean(id),
  })
}

export function useCreateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateBudgetPayload) => createBudget(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets({}) })
      toast.success('Orçamento criado com sucesso!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível criar o orçamento.'))
    },
  })
}

export function useUpdateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBudgetPayload }) => updateBudget(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets({}) })
      toast.success('Orçamento atualizado com sucesso!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível atualizar o orçamento.'))
    },
  })
}

export function useDeleteBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets({}) })
      toast.success('Orçamento removido com sucesso!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível remover o orçamento.'))
    },
  })
}