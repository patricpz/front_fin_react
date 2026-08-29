import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowDownLeft, ArrowUpRight, TrendingUp, Wallet } from 'lucide-react'

import { ExpensesByCategoryChart } from '@/components/charts/ExpensesByCategoryChart'
import { MonthlyEvolutionChart } from '@/components/charts/MonthlyEvolutionChart'
import { StatCard } from '@/components/common/StatCard'
import { TransactionList } from '@/components/common/TransactionList'
import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/progress'
import { useDashboard } from '@/hooks/useDashboard'
import { formatCurrency } from '@/utils/formatCurrency'

export function DashboardPage() {
  const { data, isLoading } = useDashboard()
  const currentMonth = format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })

  return (
    <div className="mx-auto max-w-lg">
      <Header title="Dashboard" subtitle={currentMonth} />

      <main className="space-y-4 px-4 py-4">
        {isLoading ? (
          <>
            <Skeleton className="h-36 w-full rounded-2xl" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </>
        ) : data ? (
          <>
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm opacity-90">Saldo total</p>
                    <p className="mt-1 text-3xl font-bold tracking-tight">
                      {formatCurrency(data.totalBalance)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/15 p-2.5">
                    <Wallet className="size-6" />
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/20 pt-4">
                  <div>
                    <p className="text-xs opacity-80">Saldo previsto</p>
                    <p className="mt-0.5 text-sm font-semibold">
                      {formatCurrency(data.projectedBalance)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-80">Contas ativas</p>
                    <p className="mt-0.5 text-sm font-semibold">3 contas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <StatCard
                title="Receitas do mês"
                value={formatCurrency(data.monthlyIncome)}
                icon={ArrowDownLeft}
                variant="income"
              />
              <StatCard
                title="Despesas do mês"
                value={formatCurrency(data.monthlyExpenses)}
                icon={ArrowUpRight}
                variant="expense"
              />
              <div className="col-span-2">
                <StatCard
                  title="Resultado do mês"
                  value={formatCurrency(data.monthlyIncome - data.monthlyExpenses)}
                  icon={TrendingUp}
                  variant={
                    data.monthlyIncome - data.monthlyExpenses >= 0 ? 'income' : 'expense'
                  }
                  trend="Receitas menos despesas pagas"
                />
              </div>
            </div>

            <ExpensesByCategoryChart data={data.expensesByCategory} />
            <MonthlyEvolutionChart data={data.monthlyEvolution} />
            <TransactionList transactions={data.recentTransactions} />
          </>
        ) : null}
      </main>
    </div>
  )
}
