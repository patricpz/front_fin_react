import { ArrowLeft, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { TransactionForm } from '@/components/forms/TransactionForm'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/progress'
import { ROUTES } from '@/constants'
import { useDeleteTransaction } from '@/hooks/useDeleteTransaction'
import { useTransaction } from '@/hooks/useTransactions'
import { useUpdateTransaction } from '@/hooks/useTransactions'
import type { TransactionFormValues } from '@/schemas/transactionSchema'
import { transactionToFormValues } from '@/hooks/useTransactions'

export function EditTransactionPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { data: transaction, isLoading, isError } = useTransaction(id)
  const updateTransaction = useUpdateTransaction()
  const deleteTransaction = useDeleteTransaction()

  async function handleSubmit(data: TransactionFormValues) {
    if (!id) return
    await updateTransaction.mutateAsync({ id, payload: data })
    navigate(ROUTES.TRANSACTIONS)
  }

  async function handleDelete() {
    if (!id) return
    await deleteTransaction.mutateAsync(id)
    navigate(ROUTES.TRANSACTIONS)
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-4 h-96 w-full rounded-2xl" />
      </div>
    )
  }

  if (isError || !transaction) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="font-medium">Transação não encontrada</p>
        <Link to={ROUTES.TRANSACTIONS} className="mt-4 inline-block text-sm text-primary hover:underline">
          Voltar para transações
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link
            to={ROUTES.TRANSACTIONS}
            className="flex size-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Voltar"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold tracking-tight">Editar transação</h1>
            <p className="truncate text-sm text-muted-foreground">{transaction.description}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
            aria-label="Excluir transação"
          >
            <Trash2 className="size-5" />
          </Button>
        </div>
      </header>

      <main className="px-4 py-4">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base">Detalhes do lançamento</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionForm
              initialValues={transactionToFormValues(transaction)}
              onSubmit={handleSubmit}
              isSubmitting={updateTransaction.isPending}
              submitLabel="Atualizar transação"
            />
          </CardContent>
        </Card>
      </main>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Excluir transação?"
        description={`"${transaction.description}" será removida permanentemente. ${
          transaction.status === 'confirmado' ? 'O saldo da conta será ajustado.' : ''
        }`}
        confirmLabel="Excluir"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={deleteTransaction.isPending}
      />
    </div>
  )
}