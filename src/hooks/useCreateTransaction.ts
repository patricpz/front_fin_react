import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/apiError'
import { queryKeys } from '@/lib/queryKeys'
import type { TransactionFormValues } from '@/schemas/transactionSchema'
import { dataSource } from '@/services/dataSource'

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TransactionFormValues) =>
      dataSource.createTransaction(data, crypto.randomUUID()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts })
      toast.success('Transação criada com sucesso!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível criar a transação.'))
    },
  })
}
