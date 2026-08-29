import axios from 'axios'

import { API_ORIGIN } from '@/lib/env'
import { unwrapList } from '@/lib/pick'
import type { TransactionFormValues } from '@/schemas/transactionSchema'
import { api } from '@/services/api'
import { endpoints } from '@/services/endpoints'
import {
  mapAccount,
  mapBudget,
  mapBudgetProgress,
  mapCategory,
  mapCategoryTree,
  mapCategorySpendingReport,
  mapGoal,
  mapGoalContribution,
  mapGoalProgress,
  mapMonthlySummary,
  mapRecurrence,
  mapTokens,
  mapTransaction,
  mapUser,
} from '@/services/mappers'
import { tokenStorage } from '@/services/tokenStorage'
import type {
  Account,
  AuthTokens,
  Budget,
  BudgetProgress,
  BudgetVsActualItem,
  Category,
  CategorySpendingReport,
  Goal,
  GoalContribution,
  GoalProgress,
  MonthlySummary,
  Recurrence,
  Transaction,
  TransactionFilters,
  User,
} from '@/types'

export interface CreateAccountPayload {
  name: string
  type: 'corrente' | 'poupanca' | 'carteira' | 'investimento' | 'cartao_credito'
  initialBalance?: string
  currency?: string
}

export interface UpdateAccountPayload {
  name?: string
  type?: 'corrente' | 'poupanca' | 'carteira' | 'investimento' | 'cartao_credito'
  initialBalance?: string
  currency?: string
  active?: boolean
}

export interface CreateCategoryPayload {
  name: string
  type: 'receita' | 'despesa'
  color?: string
  icon?: string
  parentId?: string | null
}

export interface UpdateCategoryPayload {
  name?: string
  type?: 'receita' | 'despesa'
  color?: string
  icon?: string
  parentId?: string | null
  active?: boolean
}

export interface CreateRecurrencePayload {
  accountId: string
  categoryId: string
  type: 'receita' | 'despesa'
  amount: string
  frequency: 'diaria' | 'semanal' | 'mensal' | 'anual'
  dayOfMonth?: number | null
  dayOfWeek?: number | null
  startDate: string
  endDate?: string | null
  description: string
}

export interface UpdateRecurrencePayload {
  accountId?: string
  categoryId?: string
  type?: 'receita' | 'despesa'
  amount?: string
  frequency?: 'diaria' | 'semanal' | 'mensal' | 'anual'
  dayOfMonth?: number | null
  dayOfWeek?: number | null
  startDate?: string
  endDate?: string | null
  description?: string
  active?: boolean
}

export interface CreateBudgetPayload {
  categoryId: string
  limitAmount: string
  month: number
  year: number
  alertPercentage?: number
}

export interface UpdateBudgetPayload {
  categoryId?: string
  limitAmount?: string
  month?: number
  year?: number
  alertPercentage?: number
}

export interface CreateGoalPayload {
  name: string
  description?: string | null
  targetAmount: string
  targetDate?: string | null
  category?: string
}

export interface UpdateGoalPayload {
  name?: string
  description?: string | null
  targetAmount?: string
  targetDate?: string | null
  category?: string
  status?: 'em_andamento' | 'concluida' | 'cancelada'
}

export interface CreateGoalContributionPayload {
  amount: string
  type: 'aporte' | 'retirada'
  date: string
  observation?: string | null
}

export interface GenerateRecurrencesResponse {
  generated: number
  message: string
}

export interface BudgetFilters {
  month?: number
  year?: number
}

export interface GoalFilters {
  status?: 'em_andamento' | 'concluida' | 'cancelada'
}

export async function login(email: string, password: string): Promise<AuthTokens> {
  const { data } = await api.post(endpoints.auth.login, {
    email,
    senha: password,
  })
  const tokens = mapTokens(data)
  tokenStorage.set(tokens.accessToken, tokens.refreshToken)
  return tokens
}

export async function register(payload: { name: string; email: string; password: string }): Promise<{ user: User }> {
  const { data } = await api.post(endpoints.auth.register, {
    nome: payload.name,
    email: payload.email,
    senha: payload.password,
  })
  return { user: mapUser(data) }
}

export async function fetchMe(): Promise<User> {
  const { data } = await api.get(endpoints.auth.me)
  return mapUser(data)
}

