import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'

import { TransactionItem } from '@/components/common/TransactionItem'
import { Header } from '@/components/layout/Header'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/progress'
import { ROUTES } from '@/constants'
import { useTransactions } from '@/hooks/useTransactions'
import { cn } from '@/lib/utils'
import type { TransactionType } from '@/types'
import { formatCurrency } from '@/utils/formatCurrency'
import { filterCurrentMonthTransactions } from '@/utils/calculations'

type FilterType = 'todas' | TransactionType

const filters: Array<{ value: FilterType; label: string }> = [
  { value: 'todas', label: 'Todas' },
  { value: 'receita', label: 'Receitas' },
  { value: 'despesa', label: 'Despesas' },
]

export function TransactionsPage() {
  const { data: transactions = [], isLoading } = useTransactions()
  const [filter, setFilter] = useState<FilterType>('todas')
  const [search, setSearch] = useState('')

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesFilter = filter === 'todas' || transaction.type === filter
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(search.toLowerCase().trim())

      return matchesFilter && matchesSearch
    })
  }, [transactions, filter, search])

  const monthTransactions = filterCurrentMonthTransactions(transactions)
  const totalIncome = monthTransactions
    .filter((t) => t.type === 'receita' && t.status === 'confirmado')
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = monthTransactions
    .filter((t) => t.type === 'despesa' && t.status === 'confirmado')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="mx-auto max-w-lg">
      <Header title="Transações" subtitle="Gerencie receitas e despesas" />

      <main className="space-y-4 px-4 py-4">
        <Link
          to={ROUTES.TRANSACTION_NEW}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Nova transação
        </Link>

        <Card className="border-0 shadow-md">
          <CardContent className="grid grid-cols-2 gap-4 p-4">
            <div>
              <p className="text-xs text-muted-foreground">Receitas (mês)</p>
              <p className="text-lg font-bold text-income">{formatCurrency(totalIncome)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Despesas (mês)</p>
              <p className="text-lg font-bold text-expense">{formatCurrency(totalExpenses)}</p>
            </div>
          </CardContent>
        </Card>

        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar por descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-xl border border-input bg-background pr-4 pl-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={cn(
                'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                filter === item.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold">Lista de transações</h2>
              <Badge variant="secondary">{filteredTransactions.length}</Badge>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredTransactions.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Nenhuma transação encontrada.
              </p>
            ) : (
              <div className="divide-y">
                {filteredTransactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    showActions
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}