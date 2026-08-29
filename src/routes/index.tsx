import { Navigate, Route, Routes } from 'react-router-dom'

import { MainLayout } from '@/layouts/MainLayout'
import { LoginPage, ProtectedRoute } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { AccountsPage } from '@/pages/accounts/AccountsPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { TransactionsPage } from '@/pages/transactions/TransactionsPage'
import { CreateTransactionPage } from '@/pages/transactions/CreateTransactionPage'
import { EditTransactionPage } from '@/pages/transactions/EditTransactionPage'
import { ROUTES } from '@/constants'

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
        <Route
          path={ROUTES.ACCOUNTS}
          element={<AccountsPage />}
        />
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
          path={ROUTES.PROFILE}
          element={
            <PlaceholderPage
              title="Perfil"
              description="Preferências, senha e dados pessoais."
            />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  )
}
