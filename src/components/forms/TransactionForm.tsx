import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { DEFAULT_CATEGORIES } from '@/constants'
import { useAccounts } from '@/hooks/useAccounts'
import { useCategories } from '@/hooks/useCategories'
import { cn } from '@/lib/utils'
import { transactionSchema, type TransactionFormValues } from '@/schemas/transactionSchema'

const defaultCreateValues: TransactionFormValues = {
  type: 'despesa',
  amount: 0,
  date: format(new Date(), 'yyyy-MM-dd'),
  categoryId: '',
  accountId: '',
  description: '',
  status: 'confirmado',
}

interface TransactionFormProps {
  onSubmit: (data: TransactionFormValues) => void
  isSubmitting?: boolean
  initialValues?: TransactionFormValues
  submitLabel?: string
}

export function TransactionForm({
  onSubmit,
  isSubmitting,
  initialValues,
  submitLabel = 'Salvar transação',
}: TransactionFormProps) {
  const { data: accounts = [] } = useAccounts()
  const { data: apiCategories = [] } = useCategories()
  const categories = apiCategories.length > 0 ? apiCategories : DEFAULT_CATEGORIES

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: initialValues ?? defaultCreateValues,
  })

  const selectedType = watch('type')
  const selectedCategoryId = watch('categoryId')
  const filteredCategories = categories.filter(
    (category) => category.type === selectedType || category.type === 'transferencia',
  )

  useEffect(() => {
    if (!initialValues && accounts[0]?.id && !watch('accountId')) {
      setValue('accountId', accounts[0].id)
    }
  }, [accounts, initialValues, setValue, watch])

  useEffect(() => {
    const categoryStillValid = filteredCategories.some(
      (category) => category.id === selectedCategoryId,
    )

    if (!categoryStillValid) {
      setValue('categoryId', filteredCategories[0]?.id ?? '', { shouldValidate: true })
    }
  }, [filteredCategories, selectedCategoryId, setValue])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label>Tipo</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setValue('type', 'despesa', { shouldValidate: true })}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-colors',
              selectedType === 'despesa'
                ? 'border-expense bg-expense/10 text-expense'
                : 'border-border bg-background text-muted-foreground',
            )}
          >
            <ArrowUpRight className="size-4" />
            Despesa
          </button>
          <button
            type="button"
            onClick={() => setValue('type', 'receita', { shouldValidate: true })}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-colors',
              selectedType === 'receita'
                ? 'border-income bg-income/10 text-income'
                : 'border-border bg-background text-muted-foreground',
            )}
          >
            <ArrowDownLeft className="size-4" />
            Receita
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Valor</Label>
        <Input
          id="amount"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0.01"
          placeholder="0,00"
          {...register('amount', { valueAsNumber: true })}
        />
        {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input id="description" placeholder="Ex: Supermercado" {...register('description')} />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input id="date" type="date" {...register('date')} />
          {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select id="status" {...register('status')}>
            <option value="confirmado">Confirmado</option>
            <option value="pendente">Pendente</option>
          </Select>
          {errors.status && <p className="text-xs text-destructive">{errors.status.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">Categoria</Label>
        <Select id="categoryId" {...register('categoryId')}>
          <option value="" disabled>
            Selecione...
          </option>
          {filteredCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        {errors.categoryId && (
          <p className="text-xs text-destructive">{errors.categoryId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="accountId">Conta</Label>
        <Select id="accountId" {...register('accountId')}>
          <option value="" disabled>
            Selecione...
          </option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </Select>
        {errors.accountId && (
          <p className="text-xs text-destructive">{errors.accountId.message}</p>
        )}
      </div>

      <Button type="submit" className="h-12 w-full text-base" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : submitLabel}
      </Button>
    </form>
  )
}