import { useQuery, useMutation } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { fetchInstallments, payInstallment } from '@/services/financeApi'

export function useInstallments() {
  return useQuery({
    queryKey: queryKeys.installments.list(),
    queryFn: fetchInstallments,
  })
}

export function usePayInstallment() {
  return useMutation({
    mutationFn: payInstallment,
  })
}