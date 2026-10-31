import { isRecord, pick, toNumber } from '@/lib/pick'
import type {
  Account,
  AccountType,
  AuthTokens,
  Budget,
  BudgetProgress,
  Category,
  CategorySpending,
  CategorySpendingReport,
  CategoryType,
  BalanceEvolution,
  BalanceEvolutionPoint,
  BudgetVsActualItem,
  BudgetVsActualReport,
  Goal,
  GoalContribution,
  GoalContributionType,
  GoalProgress,
  GoalStatus,
  Installment,
  MonthlySummary,
  NotificationItem,
  NotificationPage,
  NotificationPreferences,
  NotificationType,
  NotificationStatus,
  Recurrence,
  RecurrenceFrequency,
  Transaction,
  TransactionStatus,
  TransactionType,
  User,
} from '@/types'

function asRecord(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {}
}

export function mapUser(raw: unknown): User {
  const data = asRecord(raw)
  const themeValue = String(pick<string>(data, ['theme', 'tema'], 'light'))
  return {
    id: String(pick(data, ['id'], '')),
    name: String(pick(data, ['name', 'nome'], '')),
    email: String(pick(data, ['email'], '')),
    currency: String(pick(data, ['currency', 'moeda'], 'BRL')),
    theme: themeValue === 'dark' ? 'dark' : 'light',
  }
}

export function mapTokens(raw: unknown): AuthTokens {
  const data = asRecord(raw)
  return {
    accessToken: String(pick(data, ['access_token', 'accessToken'], '')),
    refreshToken: String(pick(data, ['refresh_token', 'refreshToken'], '')),
    tokenType: String(pick(data, ['token_type', 'tokenType'], 'bearer')),
  }
}

export function mapAccount(raw: unknown): Account {
  const data = asRecord(raw)
  const type = String(pick(data, ['type', 'tipo'], 'corrente')) as AccountType
  return {
    id: String(pick(data, ['id'], '')),
    userId: String(pick(data, ['user_id', 'userId', 'usuario_id'], '')),
    name: String(pick(data, ['name', 'nome'], '')),
    type,
    initialBalance: toNumber(pick(data, ['initial_balance', 'initialBalance', 'saldo_inicial', 'saldoInicial'], 0)),
    currency: String(pick(data, ['currency', 'moeda'], 'BRL')),
    active: Boolean(pick(data, ['active', 'ativo'], true)),
    balance: toNumber(pick(data, ['balance', 'saldo', 'saldo_atual', 'saldoAtual', 'current_balance', 'currentBalance'], 0)),
    createdAt: String(pick(data, ['created_at', 'createdAt', 'criado_em', 'criadoEm'], '')),
    updatedAt: String(pick(data, ['updated_at', 'updatedAt', 'atualizado_em', 'atualizadoEm'], '')),
  }
}

export function mapCategory(raw: unknown): Category {
  const data = asRecord(raw)
  const type = String(pick(data, ['type', 'tipo'], 'despesa')) as TransactionType
  return {
    id: String(pick(data, ['id'], '')),
    userId: String(pick(data, ['user_id', 'userId', 'usuario_id'], '')),
    name: String(pick(data, ['name', 'nome'], '')),
    type,
    color: String(pick(data, ['color', 'cor'], '#64748b')),
    icon: String(pick(data, ['icon', 'icone'], 'Wallet')),
    parentId: pick(data, ['parent_id', 'parentId', 'categoria_pai_id', 'categoriaPaiId'], null) as string | null,
  }
}

export function mapCategoryTree(raw: unknown): Category[] {
  const data = asRecord(raw)
  if (Array.isArray(data)) {
    return data.map(mapCategoryTreeItem)
  }
  return []
}

function mapCategoryTreeItem(raw: unknown): Category {
  const data = asRecord(raw)
  const childrenRaw = pick(data, ['children', 'filhos'], [])
  return {
    ...mapCategory(data),
    parentId: pick(data, ['parent_id', 'parentId', 'categoria_pai_id', 'categoriaPaiId'], null) as string | null,
    children: Array.isArray(childrenRaw) ? childrenRaw.map(mapCategoryTreeItem) : undefined,
  }
}

