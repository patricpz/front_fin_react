import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { TransactionForm } from '@/components/forms/TransactionForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/constants'
import { useCreateTransaction } from '@/hooks/useCreateTransaction'
import type { TransactionFormValues } from '@/schemas/transactionSchema'

export function CreateTransactionPage() {
  const navigate = useNavigate()
  const createTransaction = useCreateTransaction()

  async function handleSubmit(data: TransactionFormValues) {
    await createTransaction.mutateAsync(data)
    navigate(ROUTES.TRANSACTIONS)
  }

  return (
    <div className="mx-auto w-full max-w-lg md:max-w-2xl">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:static md:border-b-0 md:bg-transparent md:mb-6">
        <div className="flex items-center gap-3 px-4 py-4 md:px-0 md:py-0">
          <Link
            to={ROUTES.TRANSACTIONS}
            className="flex size-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Voltar"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight md:text-2xl">Nova transação</h1>
            <p className="text-sm text-muted-foreground">Cadastre receita ou despesa</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 md:px-0 md:py-0">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Detalhes do lançamento</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionForm
              onSubmit={handleSubmit}
              isSubmitting={createTransaction.isPending}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
