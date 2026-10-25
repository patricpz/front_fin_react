import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowDownLeft, ArrowUpRight, TrendingUp, Wallet } from 'lucide-react'

import { ExpensesByCategoryChart } from '@/components/charts/ExpensesByCategoryChart'
import { MonthlyEvolutionChart } from '@/components/charts/MonthlyEvolutionChart'
import { NewTransactionModal } from '@/components/common/NewTransactionModal'
import { StatCard } from '@/components/common/StatCard'
import { TransactionList } from '@/components/common/TransactionList'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/progress'
import { Plus } from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import { formatCurrency } from '@/utils/formatCurrency'
import { useState } from 'react'

export function DashboardPage() {
  const { data, isLoading } = useDashboard()
  const currentMonth = format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })
  const [showNewTransaction, setShowNewTransaction] = useState(false)

  const expense = data?.monthlyExpenses ?? 0
  const income = data?.monthlyIncome ?? 0
  const saldoFin = income - expense

  return (
    <div className="mx-auto w-full max-w-lg md:max-w-none">
      <Header
        title="Dashboard"
        subtitle={currentMonth}
        action={
          <Button
            onClick={() => setShowNewTransaction(true)}
            className="gap-2"
            size="sm"
          >
            <Plus className="size-4" />
            Nova transação
          </Button>
        }
      />
      <NewTransactionModal open={showNewTransaction} onOpenChange={setShowNewTransaction} />

      <main className="space-y-4 px-4 py-4 md:space-y-6 md:px-0 md:py-0">
        {isLoading ? (
          <>
            <Skeleton className="h-36 w-full rounded-2xl" />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="col-span-2 h-24 w-full md:col-span-1" />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Skeleton className="h-80 w-full rounded-2xl" />
              <Skeleton className="h-80 w-full rounded-2xl" />
            </div>
          </>
        ) : data ? (
          <>
            {/* Balance Overview Card */}
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
              <CardContent className="p-5 md:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm opacity-90">Saldo total</p>
                    <p className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
                      {formatCurrency(saldoFin)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/15 p-2.5 md:p-3">
                    <Wallet className="size-6 md:size-7" />
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/20 pt-4 md:grid-cols-3">
                  <div>
                    <p className="text-xs opacity-80">Saldo previsto</p>
                    <p className="mt-0.5 text-sm font-semibold md:text-base">
                      {formatCurrency(data.projectedBalance)}
                    </p>
                  </div>
                  <div className="text-right md:text-left">
                    <p className="text-xs opacity-80">Contas ativas</p>
                    <p className="mt-0.5 text-sm font-semibold md:text-base">3 contas</p>
                  </div>
                  <div className="hidden md:block text-right">
                    <p className="text-xs opacity-80">Mês de referência</p>
                    <p className="mt-0.5 text-sm font-semibold capitalize">{currentMonth}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Stat Cards */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
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
              <div className="col-span-2 md:col-span-1">
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

            {/* Charts Grid */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
              <ExpensesByCategoryChart data={data.expensesByCategory} />
              <MonthlyEvolutionChart data={data.monthlyEvolution} />
            </div>

            {/* Transactions List */}
            <TransactionList transactions={data.recentTransactions} />
          </>
        ) : null}
      </main>
    </div>
  )
}
