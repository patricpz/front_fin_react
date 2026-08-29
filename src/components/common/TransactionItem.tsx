import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Briefcase,
  Car,
  Gamepad2,
  GraduationCap,
  HeartPulse,
  Home,
  Pencil,
  Trash2,
  UtensilsCrossed,
  Wallet,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { AlertDialog } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DEFAULT_CATEGORIES, ROUTES } from '@/constants'
import { useDeleteTransaction } from '@/hooks/useDeleteTransaction'
import { cn } from '@/lib/utils'
import type { Transaction } from '@/types'
import { formatCurrency } from '@/utils/formatCurrency'

const iconMap = {
  UtensilsCrossed,
  Car,
  Home,
  Gamepad2,
  HeartPulse,
  GraduationCap,
  Wallet,
  Briefcase,
} as const

interface TransactionItemProps {
  transaction: Transaction
  showDate?: boolean
  showActions?: boolean
}

export function TransactionItem({
  transaction,
  showDate = true,
  showActions = false,
}: TransactionItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const deleteTransaction = useDeleteTransaction()

  const category = DEFAULT_CATEGORIES.find((c) => c.id === transaction.categoryId)
  const IconComponent = category?.icon ? iconMap[category.icon as keyof typeof iconMap] : Wallet
  const isIncome = transaction.type === 'receita'

  async function handleDelete() {
    await deleteTransaction.mutateAsync(transaction.id)
    setShowDeleteDialog(false)
  }

  return (
    <>
      <div className="flex items-center gap-3 py-3">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${category?.color ?? '#64748b'}20` }}
        >
          <IconComponent className="size-5" style={{ color: category?.color ?? '#64748b' }} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{transaction.description}</p>
              <p className="text-xs text-muted-foreground">{category?.name ?? 'Sem categoria'}</p>
            </div>
            <p
              className={cn(
                'shrink-0 text-sm font-semibold',
                isIncome ? 'text-income' : 'text-expense',
              )}
            >
              {isIncome ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </p>
          </div>

          <div className="mt-1.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {showDate && (
                <span className="text-xs text-muted-foreground">
                  {format(parseISO(transaction.date), "dd MMM", { locale: ptBR })}
                </span>
              )}
              <Badge variant={transaction.status === 'confirmado' ? 'success' : 'warning'}>
                {transaction.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
              </Badge>
            </div>

            {showActions && (
              <div className="flex items-center gap-1">
                <Link
                  to={ROUTES.TRANSACTION_EDIT(transaction.id)}
                  aria-label="Editar transação"
                  className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Pencil className="size-4" />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  aria-label="Excluir transação"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

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
    </>
  )
}