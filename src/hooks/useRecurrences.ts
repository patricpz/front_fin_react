import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/apiError'
import { queryKeys } from '@/lib/queryKeys'
import {
  createRecurrence,
  deleteRecurrence,
  fetchRecurrenceById,
  fetchRecurrences,
  generateRecurrences,
  updateRecurrence,
} from '@/services/financeApi'
import type { CreateRecurrencePayload, UpdateRecurrencePayload } from '@/services/financeApi'

export function useRecurrences() {
  return useQuery({
    queryKey: queryKeys.recurrences,
    queryFn: fetchRecurrences,
  })
}

export function useRecurrence(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.recurrences,
    queryFn: () => fetchRecurrenceById(id!),
    enabled: Boolean(id),
  })
}

export function useCreateRecurrence() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateRecurrencePayload) => createRecurrence(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recurrences })
      toast.success('Recorrência criada com sucesso!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível criar a recorrência.'))
    },
  })
}

export function useUpdateRecurrence() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRecurrencePayload }) => updateRecurrence(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recurrences })
      toast.success('Recorrência atualizada com sucesso!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível atualizar a recorrência.'))
    },
  })
}

export function useDeleteRecurrence() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteRecurrence(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recurrences })
      toast.success('Recorrência removida com sucesso!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível remover a recorrência.'))
    },
  })
}

export function useGenerateRecurrences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dataLimite }: { id?: string; dataLimite?: string } = {}) => generateRecurrences(id, dataLimite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions() })
      queryClient.invalidateQueries({ queryKey: queryKeys.recurrences })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts })
      toast.success('Recorrências geradas com sucesso!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível gerar recorrências.'))
    },
  })
}