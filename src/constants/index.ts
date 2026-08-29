import type { Category } from '@/types'

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  TRANSACTIONS: '/transacoes',
  TRANSACTION_NEW: '/transacoes/nova',
  TRANSACTION_EDIT: (id: string) => `/transacoes/${id}/editar`,
  ACCOUNTS: '/contas',
  CARDS: '/cartoes',
  CATEGORIES: '/categorias',
  BUDGET: '/orcamento',
  GOALS: '/metas',
  REPORTS: '/relatorios',
  PROFILE: '/perfil',
} as const

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', userId: 'user-1', name: 'Alimentação', type: 'despesa', color: '#ef4444', icon: 'UtensilsCrossed' },
  { id: 'cat-2', userId: 'user-1', name: 'Transporte', type: 'despesa', color: '#f97316', icon: 'Car' },
  { id: 'cat-3', userId: 'user-1', name: 'Moradia', type: 'despesa', color: '#8b5cf6', icon: 'Home' },
  { id: 'cat-4', userId: 'user-1', name: 'Lazer', type: 'despesa', color: '#ec4899', icon: 'Gamepad2' },
  { id: 'cat-5', userId: 'user-1', name: 'Saúde', type: 'despesa', color: '#06b6d4', icon: 'HeartPulse' },
  { id: 'cat-6', userId: 'user-1', name: 'Educação', type: 'despesa', color: '#3b82f6', icon: 'GraduationCap' },
  { id: 'cat-7', userId: 'user-1', name: 'Salário', type: 'receita', color: '#22c55e', icon: 'Wallet' },
  { id: 'cat-8', userId: 'user-1', name: 'Freelance', type: 'receita', color: '#10b981', icon: 'Briefcase' },
]
