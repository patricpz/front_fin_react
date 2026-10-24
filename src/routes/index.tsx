import { Navigate, Route, Routes } from 'react-router-dom'

import { ROUTES } from '@/constants'
import { MainLayout } from '@/layouts/MainLayout'
import { AccountsPage } from '@/pages/accounts/AccountsPage'
import { LoginPage, ProtectedRoute } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'
import { CreateTransactionPage } from '@/pages/transactions/CreateTransactionPage'
import { EditTransactionPage } from '@/pages/transactions/EditTransactionPage'
import { TransactionsPage } from '@/pages/transactions/TransactionsPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.TRANSACTIONS} element={<TransactionsPage />} />
        <Route path={ROUTES.TRANSACTION_NEW} element={<CreateTransactionPage />} />
        <Route path="/transacoes/:id/editar" element={<EditTransactionPage />} />
        <Route path={ROUTES.ACCOUNTS} element={<AccountsPage />} />
        <Route
          path={ROUTES.CARDS}
          element={
            <PlaceholderPage
              title="Cartões"
              description="Controle limites, faturas e compras no cartão."
            />
          }
        />
        <Route
          path={ROUTES.CATEGORIES}
          element={
            <PlaceholderPage
              title="Categorias"
              description="Organize receitas e despesas por categorias."
            />
          }
        />
        <Route
          path={ROUTES.BUDGET}
          element={
            <PlaceholderPage
              title="Orçamento"
              description="Defina tetos de gastos para suas categorias no mês."
            />
          }
        />
        <Route
          path={ROUTES.GOALS}
          element={
            <PlaceholderPage
              title="Metas"
              description="Crie objetivos financeiros e acompanhe seu progresso."
            />
          }
        />
        <Route
          path={ROUTES.REPORTS}
          element={
            <PlaceholderPage
              title="Relatórios"
              description="Análises detalhadas de receitas, despesas e evolução patrimonial."
            />
          }
        />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  )
}
