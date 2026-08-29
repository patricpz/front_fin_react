import { DEFAULT_CATEGORIES } from '@/constants'
import type { TransactionFormValues } from '@/schemas/transactionSchema'
import type { Account, Transaction } from '@/types'
import {
  filterCurrentMonthTransactions,
  getExpensesByCategory,
  getMonthlyEvolution,
  getMonthlyIncome,
  getMonthlyExpenses,
  getPendingAmount,
  getProjectedBalance,
} from '@/utils/calculations'

interface MockDashboardSummary {
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  projectedBalance: number
  accountsCount: number
  expensesByCategory: Array<{ category: string; amount: number; color: string }>
  monthlyEvolution: Array<{ month: string; receitas: number; despesas: number }>
  recentTransactions: Transaction[]
}

const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc-1',
    userId: 'user-1',
    name: 'Conta Corrente',
    type: 'corrente',
    initialBalance: 4000,
    currency: 'BRL',
    active: true,
    balance: 4250.75,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-29T00:00:00Z',
  },
  {
    id: 'acc-2',
    userId: 'user-1',
    name: 'Carteira',
    type: 'carteira',
    initialBalance: 300,
    currency: 'BRL',
    active: true,
    balance: 320,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-29T00:00:00Z',
  },
  {
    id: 'acc-3',
    userId: 'user-1',
    name: 'Poupança',
    type: 'poupanca',
    initialBalance: 8000,
    currency: 'BRL',
    active: true,
    balance: 8500,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-29T00:00:00Z',
  },
]

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    userId: 'user-1',
    accountId: 'acc-1',
    destinationAccountId: null,
    categoryId: 'cat-7',
    type: 'receita',
    amount: 6500,
    date: '2026-07-05',
    description: 'Salário mensal',
    observations: null,
    status: 'confirmado',
    attachmentUrl: null,
    recurrenceId: null,
    createdAt: '2026-07-05T10:00:00',
    updatedAt: '2026-07-05T10:00:00',
  },
  {
    id: 'tx-2',
    userId: 'user-1',
    accountId: 'acc-1',
    destinationAccountId: null,
    categoryId: 'cat-1',
    type: 'despesa',
    amount: 450.9,
    date: '2026-07-02',
    description: 'Supermercado',
    observations: null,
    status: 'confirmado',
    attachmentUrl: null,
    recurrenceId: null,
    createdAt: '2026-07-02T14:30:00',
    updatedAt: '2026-07-02T14:30:00',
  },
  {
    id: 'tx-3',
    userId: 'user-1',
    accountId: 'acc-1',
    destinationAccountId: null,
    categoryId: 'cat-2',
    type: 'despesa',
    amount: 89.5,
    date: '2026-07-03',
    description: 'Uber / transporte',
    observations: null,
    status: 'confirmado',
    attachmentUrl: null,
    recurrenceId: null,
    createdAt: '2026-07-03T09:15:00',
    updatedAt: '2026-07-03T09:15:00',
  },
  {
    id: 'tx-4',
    userId: 'user-1',
    accountId: 'acc-2',
    destinationAccountId: null,
    categoryId: 'cat-4',
    type: 'despesa',
    amount: 120,
    date: '2026-07-01',
    description: 'Cinema e lanche',
    observations: null,
    status: 'confirmado',
    attachmentUrl: null,
    recurrenceId: null,
    createdAt: '2026-07-01T20:00:00',
    updatedAt: '2026-07-01T20:00:00',
  },
  {
    id: 'tx-5',
    userId: 'user-1',
    accountId: 'acc-1',
    destinationAccountId: null,
    categoryId: 'cat-3',
    type: 'despesa',
    amount: 1800,
    date: '2026-07-10',
    description: 'Aluguel',
    observations: null,
    status: 'pendente',
    attachmentUrl: null,
    recurrenceId: null,
    createdAt: '2026-07-10T08:00:00',
    updatedAt: '2026-07-10T08:00:00',
  },
  {
    id: 'tx-6',
    userId: 'user-1',
    accountId: 'acc-1',
    destinationAccountId: null,
    categoryId: 'cat-5',
    type: 'despesa',
    amount: 250,
    date: '2026-07-08',
    description: 'Plano de saúde',
    observations: null,
    status: 'confirmado',
    attachmentUrl: null,
    recurrenceId: null,
    createdAt: '2026-07-08T11:00:00',
    updatedAt: '2026-07-08T11:00:00',
  },
  {
    id: 'tx-7',
    userId: 'user-1',
    accountId: 'acc-1',
    destinationAccountId: null,
    categoryId: 'cat-8',
    type: 'receita',
    amount: 1200,
    date: '2026-07-12',
    description: 'Projeto freelance',
    observations: null,
    status: 'pendente',
    attachmentUrl: null,
    recurrenceId: null,
    createdAt: '2026-07-12T15:00:00',
    updatedAt: '2026-07-12T15:00:00',
  },
  {
    id: 'tx-8',
    userId: 'user-1',
    accountId: 'acc-1',
    destinationAccountId: null,
    categoryId: 'cat-6',
    type: 'despesa',
    amount: 199.9,
    date: '2026-06-28',
    description: 'Curso online',
    observations: null,
    status: 'confirmado',
    attachmentUrl: null,
    recurrenceId: null,
    createdAt: '2026-06-28T10:00:00',
    updatedAt: '2026-06-28T10:00:00',
  },
  {
    id: 'tx-9',
    userId: 'user-1',
    accountId: 'acc-1',
    destinationAccountId: null,
    categoryId: 'cat-1',
    type: 'despesa',
    amount: 380,
    date: '2026-06-15',
    description: 'Restaurantes',
    observations: null,
    status: 'confirmado',
    attachmentUrl: null,
    recurrenceId: null,
    createdAt: '2026-06-15T19:00:00',
    updatedAt: '2026-06-15T19:00:00',
  },
  {
    id: 'tx-10',
    userId: 'user-1',
    accountId: 'acc-1',
    destinationAccountId: null,
    categoryId: 'cat-7',
    type: 'receita',
    amount: 6500,
    date: '2026-06-05',
    description: 'Salário mensal',
    observations: null,
    status: 'confirmado',
    attachmentUrl: null,
    recurrenceId: null,
    createdAt: '2026-06-05T10:00:00',
    updatedAt: '2026-06-05T10:00:00',
  },
]

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getBalanceDelta(
  transaction: Pick<Transaction, 'type' | 'amount' | 'status'>,
): number {
  if (transaction.status !== 'confirmado') return 0
  return transaction.type === 'receita' ? transaction.amount : -transaction.amount
}

