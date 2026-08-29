import { format, isSameMonth, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import type { Category, Transaction } from '@/types'

export function getMonthlyIncome(transactions: Transaction[]): number {
  return sumByType(transactions, 'receita')
}

export function getMonthlyExpenses(transactions: Transaction[]): number {
  return sumByType(transactions, 'despesa')
}

export function getProjectedBalance(
  totalBalance: number,
  pendingIncome: number,
  pendingExpenses: number,
): number {
  return totalBalance + pendingIncome - pendingExpenses
}

export function getExpensesByCategory(
  transactions: Transaction[],
  categories: Category[],
): Array<{ category: string; amount: number; color: string }> {
  const expenseMap = new Map<string, number>()

  transactions
    .filter((t) => t.type === 'despesa')
    .forEach((t) => {
      const key = t.categoryId ?? 'unknown'
      expenseMap.set(key, (expenseMap.get(key) ?? 0) + t.amount)
    })

  return categories
    .filter((c) => c.type === 'despesa' && expenseMap.has(c.id))
    .map((c) => ({
      category: c.name,
      amount: expenseMap.get(c.id) ?? 0,
      color: c.color,
    }))
    .sort((a, b) => b.amount - a.amount)
}

export function getMonthlyEvolution(transactions: Transaction[]) {
  const months = new Map<string, { receitas: number; despesas: number }>()

  transactions.forEach((t) => {
    const key = format(parseISO(t.date), 'MMM', { locale: ptBR })
    const current = months.get(key) ?? { receitas: 0, despesas: 0 }

    if (t.type === 'receita') {
      current.receitas += t.amount
    } else {
      current.despesas += t.amount
    }

    months.set(key, current)
  })

  return Array.from(months.entries()).map(([month, values]) => ({
    month: month.charAt(0).toUpperCase() + month.slice(1),
    ...values,
  }))
}

export function filterCurrentMonthTransactions(transactions: Transaction[]): Transaction[] {
  const now = new Date()

  return transactions.filter((t) => isSameMonth(parseISO(t.date), now))
}

function sumByType(transactions: Transaction[], type: Transaction['type']): number {
  return transactions
    .filter((t) => t.type === type && t.status === 'confirmado')
    .reduce((sum, t) => sum + t.amount, 0)
}

export function getPendingAmount(transactions: Transaction[], type: Transaction['type']): number {
  return transactions
    .filter((t) => t.type === type && t.status === 'pendente')
    .reduce((sum, t) => sum + t.amount, 0)
}