import { Link } from 'react-router-dom'

import { TransactionItem } from '@/components/common/TransactionItem'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/progress'
import { ROUTES } from '@/constants'
import type { Transaction } from '@/types'

interface TransactionListProps {
  transactions: Transaction[]
  title?: string
  isLoading?: boolean
  showViewAll?: boolean
}

export function TransactionList({
  transactions,
  title = 'Últimas transações',
  isLoading,
  showViewAll = true,
}: TransactionListProps) {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{title}</CardTitle>
        {showViewAll && (
          <Link
            to={ROUTES.TRANSACTIONS}
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver todas
          </Link>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhuma transação encontrada.
          </p>
        ) : (
          <div className="divide-y">
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