export function mapTransaction(raw: unknown): Transaction {
  const data = asRecord(raw)
  const tipo = String(pick(data, ['type', 'tipo'], 'despesa')) as TransactionType
  return {
    id: String(pick(data, ['id'], '')),
    userId: String(pick(data, ['user_id', 'userId', 'usuario_id'], '')),
    accountId: String(pick(data, ['account_id', 'accountId', 'conta_id', 'contaId'], '')),
    destinationAccountId: pick(data, ['destination_account_id', 'destinationAccountId', 'conta_destino_id', 'contaDestinoId'], null) as string | null,
    categoryId: pick(data, ['category_id', 'categoryId', 'categoria_id', 'categoriaId'], null) as string | null,
    type: tipo,
    amount: toNumber(pick(data, ['amount', 'valor'], 0)),
    date: String(pick(data, ['date', 'data'], '')),
    description: String(pick(data, ['description', 'descricao'], '')),
    observations: pick(data, ['observations', 'observacoes', 'notes'], null) as string | null,
    status: String(pick(data, ['status'], 'confirmado')) as TransactionStatus,
    attachmentUrl: pick(data, ['attachment_url', 'attachmentUrl', 'anexo_url', 'anexoUrl'], null) as string | null,
    recurrenceId: pick(data, ['recurrence_id', 'recurrenceId', 'recorrencia_id', 'recorrenciaId'], null) as string | null,
    createdAt: String(pick(data, ['created_at', 'createdAt', 'criado_em', 'criadoEm'], '')),
    updatedAt: String(pick(data, ['updated_at', 'updatedAt', 'atualizado_em', 'atualizadoEm'], '')),
  }
}

export function mapRecurrence(raw: unknown): Recurrence {
  const data = asRecord(raw)
  return {
    id: String(pick(data, ['id'], '')),
    userId: String(pick(data, ['user_id', 'userId', 'usuario_id'], '')),
    accountId: String(pick(data, ['account_id', 'accountId', 'conta_id', 'contaId'], '')),
    categoryId: String(pick(data, ['category_id', 'categoryId', 'categoria_id', 'categoriaId'], '')),
    type: String(pick(data, ['type', 'tipo'], 'despesa')) as TransactionType,
    amount: toNumber(pick(data, ['amount', 'valor'], 0)),
    frequency: String(pick(data, ['frequency', 'frequencia'], 'mensal')) as RecurrenceFrequency,
    dayOfMonth: pick(data, ['day_of_month', 'dayOfMonth', 'dia_do_mes', 'diaDoMes'], null) as number | null,
    dayOfWeek: pick(data, ['day_of_week', 'dayOfWeek', 'dia_semana', 'diaSemana'], null) as number | null,
    startDate: String(pick(data, ['start_date', 'startDate', 'data_inicio', 'dataInicio'], '')),
    endDate: pick(data, ['end_date', 'endDate', 'data_fim', 'dataFim'], null) as string | null,
    description: String(pick(data, ['description', 'descricao'], '')),
    nextExecution: pick(data, ['next_execution', 'nextExecution', 'proxima_execucao', 'proximaExecucao'], null) as string | null,
    active: Boolean(pick(data, ['active', 'ativa'], true)),
    createdAt: String(pick(data, ['created_at', 'createdAt', 'criado_em', 'criadoEm'], '')),
    updatedAt: String(pick(data, ['updated_at', 'updatedAt', 'atualizado_em', 'atualizadoEm'], '')),
  }
}

export function mapBudget(raw: unknown): Budget {
  const data = asRecord(raw)
  return {
    id: String(pick(data, ['id'], '')),
    userId: String(pick(data, ['user_id', 'userId', 'usuario_id'], '')),
    categoryId: String(pick(data, ['category_id', 'categoryId', 'categoria_id', 'categoriaId'], '')),
    limitAmount: toNumber(pick(data, ['limit_amount', 'limitAmount', 'limite', 'valor_limite', 'valorLimite'], 0)),
    month: toNumber(pick(data, ['month', 'mes'], 0)),
    year: toNumber(pick(data, ['year', 'ano'], 0)),
    alertPercentage: toNumber(pick(data, ['alert_percentage', 'alertPercentage', 'alerta_percentual', 'alertaPercentual'], 80)),
    createdAt: String(pick(data, ['created_at', 'createdAt', 'criado_em', 'criadoEm'], '')),
    updatedAt: String(pick(data, ['updated_at', 'updatedAt', 'atualizado_em', 'atualizadoEm'], '')),
  }
}

