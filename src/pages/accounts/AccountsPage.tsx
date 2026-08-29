import { useState } from 'react'
import { Landmark, Plus, Pencil, Trash2, Wallet, CreditCard, PiggyBank, TrendingUp, CircleDollarSign } from 'lucide-react'

import { Header } from '@/components/layout/Header'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/progress'
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount } from '@/hooks/useAccounts'
import type { Account, AccountType } from '@/types'
import { formatCurrency } from '@/utils/formatCurrency'

const accountTypeLabels: Record<AccountType, string> = {
  corrente: 'Corrente',
  poupanca: 'Poupança',
  carteira: 'Carteira',
  investimento: 'Investimento',
  cartao_credito: 'Cartão de Crédito',
}

const accountTypeIcons: Record<AccountType, typeof Landmark> = {
  corrente: Landmark,
  poupanca: PiggyBank,
  carteira: Wallet,
  investimento: TrendingUp,
  cartao_credito: CreditCard,
}

const accountTypeBadgeVariant: Record<AccountType, 'default' | 'secondary' | 'success' | 'warning' | 'danger'> = {
  corrente: 'default',
  poupanca: 'success',
  carteira: 'secondary',
  investimento: 'warning',
  cartao_credito: 'danger',
}

interface AccountFormData {
  name: string
  type: AccountType
  initialBalance: string
  currency: string
}

const defaultFormData: AccountFormData = {
  name: '',
  type: 'corrente',
  initialBalance: '0.00',
  currency: 'BRL',
}

export function AccountsPage() {
  const { data: accounts = [], isLoading } = useAccounts()
  const createAccount = useCreateAccount()
  const updateAccount = useUpdateAccount()
  const deleteAccount = useDeleteAccount()

  const [showForm, setShowForm] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [formData, setFormData] = useState<AccountFormData>(defaultFormData)
  const [deleteTarget, setDeleteTarget] = useState<Account | null>(null)

  const activeAccounts = accounts.filter((a) => a.active)
  const totalBalance = activeAccounts.reduce((sum, a) => sum + a.balance, 0)

  function handleOpenCreate() {
    setEditingAccount(null)
    setFormData(defaultFormData)
    setShowForm(true)
  }

  function handleOpenEdit(account: Account) {
    setEditingAccount(account)
    setFormData({
      name: account.name,
      type: account.type,
      initialBalance: String(account.initialBalance),
      currency: account.currency,
    })
    setShowForm(true)
  }

  function handleCloseForm() {
    setShowForm(false)
    setEditingAccount(null)
    setFormData(defaultFormData)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.name.trim()) return

    if (editingAccount) {
      updateAccount.mutate(
        { id: editingAccount.id, payload: { name: formData.name, type: formData.type, initialBalance: formData.initialBalance, currency: formData.currency } },
        { onSuccess: handleCloseForm },
      )
    } else {
      createAccount.mutate(
        { name: formData.name, type: formData.type, initialBalance: formData.initialBalance, currency: formData.currency },
        { onSuccess: handleCloseForm },
      )
    }
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return
    deleteAccount.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    })
  }

  return (
    <div className="mx-auto max-w-lg">
      <Header title="Contas" subtitle="Gerencie suas contas financeiras" />

      <main className="space-y-4 px-4 py-4">
        <Button className="w-full" onClick={handleOpenCreate}>
          <Plus className="mr-2 size-4" />
          Nova conta
        </Button>

        <Card className="border-0 shadow-md">
          <CardContent className="flex items-start justify-between p-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Saldo total</p>
              <p className="text-lg font-bold tracking-tight">{formatCurrency(totalBalance)}</p>
              <p className="text-xs text-muted-foreground">
                {activeAccounts.length} {activeAccounts.length === 1 ? 'conta ativa' : 'contas ativas'}
              </p>
            </div>
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
              <CircleDollarSign className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold">Suas contas</h2>
              <Badge variant="secondary">{activeAccounts.length}</Badge>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : activeAccounts.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Nenhuma conta encontrada.
              </p>
            ) : (
              <div className="divide-y">
                {activeAccounts.map((account) => {
                  const Icon = accountTypeIcons[account.type]
                  return (
                    <div key={account.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="rounded-xl bg-secondary p-2.5 text-muted-foreground">
                        <Icon className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium">{account.name}</p>
                          <Badge variant={accountTypeBadgeVariant[account.type]}>
                            {accountTypeLabels[account.type]}
                          </Badge>
                        </div>
                        <p className="text-lg font-bold">{formatCurrency(account.balance)}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(account)}
                          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                          aria-label={`Editar ${account.name}`}
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(account)}
                          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Excluir ${account.name}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Fechar"
            onClick={handleCloseForm}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
            <h2 className="text-lg font-semibold">{editingAccount ? 'Editar conta' : 'Nova conta'}</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="account-name">Nome</Label>
                <Input
                  id="account-name"
                  placeholder="Ex: Nubank"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-type">Tipo</Label>
                <select
                  id="account-type"
                  value={formData.type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as AccountType }))}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {(Object.keys(accountTypeLabels) as AccountType[]).map((key) => (
                    <option key={key} value={key}>
                      {accountTypeLabels[key]}
                    </option>
                  ))}
                </select>
              </div>

              {!editingAccount && (
                <div className="space-y-2">
                  <Label htmlFor="account-balance">Saldo inicial</Label>
                  <Input
                    id="account-balance"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.initialBalance}
                    onChange={(e) => setFormData((prev) => ({ ...prev, initialBalance: e.target.value }))}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" onClick={handleCloseForm} disabled={createAccount.isPending || updateAccount.isPending}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createAccount.isPending || updateAccount.isPending}>
                  {createAccount.isPending || updateAccount.isPending ? 'Aguarde...' : editingAccount ? 'Salvar' : 'Criar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title="Excluir conta"
        description={`Tem certeza que deseja excluir "${deleteTarget?.name}"? A conta será desativada, mas os dados serão preservados.`}
        confirmLabel="Excluir"
        onConfirm={handleConfirmDelete}
        isLoading={deleteAccount.isPending}
        variant="destructive"
      />
    </div>
  )
}
