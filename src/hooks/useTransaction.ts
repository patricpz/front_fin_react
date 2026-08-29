import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/queryKeys'
import { dataSource } from '@/services/dataSource'

export function useTransaction(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.transaction(id ?? ''),
    queryFn: () => dataSource.fetchTransactionById(id!),
    enabled: Boolean(id),
  })
}
