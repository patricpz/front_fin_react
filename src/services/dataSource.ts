import { USE_MOCK } from '@/lib/env'
import * as mock from '@/services/mockData'
import * as api from '@/services/financeApi'
import * as dashboardApi from '@/services/dashboardApi'

export const dataSource = USE_MOCK
  ? {
      fetchAccounts: mock.fetchAccounts,
      fetchTransactions: mock.fetchTransactions,
      fetchTransactionById: mock.fetchTransactionById,
      createTransaction: mock.createTransaction,
      updateTransaction: mock.updateTransaction,
      deleteTransaction: mock.deleteTransaction,
      fetchDashboardSummary: mock.fetchDashboardSummary,
      transactionToFormValues: mock.transactionToFormValues,
      fetchCategories: mock.fetchCategories,
    }
  : {
      fetchAccounts: api.fetchAccounts,
      fetchTransactions: api.fetchTransactions,
      fetchTransactionById: api.fetchTransactionById,
      createTransaction: api.createTransaction,
      updateTransaction: api.updateTransaction,
      deleteTransaction: api.deleteTransaction,
      fetchDashboardSummary: dashboardApi.fetchDashboardSummary,
      transactionToFormValues: api.transactionToFormValues,
      fetchCategories: api.fetchCategories,
    }
