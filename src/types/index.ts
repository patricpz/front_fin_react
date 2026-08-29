export type AccountType = 'corrente' | 'poupanca' | 'carteira' | 'investimento' | 'cartao_credito'
export type TransactionType = 'receita' | 'despesa' | 'transferencia'
export type TransactionStatus = 'pendente' | 'confirmado'
export type CategoryType = 'receita' | 'despesa'
export type RecurrenceFrequency = 'diaria' | 'semanal' | 'mensal' | 'anual'
export type GoalStatus = 'em_andamento' | 'concluida' | 'cancelada'
export type GoalContributionType = 'aporte' | 'retirada'

export interface User {
  id: string
  name: string
  email: string
  currency: string
  theme: 'light' | 'dark'
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  tokenType: string
}

export interface Account {
  id: string
  userId: string
  name: string
  type: AccountType
  initialBalance: number
  currency: string
  active: boolean
  balance: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  userId: string
  name: string
  type: TransactionType
  color: string
  icon: string
  parentId?: string | null
  children?: Category[]
}

export interface Transaction {
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

export interface Recurrence {
  id: string
  userId: string
  accountId: string
  categoryId: string
  type: TransactionType
  amount: number
  frequency: RecurrenceFrequency
  dayOfMonth: number | null
  dayOfWeek: number | null
  startDate: string
  endDate: string | null
  description: string
  nextExecution: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Budget {
  id: string
  userId: string
  categoryId: string
  limitAmount: number
  month: number
  year: number
  alertPercentage: number
  createdAt: string
  updatedAt: string
}

export interface BudgetProgress {
  budgetId: string
  categoryId: string
  categoryName: string
  limitAmount: number
  spent: number
  percentage: number
  alert: boolean
  month: number
  year: number
}

export interface Goal {
  id: string
  userId: string
  name: string
  description: string | null
  targetAmount: number
  targetDate: string | null
  category: string
  status: GoalStatus
  currentAmount: number
  progressPercentage: number
  createdAt: string
  updatedAt: string
}

export interface GoalProgress {
  goalId: string
  targetAmount: number
  currentAmount: number
  progressPercentage: number
  status: GoalStatus
}

export interface GoalContribution {
  id: string
  goalId: string
  amount: number
  type: GoalContributionType
  date: string
  observation: string | null
  createdAt: string
}

export interface MonthlySummary {
  month: number
  year: number
  totalIncome: number
  totalExpenses: number
  balance: number
  totalTransfersSent: number
  totalTransfersReceived: number
}

export interface CategorySpending {
  categoryId: string
  categoryName: string
  color: string
  icon: string
  amount: number
  percentage: number
  type: CategoryType
}

export interface CategorySpendingReport {
  month: number
  year: number
  totalExpenses: number
  categories: CategorySpending[]
}

export interface BalanceEvolutionPoint {
  date: string
  balance: number
}

export interface BalanceEvolution {
  accountId: string
  accountName: string
  points: BalanceEvolutionPoint[]
}

export interface BudgetVsActualItem {
  categoryId: string
  categoryName: string
  budgeted: number
  actual: number
  percentage: number
  alert: boolean
}

export interface BudgetVsActualReport {
  month: number
  year: number
  budgets: BudgetVsActualItem[]
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

export interface ApiError {
  detail: string
  code: string
}

export interface TransactionFilters {
  accountId?: string
  categoryId?: string
  type?: TransactionType
  status?: TransactionStatus
  startDate?: string
  endDate?: string
  description?: string
  page?: number
  size?: number
}

export interface BudgetFilters {
  month?: number
  year?: number
}

export interface GoalFilters {
  status?: GoalStatus
}