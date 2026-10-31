import { Navigate, Route, Routes } from 'react-router-dom'

import { ROUTES } from '@/constants'
import { MainLayout } from '@/layouts/MainLayout'
import { AccountsPage } from '@/pages/accounts/AccountsPage'
import { LoginPage, ProtectedRoute } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'
import { CreateTransactionPage } from '@/pages/transactions/CreateTransactionPage'
import { EditTransactionPage } from '@/pages/transactions/EditTransactionPage'
import { TransactionsPage } from '@/pages/transactions/TransactionsPage'
import { CardsPage } from '@/pages/cards/CardsPage'
import { CategoriesPage } from '@/pages/categories/CategoriesPage'
import { BudgetsPage } from '@/pages/budgets/BudgetsPage'
import { GoalsPage } from '@/pages/goals/GoalsPage'
import { ReportsPage } from '@/pages/reports/ReportsPage'
import { InstallmentsPage } from '@/pages/installments/InstallmentsPage'

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
        <Route path={ROUTES.CARDS} element={<CardsPage />} />
        <Route path={ROUTES.CATEGORIES} element={<CategoriesPage />} />
        <Route path={ROUTES.BUDGET} element={<BudgetsPage />} />
        <Route path={ROUTES.GOALS} element={<GoalsPage />} />
        <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
        <Route path={ROUTES.INSTALLMENTS} element={<InstallmentsPage />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  )
}
