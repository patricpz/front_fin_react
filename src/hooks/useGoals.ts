import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/apiError'
import { queryKeys } from '@/lib/queryKeys'
import {
  createGoal,
  createGoalContribution,
  deleteGoal,
  fetchGoalById,
  fetchGoalContributions,
  fetchGoalProgress,
  fetchGoals,
  updateGoal,
} from '@/services/financeApi'
import type { CreateGoalContributionPayload, CreateGoalPayload, GoalFilters, UpdateGoalPayload } from '@/services/financeApi'

export function useGoals(filters?: GoalFilters) {
  return useQuery({
    queryKey: queryKeys.goals,
    queryFn: () => fetchGoals(filters),
  })
}

export function useGoal(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.goalProgress(id ?? ''),
    queryFn: () => fetchGoalById(id!),
    enabled: Boolean(id),
  })
}

export function useGoalProgress(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.goalProgress(id ?? ''),
    queryFn: () => fetchGoalProgress(id!),
    enabled: Boolean(id),
  })
}

export function useGoalContributions(goalId: string | undefined, page?: number, size?: number) {
  return useQuery({
    queryKey: ['goals', goalId, 'contributions', page, size],
    queryFn: () => fetchGoalContributions(goalId!, page, size),
    enabled: Boolean(goalId),
  })
}

export function useCreateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateGoalPayload) => createGoal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals })
      toast.success('Meta criada com sucesso!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível criar a meta.'))
    },
  })
}

export function useUpdateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGoalPayload }) => updateGoal(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals })
      toast.success('Meta atualizada com sucesso!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível atualizar a meta.'))
    },
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals })
      toast.success('Meta removida com sucesso!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível remover a meta.'))
    },
  })
}

export function useCreateGoalContribution() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ goalId, payload }: { goalId: string; payload: CreateGoalContributionPayload }) =>
      createGoalContribution(goalId, payload),
    onSuccess: (_, { goalId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals })
      queryClient.invalidateQueries({ queryKey: queryKeys.goalProgress(goalId) })
      queryClient.invalidateQueries({ queryKey: ['goals', goalId, 'contributions'] })
      toast.success('Contribuição registrada com sucesso!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível registrar a contribuição.'))
    },
  })
}