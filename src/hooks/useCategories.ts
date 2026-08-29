import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/apiError'
import { queryKeys } from '@/lib/queryKeys'
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  fetchCategoryById,
  fetchCategoryTree,
  updateCategory,
} from '@/services/financeApi'
import type { CreateCategoryPayload, UpdateCategoryPayload } from '@/services/financeApi'

export function useCategories(type?: 'receita' | 'despesa') {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => fetchCategories({ type }),
  })
}

export function useCategoryTree(type?: 'receita' | 'despesa') {
  return useQuery({
    queryKey: queryKeys.categoryTree,
    queryFn: () => fetchCategoryTree(type),
  })
}

export function useCategory(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => fetchCategoryById(id!),
    enabled: Boolean(id),
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories })
      queryClient.invalidateQueries({ queryKey: queryKeys.categoryTree })
      toast.success('Categoria criada com sucesso!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível criar a categoria.'))
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryPayload }) => updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories })
      queryClient.invalidateQueries({ queryKey: queryKeys.categoryTree })
      toast.success('Categoria atualizada com sucesso!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível atualizar a categoria.'))
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories })
      queryClient.invalidateQueries({ queryKey: queryKeys.categoryTree })
      toast.success('Categoria removida com sucesso!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível remover a categoria.'))
    },
  })
}