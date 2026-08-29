import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/queryKeys'
import {
  fetchMonthlySummary,
  fetchCategorySpending,
  fetchBalanceEvolution,
  fetchBudgetVsActual,
} from '@/services/financeApi'

export function useMonthlySummary(mes: number, ano: number) {
  return useQuery({
    queryKey: queryKeys.reports.monthly(mes, ano),
    queryFn: () => fetchMonthlySummary(mes, ano),
    enabled: mes > 0 && ano > 0,
  })
}

export function useCategorySpending(mes: number, ano: number) {
  return useQuery({
    queryKey: queryKeys.reports.category(mes, ano),
    queryFn: () => fetchCategorySpending(mes, ano),
    enabled: mes > 0 && ano > 0,
  })
}

export function useBalanceEvolution(mes: number, ano: number, contaId?: string) {
  return useQuery({
    queryKey: queryKeys.reports.evolution(mes, ano, contaId),
    queryFn: () => fetchBalanceEvolution(mes, ano, contaId),
    enabled: mes > 0 && ano > 0,
  })
}

export function useBudgetVsActual(mes: number, ano: number) {
  return useQuery({
    queryKey: queryKeys.reports.budget(mes, ano),
    queryFn: () => fetchBudgetVsActual(mes, ano),
    enabled: mes > 0 && ano > 0,
  })
}