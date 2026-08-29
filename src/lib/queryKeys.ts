export const queryKeys = {
  health: ['health'] as const,
  me: ['auth', 'me'] as const,
  accounts: ['accounts'] as const,
  account: (id: string) => ['accounts', id] as const,
  accountBalance: (id: string) => ['accounts', id, 'balance'] as const,
  categories: ['categories'] as const,
  categoryTree: ['categories', 'tree'] as const,
  transactions: (filters?: unknown) => ['transactions', filters] as const,
  transaction: (id: string) => ['transaction', id] as const,
  recurrences: ['recurrences'] as const,
  budgets: (filters?: unknown) => ['budgets', filters] as const,
  budgetProgress: (id: string) => ['budgets', id, 'progress'] as const,
  goals: ['goals'] as const,
  goalProgress: (id: string) => ['goals', id, 'progress'] as const,
  dashboard: ['dashboard', 'summary'] as const,
  reports: {
    monthly: (mes: number, ano: number) => ['reports', 'monthly', mes, ano] as const,
    category: (mes: number, ano: number) => ['reports', 'category', mes, ano] as const,
    evolution: (mes: number, ano: number, contaId?: string) =>
      ['reports', 'evolution', mes, ano, contaId] as const,
    budget: (mes: number, ano: number) => ['reports', 'budget', mes, ano] as const,
  },
}