export async function logout(): Promise<void> {
  try {
    await api.post(endpoints.auth.logout)
  } finally {
    tokenStorage.clear()
  }
}

export async function refreshToken(): Promise<AuthTokens | null> {
  const refreshToken = tokenStorage.getRefresh()
  if (!refreshToken) return null

  try {
    const { data } = await axios.post(`${API_ORIGIN}${endpoints.auth.refresh}`, {
      refresh_token: refreshToken,
    })
    const tokens = mapTokens(data)
    tokenStorage.set(tokens.accessToken, tokens.refreshToken)
    return tokens
  } catch {
    tokenStorage.clear()
    return null
  }
}

export async function fetchHealth(): Promise<{ status: string }> {
  const { data } = await axios.get(`${API_ORIGIN}${endpoints.health}`)
  return data
}

export async function fetchAccounts(): Promise<Account[]> {
  const { data } = await api.get(endpoints.accounts.list)
  return unwrapList(data).map(mapAccount)
}

export async function fetchAccountById(id: string): Promise<Account> {
  const { data } = await api.get(endpoints.accounts.detail(id))
  return mapAccount(data)
}

export async function fetchAccountBalance(id: string): Promise<Account> {
  const { data } = await api.get(endpoints.accounts.balance(id))
  return mapAccount(data)
}

export async function createAccount(payload: CreateAccountPayload): Promise<Account> {
  const { data } = await api.post(endpoints.accounts.create, {
    nome: payload.name,
    tipo: payload.type,
    saldo_inicial: payload.initialBalance,
    moeda: payload.currency,
  })
  return mapAccount(data)
}

export async function updateAccount(id: string, payload: UpdateAccountPayload): Promise<Account> {
  const { data } = await api.patch(endpoints.accounts.update(id), {
    nome: payload.name,
    tipo: payload.type,
    saldo_inicial: payload.initialBalance,
    moeda: payload.currency,
    ativo: payload.active,
  })
  return mapAccount(data)
}

export async function deleteAccount(id: string): Promise<void> {
  await api.delete(endpoints.accounts.delete(id))
}

export async function fetchCategories(params?: { type?: 'receita' | 'despesa'; page?: number; size?: number }): Promise<Category[]> {
  const { data } = await api.get(endpoints.categories.list, { params })
  return unwrapList(data).map(mapCategory)
}

export async function fetchCategoryTree(type?: 'receita' | 'despesa'): Promise<Category[]> {
  const { data } = await api.get(endpoints.categories.tree, { params: { tipo: type } })
  return mapCategoryTree(data)
}

export async function fetchCategoryById(id: string): Promise<Category> {
  const { data } = await api.get(endpoints.categories.detail(id))
  return mapCategory(data)
}

export async function createCategory(payload: CreateCategoryPayload): Promise<Category> {
  const { data } = await api.post(endpoints.categories.create, {
    nome: payload.name,
    tipo: payload.type,
    cor: payload.color,
    icone: payload.icon,
    categoria_pai_id: payload.parentId,
  })
  return mapCategory(data)
}

export async function updateCategory(id: string, payload: UpdateCategoryPayload): Promise<Category> {
  const { data } = await api.patch(endpoints.categories.update(id), {
    nome: payload.name,
    tipo: payload.type,
    cor: payload.color,
    icone: payload.icon,
    categoria_pai_id: payload.parentId,
    ativo: payload.active,
  })
  return mapCategory(data)
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(endpoints.categories.delete(id))
}

function transactionQuery(filters: TransactionFilters = {}) {
  return {
    conta_id: filters.accountId,
    categoria_id: filters.categoryId,
    tipo: filters.type,
    status: filters.status,
    data_inicio: filters.startDate,
    data_fim: filters.endDate,
    descricao: filters.description,
    page: filters.page,
    size: filters.size,
  }
}

export function toTransactionPayload(data: TransactionFormValues & {
  destinationAccountId?: string
  idempotency_key?: string
}) {
  const payload: Record<string, unknown> = {
    conta_id: data.accountId,
    categoria_id: data.categoryId || null,
    tipo: data.type,
    valor: String(data.amount),
    data: data.date,
    descricao: data.description,
    status: data.status,
    observacoes: data.observacoes || null,
  }

  if (data.type === 'transferencia' && data.destinationAccountId) {
    payload.conta_destino_id = data.destinationAccountId
  }

  return payload
}