export function mapBudgetProgress(raw: unknown): BudgetProgress {
  const data = asRecord(raw)
  return {
    budgetId: String(pick(data, ['budget_id', 'budgetId', 'orcamento_id', 'id'], '')),
    categoryId: String(pick(data, ['category_id', 'categoryId', 'categoria_id', 'categoriaId'], '')),
    categoryName: String(pick(data, ['category_name', 'categoryName', 'categoria_nome', 'categoriaNome', 'nome'], '')),
    limitAmount: toNumber(pick(data, ['limit_amount', 'limitAmount', 'limite', 'orcado'], 0)),
    spent: toNumber(pick(data, ['spent', 'gasto', 'realizado'], 0)),
    percentage: toNumber(pick(data, ['percentage', 'percentual'], 0)),
    alert: Boolean(pick(data, ['alert', 'alerta'], false)),
    month: toNumber(pick(data, ['month', 'mes'], 0)),
    year: toNumber(pick(data, ['year', 'ano'], 0)),
  }
}

export function mapGoal(raw: unknown): Goal {
  const data = asRecord(raw)
  return {
    id: String(pick(data, ['id'], '')),
    userId: String(pick(data, ['user_id', 'userId', 'usuario_id'], '')),
    name: String(pick(data, ['name', 'nome', 'title', 'titulo'], '')),
    description: pick(data, ['description', 'descricao'], null) as string | null,
    targetAmount: toNumber(pick(data, ['target_amount', 'targetAmount', 'valor_alvo', 'valorAlvo', 'valorObjetivo'], 0)),
    targetDate: pick(data, ['target_date', 'targetDate', 'data_alvo', 'dataAlvo', 'prazo'], null) as string | null,
    category: String(pick(data, ['category', 'categoria'], '')),
    status: String(pick(data, ['status'], 'em_andamento')) as GoalStatus,
    currentAmount: toNumber(pick(data, ['current_amount', 'currentAmount', 'valor_atual', 'valorAtual'], 0)),
    progressPercentage: toNumber(pick(data, ['progress_percentage', 'progressPercentage', 'progresso_percentual', 'progressoPercentual', 'percentage', 'percentual'], 0)),
    createdAt: String(pick(data, ['created_at', 'createdAt', 'criado_em', 'criadoEm'], '')),
    updatedAt: String(pick(data, ['updated_at', 'updatedAt', 'atualizado_em', 'atualizadoEm'], '')),
  }
}

export function mapGoalProgress(raw: unknown): GoalProgress {
  const data = asRecord(raw)
  return {
    goalId: String(pick(data, ['goal_id', 'goalId', 'meta_id', 'id'], '')),
    targetAmount: toNumber(pick(data, ['target_amount', 'targetAmount', 'valor_alvo', 'valorAlvo'], 0)),
    currentAmount: toNumber(pick(data, ['current_amount', 'currentAmount', 'valor_atual', 'valorAtual'], 0)),
    progressPercentage: toNumber(pick(data, ['progress_percentage', 'progressPercentage', 'progresso_percentual', 'progressoPercentual', 'percentage', 'percentual'], 0)),
    status: String(pick(data, ['status'], 'em_andamento')) as GoalStatus,
  }
}

export function mapGoalContribution(raw: unknown): GoalContribution {
  const data = asRecord(raw)
  return {
    id: String(pick(data, ['id'], '')),
    goalId: String(pick(data, ['goal_id', 'goalId', 'meta_id'], '')),
    amount: toNumber(pick(data, ['amount', 'valor'], 0)),
    type: String(pick(data, ['type', 'tipo'], 'aporte')) as GoalContributionType,
    date: String(pick(data, ['date', 'data'], '')),
    observation: pick(data, ['observation', 'observacao', 'notes'], null) as string | null,
    createdAt: String(pick(data, ['created_at', 'createdAt', 'criado_em', 'criadoEm'], '')),
  }
}

export function mapMonthlySummary(raw: unknown): MonthlySummary {
  const data = asRecord(raw)
  return {
    month: toNumber(pick(data, ['month', 'mes'], 0)),
    year: toNumber(pick(data, ['year', 'ano'], 0)),
    totalIncome: toNumber(pick(data, ['total_income', 'totalIncome', 'total_receitas', 'totalReceitas', 'receitas'], 0)),
    totalExpenses: toNumber(pick(data, ['total_expenses', 'totalExpenses', 'total_despesas', 'totalDespesas', 'despesas'], 0)),
    balance: toNumber(pick(data, ['balance', 'saldo'], 0)),
    totalTransfersSent: toNumber(pick(data, ['total_transfers_sent', 'totalTransfersSent', 'total_transferencias_enviadas', 'totalTransferenciasEnviadas', 'transfers_sent'], 0)),
    totalTransfersReceived: toNumber(pick(data, ['total_transfers_received', 'totalTransfersReceived', 'total_transferencias_recebidas', 'totalTransferenciasRecebidas', 'transfers_received'], 0)),
  }
}