function applyBalanceChange(accountId: string, delta: number) {
  const account = MOCK_ACCOUNTS.find((item) => item.id === accountId)
  if (account) {
    account.balance += delta
  }
}

export async function fetchTransactions(_filters?: unknown): Promise<Transaction[]> {
  await delay()
  return [...MOCK_TRANSACTIONS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

export async function fetchTransactionById(id: string): Promise<Transaction> {
  await delay(200)
  const transaction = MOCK_TRANSACTIONS.find((item) => item.id === id)

  if (!transaction) {
    throw new Error('Transação não encontrada')
  }

  return { ...transaction }
}

export async function fetchDashboardSummary(): Promise<MockDashboardSummary> {
  await delay()
  const transactions = MOCK_TRANSACTIONS
  const monthTransactions = filterCurrentMonthTransactions(transactions)
  const totalBalance = MOCK_ACCOUNTS.reduce((sum, acc) => sum + acc.balance, 0)
  const pendingIncome = getPendingAmount(monthTransactions, 'receita')
  const pendingExpenses = getPendingAmount(monthTransactions, 'despesa')

  return {
    totalBalance,
    monthlyIncome: getMonthlyIncome(monthTransactions),
    monthlyExpenses: getMonthlyExpenses(monthTransactions),
    projectedBalance: getProjectedBalance(totalBalance, pendingIncome, pendingExpenses),
    accountsCount: MOCK_ACCOUNTS.length,
    expensesByCategory: getExpensesByCategory(monthTransactions, DEFAULT_CATEGORIES),
    monthlyEvolution: getMonthlyEvolution(transactions),
    recentTransactions: [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6),
  }
}

export async function fetchCategories() {
  await delay()
  return DEFAULT_CATEGORIES
}

export async function fetchAccounts(): Promise<Account[]> {
  await delay()
  return [...MOCK_ACCOUNTS]
}

export async function createTransaction(
  data: TransactionFormValues,
  _idempotencyKey?: string,
): Promise<Transaction> {
  await delay(300)

  const transaction: Transaction = {
    id: `tx-${Date.now()}`,
    userId: 'user-1',
    accountId: data.accountId,
    destinationAccountId: data.destinationAccountId ?? null,
    categoryId: data.categoryId ?? null,
    type: data.type,
    amount: data.amount,
    date: data.date,
    description: data.description,
    observations: data.observacoes ?? null,
    status: data.status,
    attachmentUrl: null,
    recurrenceId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  MOCK_TRANSACTIONS.unshift(transaction)
  applyBalanceChange(data.accountId, getBalanceDelta(transaction))

  return transaction
}

export async function updateTransaction(
  id: string,
  data: TransactionFormValues,
): Promise<Transaction> {
  await delay(300)

  const index = MOCK_TRANSACTIONS.findIndex((item) => item.id === id)

  if (index === -1) {
    throw new Error('Transação não encontrada')
  }

  const current = MOCK_TRANSACTIONS[index]
  applyBalanceChange(current.accountId, -getBalanceDelta(current))

  const updated: Transaction = {
    ...current,
    accountId: data.accountId,
    destinationAccountId: data.destinationAccountId ?? null,
    categoryId: data.categoryId ?? null,
    type: data.type,
    amount: data.amount,
    date: data.date,
    description: data.description,
    observations: data.observacoes ?? null,
    status: data.status,
    updatedAt: new Date().toISOString(),
  }

  MOCK_TRANSACTIONS[index] = updated
  applyBalanceChange(updated.accountId, getBalanceDelta(updated))

  return { ...updated }
}

export async function deleteTransaction(id: string): Promise<void> {
  await delay(300)

  const index = MOCK_TRANSACTIONS.findIndex((item) => item.id === id)

  if (index === -1) {
    throw new Error('Transação não encontrada')
  }

  const transaction = MOCK_TRANSACTIONS[index]
  applyBalanceChange(transaction.accountId, -getBalanceDelta(transaction))
  MOCK_TRANSACTIONS.splice(index, 1)
}

export function transactionToFormValues(transaction: Transaction): TransactionFormValues {
  return {
    type: transaction.type === 'transferencia' ? 'despesa' : transaction.type,
    amount: transaction.amount,
    date: transaction.date,
    categoryId: transaction.categoryId ?? '',
    accountId: transaction.accountId,
    destinationAccountId: transaction.destinationAccountId ?? undefined,
    description: transaction.description,
    observacoes: transaction.observations ?? undefined,
    status: transaction.status,
  }
}