export function transactionToFormValues(transaction: Transaction): TransactionFormValues & { destinationAccountId?: string } {
  return {
    type: transaction.type === 'transferencia' ? 'despesa' : transaction.type,
    amount: transaction.amount,
    date: transaction.date,
    categoryId: transaction.categoryId || '',
    accountId: transaction.accountId,
    destinationAccountId: transaction.destinationAccountId || undefined,
    description: transaction.description,
    observacoes: transaction.observations || undefined,
    status: transaction.status,
  }
}

export async function fetchTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
  const { data } = await api.get(endpoints.transactions.list, { params: transactionQuery(filters) })
  return unwrapList(data).map(mapTransaction).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function fetchTransactionById(id: string): Promise<Transaction> {
  const { data } = await api.get(endpoints.transactions.detail(id))
  return mapTransaction(data)
}

export async function createTransaction(
  payload: TransactionFormValues & { destinationAccountId?: string; idempotency_key?: string },
  idempotencyKey?: string,
): Promise<Transaction> {
  const { data } = await api.post(endpoints.transactions.create, toTransactionPayload(payload), {
    headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined,
  })
  return mapTransaction(data)
}

export async function updateTransaction(
  id: string,
  payload: TransactionFormValues & { destinationAccountId?: string },
): Promise<Transaction> {
  const { data } = await api.patch(endpoints.transactions.update(id), toTransactionPayload(payload))
  return mapTransaction(data)
}

export async function deleteTransaction(id: string): Promise<void> {
  await api.delete(endpoints.transactions.delete(id))
}

export async function confirmTransaction(id: string): Promise<Transaction> {
  const { data } = await api.post(endpoints.transactions.confirm(id))
  return mapTransaction(data)
}

export async function fetchRecurrences(): Promise<Recurrence[]> {
  const { data } = await api.get(endpoints.recurrences.list)
  return unwrapList(data).map(mapRecurrence)
}

export async function fetchRecurrenceById(id: string): Promise<Recurrence> {
  const { data } = await api.get(endpoints.recurrences.detail(id))
  return mapRecurrence(data)
}

export async function createRecurrence(payload: CreateRecurrencePayload): Promise<Recurrence> {
  const { data } = await api.post(endpoints.recurrences.create, {
    conta_id: payload.accountId,
    categoria_id: payload.categoryId,
    tipo: payload.type,
    valor: payload.amount,
    frequencia: payload.frequency,
    dia_do_mes: payload.dayOfMonth,
    dia_semana: payload.dayOfWeek,
    data_inicio: payload.startDate,
    data_fim: payload.endDate,
    descricao: payload.description,
  })
  return mapRecurrence(data)
}

export async function updateRecurrence(id: string, payload: UpdateRecurrencePayload): Promise<Recurrence> {
  const { data } = await api.patch(endpoints.recurrences.update(id), {
    conta_id: payload.accountId,
    categoria_id: payload.categoryId,
    tipo: payload.type,
    valor: payload.amount,
    frequencia: payload.frequency,
    dia_do_mes: payload.dayOfMonth,
    dia_semana: payload.dayOfWeek,
    data_inicio: payload.startDate,
    data_fim: payload.endDate,
    descricao: payload.description,
    ativo: payload.active,
  })
  return mapRecurrence(data)
}

export async function deleteRecurrence(id: string): Promise<void> {
  await api.delete(endpoints.recurrences.delete(id))
}

export async function generateRecurrences(id?: string, dataLimite?: string): Promise<GenerateRecurrencesResponse> {
  const url = id ? endpoints.recurrences.generate(id) : endpoints.recurrences.generateAll
  const { data } = await api.post(url, undefined, { params: { data_limite: dataLimite } })
  return {
    generated: data.geradas ?? data.generated ?? 0,
    message: data.message ?? '',
  }
}

export async function fetchBudgets(filters?: BudgetFilters): Promise<Budget[]> {
  const { data } = await api.get(endpoints.budgets.list, {
    params: { mes: filters?.month, ano: filters?.year, month: filters?.month, year: filters?.year },
  })
  return unwrapList(data).map(mapBudget)
}

