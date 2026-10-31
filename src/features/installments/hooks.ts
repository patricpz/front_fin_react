import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import {
  fetchInstallments,
  payInstallment,
} from '@/services/financeApi'

import type { Installment } from '@/types'

export function useInstallments() {
  return useQuery<Installment[]>({
    queryKey: ['installments'],
    queryFn: () => fetchInstallments(),
  })
}

export function usePayInstallment() {
  const qc = useQueryClient()
  return useMutation<Installment, Error, string>({
    mutationFn: (id) => payInstallment(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['installments'] }),
  })
}

export type { Installment }