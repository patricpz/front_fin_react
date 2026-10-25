import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { TransactionForm } from '@/components/forms/TransactionForm'
import { useCreateTransaction } from '@/hooks/useCreateTransaction'
import { cn } from '@/lib/utils'

interface NewTransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewTransactionModal({ open, onOpenChange }: NewTransactionModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const createTransaction = useCreateTransaction()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      dialog.showModal()
    } else {
      dialog.close()
    }

    const handleClose = () => onOpenChange(false)
    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [open, onOpenChange])

  async function handleSubmit(data: TransactionFormValues) {
    await createTransaction.mutateAsync(data)
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <dialog
        ref={dialogRef}
        className={cn(
          'w-full max-w-lg md:max-w-2xl rounded-2xl border bg-background p-6 shadow-lg',
          'backdrop:bg-black/50 backdrop:backdrop-blur-sm',
        )}
        onClick={(e) => {
          if (e.target === e.currentTarget) onOpenChange(false)
        }}
      >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Nova transação</h2>
          <p className="text-sm text-muted-foreground">Cadastre receita ou despesa</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpenChange(false)}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Fechar"
        >
          <X className="size-5" />
        </Button>
      </div>

      <TransactionForm
        onSubmit={handleSubmit}
        isSubmitting={createTransaction.isPending}
        submitLabel="Salvar transação"
      />
      </dialog>
    </div>
  )
}

import type { TransactionFormValues } from '@/schemas/transactionSchema'