export function mapCategorySpending(raw: unknown): CategorySpending {
  const data = asRecord(raw)
  return {
    categoryId: String(pick(data, ['category_id', 'categoryId', 'categoria_id', 'categoriaId'], '')),
    categoryName: String(pick(data, ['category_name', 'categoryName', 'categoria_nome', 'categoriaNome', 'nome'], '')),
    color: String(pick(data, ['color', 'cor'], '#6366F1')),
    icon: String(pick(data, ['icon', 'icone'], 'tag')),
    amount: toNumber(pick(data, ['amount', 'valor'], 0)),
    percentage: toNumber(pick(data, ['percentage', 'percentual'], 0)),
    type: String(pick(data, ['type', 'tipo'], 'despesa')) as CategoryType,
  }
}

export function mapCategorySpendingReport(raw: unknown): CategorySpendingReport {
  const data = asRecord(raw)
  const categoriasRaw = pick(data, ['categories', 'categorias'], [])
  return {
    month: toNumber(pick(data, ['month', 'mes'], 0)),
    year: toNumber(pick(data, ['year', 'ano'], 0)),
    totalExpenses: toNumber(pick(data, ['total_expenses', 'totalExpenses', 'total_despesas', 'totalDespesas'], 0)),
    categories: Array.isArray(categoriasRaw) ? categoriasRaw.map(mapCategorySpending) : [],
  }
}

export function mapBalanceEvolution(raw: unknown): BalanceEvolution {
  const data = asRecord(raw)
  const pontosRaw = pick(data, ['points', 'pontos'], [])
  return {
    accountId: String(pick(data, ['account_id', 'accountId', 'conta_id', 'contaId'], '')),
    accountName: String(pick(data, ['account_name', 'accountName', 'conta_nome', 'contaNome'], '')),
    points: Array.isArray(pontosRaw) ? pontosRaw.map(mapBalanceEvolutionPoint) : [],
  }
}

function mapBalanceEvolutionPoint(raw: unknown): BalanceEvolutionPoint {
  const data = asRecord(raw)
  return {
    date: String(pick(data, ['date', 'data'], '')),
    balance: toNumber(pick(data, ['balance', 'saldo'], 0)),
  }
}

export function mapBudgetVsActual(raw: unknown): BudgetVsActualReport {
  const data = asRecord(raw)
  const orcamentosRaw = pick(data, ['budgets', 'orcamentos'], [])
  return {
    month: toNumber(pick(data, ['month', 'mes'], 0)),
    year: toNumber(pick(data, ['year', 'ano'], 0)),
    budgets: Array.isArray(orcamentosRaw) ? orcamentosRaw.map(mapBudgetVsActualItem) : [],
  }
}

function mapBudgetVsActualItem(raw: unknown): BudgetVsActualItem {
  const data = asRecord(raw)
  return {
    categoryId: String(pick(data, ['category_id', 'categoryId', 'categoria_id', 'categoriaId'], '')),
    categoryName: String(pick(data, ['category_name', 'categoryName', 'categoria_nome', 'categoriaNome', 'nome'], '')),
    budgeted: toNumber(pick(data, ['budgeted', 'orcado', 'limit_amount', 'limitAmount'], 0)),
    actual: toNumber(pick(data, ['actual', 'realizado', 'spent', 'gasto'], 0)),
    percentage: toNumber(pick(data, ['percentage', 'percentual'], 0)),
    alert: Boolean(pick(data, ['alert', 'alerta'], false)),
  }
}

export function unwrapList<T>(data: unknown): T[] {
  const record = asRecord(data)
  if (Array.isArray(record.items)) {
    return record.items as T[]
  }
  if (Array.isArray(data)) {
    return data as T[]
  }
  return []
}

// Notificações

