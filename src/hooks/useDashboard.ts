import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/queryKeys'
import { dataSource } from '@/services/dataSource'

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: dataSource.fetchDashboardSummary,
  })
}