export async function fetchBudgetById(id: string): Promise<Budget> {
  const { data } = await api.get(endpoints.budgets.detail(id))
  return mapBudget(data)
}

export async function fetchBudgetProgress(id: string): Promise<BudgetProgress> {
  const { data } = await api.get(endpoints.budgets.progress(id))
  return mapBudgetProgress(data)
}

export async function createBudget(payload: CreateBudgetPayload): Promise<Budget> {
  const { data } = await api.post(endpoints.budgets.create, {
    categoria_id: payload.categoryId,
    valor_limite: payload.limitAmount,
    mes: payload.month,
    ano: payload.year,
    alerta_percentual: payload.alertPercentage,
  })
  return mapBudget(data)
}

export async function updateBudget(id: string, payload: UpdateBudgetPayload): Promise<Budget> {
  const { data } = await api.patch(endpoints.budgets.update(id), {
    categoria_id: payload.categoryId,
    valor_limite: payload.limitAmount,
    mes: payload.month,
    ano: payload.year,
    alerta_percentual: payload.alertPercentage,
  })
  return mapBudget(data)
}

export async function deleteBudget(id: string): Promise<void> {
  await api.delete(endpoints.budgets.delete(id))
}

export async function fetchGoals(filters?: GoalFilters): Promise<Goal[]> {
  const { data } = await api.get(endpoints.goals.list, { params: { status: filters?.status } })
  return unwrapList(data).map(mapGoal)
}

export async function fetchGoalById(id: string): Promise<Goal> {
  const { data } = await api.get(endpoints.goals.detail(id))
  return mapGoal(data)
}

export async function fetchGoalProgress(id: string): Promise<GoalProgress> {
  const { data } = await api.get(endpoints.goals.progress(id))
  return mapGoalProgress(data)
}

export async function createGoal(payload: CreateGoalPayload): Promise<Goal> {
  const { data } = await api.post(endpoints.goals.create, {
    nome: payload.name,
    descricao: payload.description,
    valor_alvo: payload.targetAmount,
    data_alvo: payload.targetDate,
    categoria: payload.category,
  })
  return mapGoal(data)
}

export async function updateGoal(id: string, payload: UpdateGoalPayload): Promise<Goal> {
  const { data } = await api.patch(endpoints.goals.update(id), {
    nome: payload.name,
    descricao: payload.description,
    valor_alvo: payload.targetAmount,
    data_alvo: payload.targetDate,
    categoria: payload.category,
    status: payload.status,
  })
  return mapGoal(data)
}

export async function deleteGoal(id: string): Promise<void> {
  await api.delete(endpoints.goals.delete(id))
}

export async function createGoalContribution(goalId: string, payload: CreateGoalContributionPayload): Promise<GoalContribution> {
  const { data } = await api.post(endpoints.goals.contributions(goalId), {
    valor: payload.amount,
    tipo: payload.type,
    data: payload.date,
    observacao: payload.observation,
  })
  return mapGoalContribution(data)
}

export async function fetchGoalContributions(goalId: string, page?: number, size?: number): Promise<GoalContribution[]> {
  const { data } = await api.get(endpoints.goals.contributions(goalId), { params: { page, size } })
  return unwrapList(data).map(mapGoalContribution)
}

export async function fetchMonthlySummary(month: number, year: number): Promise<MonthlySummary> {
  const { data } = await api.get(endpoints.reports.monthlySummary, { params: { mes: month, ano: year, month, year } })
  return mapMonthlySummary(data)
}

export async function fetchCategorySpending(month: number, year: number): Promise<CategorySpendingReport> {
  const { data } = await api.get(endpoints.reports.categorySpending, { params: { mes: month, ano: year, month, year } })
  return mapCategorySpendingReport(data)
}

export async function fetchBalanceEvolution(month: number, year: number, accountId?: string): Promise<MonthlySummary> {
  const { data } = await api.get(endpoints.reports.balanceEvolution, {
    params: { mes: month, ano: year, month, year, conta_id: accountId, account_id: accountId },
  })
  return mapMonthlySummary(data)
}

export async function fetchBudgetVsActual(month: number, year: number): Promise<BudgetVsActualItem[]> {
  const { data } = await api.get(endpoints.reports.budgetVsActual, { params: { mes: month, ano: year, month, year } })
  return unwrapList(data)
}