export function mapNotification(raw: unknown): NotificationItem {
  const data = asRecord(raw)
  return {
    id: String(pick(data, ['id'], '')),
    type: String(pick(data, ['type', 'tipo'], 'tip')) as NotificationType,
    title: String(pick(data, ['title', 'titulo'], '')),
    body: String(pick(data, ['body', 'mensagem', 'descricao'], '')),
    status: String(pick(data, ['status', 'estado'], 'unread')) as NotificationStatus,
    created_at: String(pick(data, ['created_at', 'createdAt', 'criado_em', 'criadoEm', 'data'], '')),
    payload: isRecord(pick(data, ['payload', 'dados', 'metadata'], {}))
      ? pick(data, ['payload', 'dados', 'metadata'], {})
      : {},
  }
}

export function mapNotificationPage(raw: unknown): NotificationPage {
  const data = asRecord(raw)
  const itemsRaw = pick(data, ['items', 'data', 'resultados', 'results'], [])
  return {
    items: Array.isArray(itemsRaw) ? itemsRaw.map(mapNotification) : [],
    next_cursor: pick(data, ['next_cursor', 'nextCursor', 'proximo_cursor'], null) as string | null,
    unread_count: toNumber(pick(data, ['unread_count', 'unreadCount', 'nao_lidas'], 0)),
  }
}

export function mapNotificationPreferences(raw: unknown): NotificationPreferences {
  const data = asRecord(raw)
  const rawEnabled = pick(data, ['enabled_types', 'enabledTypes', 'tipos_ativos'], [])
  return {
    enabled_types: Array.isArray(rawEnabled) ? rawEnabled.map(String) as NotificationType[] : [] as NotificationType[],
    channel_in_app: Boolean(pick(data, ['channel_in_app', 'channelInApp', 'canal_in_app'], true)),
    channel_push: Boolean(pick(data, ['channel_push', 'channelPush', 'canal_push'], true)),
    sensitivity: String(pick(data, ['sensitivity', 'sensibilidade'], 'medium')) as 'low' | 'medium' | 'high',
    quiet_hours_start: pick(data, ['quiet_hours_start', 'quietHoursStart', 'horario_silencio_inicio'], null) as string | null,
    quiet_hours_end: pick(data, ['quiet_hours_end', 'quietHoursEnd', 'horario_silencio_fim'], null) as string | null,
    timezone: String(pick(data, ['timezone', 'fuso_horario', 'fusoHorario'], Intl.DateTimeFormat().resolvedOptions().timeZone)),
    daily_limit: toNumber(pick(data, ['daily_limit', 'dailyLimit', 'limite_diario', 'limiteDiario'], 10)),
  }
}

// Installments / Parcelas

export function mapInstallment(raw: unknown): Installment {
  const data = asRecord(raw)
  return {
    id: String(pick(data, ['id'], '')),
    description: String(pick(data, ['description', 'descricao', 'nome'], '')),
    category: pick(data, ['category', 'categoria', 'categoria_nome', 'categoryName'], null) as string | null,
    total_amount: pick(data, ['total_amount', 'totalAmount', 'valor_total', 'valorTotal'], 0),
    installment_count: toNumber(pick(data, ['installment_count', 'installmentCount', 'total_parcelas', 'totalParcelas', 'numero_parcelas'], 0)),
    installment_amount: pick(data, ['installment_amount', 'installmentAmount', 'valor_parcela', 'valorParcela'], 0),
    paid_installments: toNumber(pick(data, ['paid_installments', 'paidInstallments', 'parcelas_pagas', 'parcelasPagas'], 0)),
    remaining_installments: toNumber(pick(data, ['remaining_installments', 'remainingInstallments', 'parcelas_restantes', 'parcelasRestantes'], 0)),
    progress_percent: toNumber(pick(data, ['progress_percent', 'progressPercent', 'percentual_progresso', 'percentualProgresso'], 0)),
    paid_amount: pick(data, ['paid_amount', 'paidAmount', 'valor_pago', 'valorPago'], 0),
    remaining_amount: pick(data, ['remaining_amount', 'remainingAmount', 'valor_restante', 'valorRestante'], 0),
    next_due_date: pick(data, ['next_due_date', 'nextDueDate', 'proxima_parcela_data', 'proximaParcelaData', 'proxima_data_vencimento'], null) as string | null,
    is_completed: Boolean(pick(data, ['is_completed', 'isCompleted', 'concluida', 'concluido'], false)),
  }
}

export function mapInstallments(raw: unknown): Installment[] {
  return unwrapList(raw).map(mapInstallment)
}