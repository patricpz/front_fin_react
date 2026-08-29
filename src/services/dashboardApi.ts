import { isRecord, pick, toNumber, unwrapList } from '@/lib/pick'
import { api } from '@/services/api'
import { endpoints } from '@/services/endpoints'
import { fetchAccounts, fetchCategories, fetchTransactions } from '@/services/financeApi'
import { mapCategory } from '@/services/mappers'
import type { TransactionType, TransactionStatus } from '@/types'
import {
  filterCurrentMonthTransactions,
  getExpensesByCategory,
  getMonthlyEvolution,
  getMonthlyExpenses,
  getMonthlyIncome,
  getPendingAmount,
  getProjectedBalance,
} from '@/utils/calculations'

interface DashboardSummary {
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  projectedBalance: number
  accountsCount: number
  expensesByCategory: Array<{ category: string; amount: number; color: string }>
  monthlyEvolution: Array<{ month: string; receitas: number; despesas: number }>
  recentTransactions: Transaction[]
}

interface Transaction {
  id: string
  userId: string
  accountId: string
  destinationAccountId: string | null
  categoryId: string | null
  type: TransactionType
  amount: number
  date: string
  description: string
  observations: string | null
  status: TransactionStatus
  attachmentUrl: string | null
  recurrenceId: string | null
  createdAt: string
  updatedAt: string
}

function currentPeriod() {
  const now = new Date()
  return { mes: now.getMonth() + 1, ano: now.getFullYear() }
}

export async function fetchMonthlySummary(mes: number, ano: number) {
  const { data } = await api.get(endpoints.reports.monthlySummary, {
    params: { mes, ano, month: mes, year: ano },
  })
  return isRecord(data) ? data : {}
}

export async function fetchCategorySpending(mes: number, ano: number) {
  const { data } = await api.get(endpoints.reports.categorySpending, {
    params: { mes, ano, month: mes, year: ano },
  })
  return unwrapList(data)
}

export async function fetchBalanceEvolution(mes: number, ano: number, contaId?: string) {
  const { data } = await api.get(endpoints.reports.balanceEvolution, {
    params: {
      mes,
      ano,
      month: mes,
      year: ano,
      conta_id: contaId,
      account_id: contaId,
    },
  })
  return unwrapList(data)
}

export async function fetchBudgetVsActual(mes: number, ano: number) {
  const { data } = await api.get(endpoints.reports.budgetVsActual, {
    params: { mes, ano, month: mes, year: ano },
  })
  return unwrapList(data)
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const { mes, ano } = currentPeriod()

  const [accounts, transactions, categories, summary, spending, evolution] = await Promise.all([
    fetchAccounts(),
    fetchTransactions({ page: 1, size: 50 }),
    fetchCategories().catch(() => []),
    fetchMonthlySummary(mes, ano).catch(() => ({})),
    fetchCategorySpending(mes, ano).catch(() => []),
    fetchBalanceEvolution(mes, ano).catch(() => []),
  ])

  const monthTransactions = filterCurrentMonthTransactions(transactions)
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
  const monthlyIncome =
    toNumber(pick(summary, ['total_receitas', 'receitas', 'monthly_income', 'monthlyIncome'], NaN), NaN)
  const monthlyExpenses =
    toNumber(pick(summary, ['total_despesas', 'despesas', 'monthly_expenses', 'monthlyExpenses'], NaN), NaN)
  const projected =
    toNumber(pick(summary, ['saldo_previsto', 'projected_balance', 'projectedBalance'], NaN), NaN)

  const expensesByCategory =
    spending.length > 0
      ? spending.map((item) => {
          const row = isRecord(item) ? item : {}
          const nested = isRecord(row.category) ? mapCategory(row.category) : null
          return {
            category: String(pick(row, ['category', 'categoria', 'name', 'nome'], nested?.name ?? 'Outros')),
            amount: toNumber(pick(row, ['amount', 'valor', 'total'], 0)),
            color: String(pick(row, ['color', 'cor'], nested?.color ?? '#64748b')),
          }
        })
      : getExpensesByCategory(monthTransactions, categories)

  const monthlyEvolution =
    evolution.length > 0
      ? evolution.map((item) => {
          const row = isRecord(item) ? item : {}
          return {
            month: String(pick(row, ['month', 'mes', 'label'], '')),
            receitas: toNumber(pick(row, ['receitas', 'income'], 0)),
            despesas: toNumber(pick(row, ['despesas', 'expenses'], 0)),
          }
        })
      : getMonthlyEvolution(transactions)

  const income = Number.isFinite(monthlyIncome) ? monthlyIncome : getMonthlyIncome(monthTransactions)
  const expenses = Number.isFinite(monthlyExpenses)
    ? monthlyExpenses
    : getMonthlyExpenses(monthTransactions)
  const pendingIncome = getPendingAmount(monthTransactions, 'receita')
  const pendingExpenses = getPendingAmount(monthTransactions, 'despesa')

  return {
    totalBalance,
    monthlyIncome: income,
    monthlyExpenses: expenses,
    projectedBalance: Number.isFinite(projected)
      ? projected
      : getProjectedBalance(totalBalance, pendingIncome, pendingExpenses),
    accountsCount: accounts.length,
    expensesByCategory,
    monthlyEvolution,
    recentTransactions: transactions.slice(0, 6),
  }
}