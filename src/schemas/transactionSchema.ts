import { z } from 'zod'

export const transactionSchema = z.object({
  type: z.enum(['receita', 'despesa', 'transferencia']),
  amount: z.number({ error: 'Informe um valor válido' }).positive('Informe um valor maior que zero'),
  date: z.string().min(1, 'Informe a data'),
  categoryId: z.string().optional(),
  accountId: z.string().min(1, 'Selecione uma conta'),
  destinationAccountId: z.string().optional(),
  description: z
    .string()
    .trim()
    .min(2, 'Descrição deve ter ao menos 2 caracteres')
    .max(200, 'Descrição muito longa'),
  observacoes: z.string().max(500).optional(),
  status: z.enum(['pendente', 'confirmado']),
  idempotency_key: z.string().uuid().optional(),
})

export type TransactionFormValues = z.infer<typeof transactionSchema>

export const createTransactionSchema = transactionSchema.refine(
  (data) => {
    if (data.type === 'transferencia') {
      return Boolean(data.destinationAccountId) && data.destinationAccountId !== data.accountId
    }
    return true
  },
  {
    message: 'Para transferências, selecione uma conta de destino diferente da conta de origem',
    path: ['destinationAccountId'],
  },
).refine(
  (data) => {
    if (data.type === 'transferencia') {
      return !data.categoryId
    }
    return Boolean(data.categoryId)
  },
  {
    message: 'Transferências não devem ter categoria',
    path: ['categoryId'],
  },
)