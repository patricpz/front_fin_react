import { useState } from 'react'
import { useAccounts } from '@/hooks/useAccounts'
import { useCreateAccount, useUpdateAccount, useDeleteAccount } from '@/hooks/useAccounts'
import { formatBRL } from '@/lib/money'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { Plus, CreditCard, Trash2, Edit, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const ACCOUNT_TYPES = [
  { value: 'cartao_credito', label: 'Cartão de Crédito' },
  { value: 'corrente', label: 'Conta Corrente' },
  { value: 'poupanca', label: 'Poupança' },
  { value: 'carteira', label: 'Carteira' },
  { value: 'investimento', label: 'Investimento' },
] as const

interface CardFormData {
  name: string
  type: 'cartao_credito' | 'corrente' | 'poupanca' | 'carteira' | 'investimento'
  initialBalance: string
  currency: string
}

const defaultFormData: CardFormData = {
  name: '',
  type: 'cartao_credito',
  initialBalance: '0',
  currency: 'BRL',
}

export function CardsPage() {
  const { data: accounts = [], isLoading, refetch } = useAccounts()
  const creditCards = accounts.filter((a) => a.type === 'cartao_credito')
  const otherAccounts = accounts.filter((a) => a.type !== 'cartao_credito')

  const createAccount = useCreateAccount()
  const updateAccount = useUpdateAccount()
  const deleteAccount = useDeleteAccount()

  const [showForm, setShowForm] = useState(false)
  const [editingAccount, setEditingAccount] = useState<typeof accounts[0] | null>(null)
  const [formData, setFormData] = useState<CardFormData>(defaultFormData)
  const [deleteTarget, setDeleteTarget] = useState<typeof accounts[0] | null>(null)

  const isSubmitting = createAccount.isPending || updateAccount.isPending

  const resetForm = () => {
    setFormData(defaultFormData)
    setEditingAccount(null)
  }

  const handleOpenCreate = () => {
    resetForm()
    setShowForm(true)
  }

  const handleOpenEdit = (account: typeof accounts[0]) => {
    setEditingAccount(account)
    setFormData({
      name: account.name,
      type: account.type,
      initialBalance: String(account.initialBalance),
      currency: account.currency,
    })
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    resetForm()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      name: formData.name,
      type: formData.type,
      initialBalance: formData.initialBalance || undefined,
      currency: formData.currency || undefined,
    }

    if (editingAccount) {
      updateAccount.mutate({ id: editingAccount.id, payload }, {
        onSuccess: () => { toast.success('Cartão atualizado com sucesso!'); handleCloseForm(); refetch(); },
      })
    } else {
      createAccount.mutate(payload, {
        onSuccess: () => { toast.success('Cartão criado com sucesso!'); handleCloseForm(); refetch(); },
      })
    }
  }

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteAccount.mutate(deleteTarget.id, {
        onSuccess: () => { toast.success('Cartão removido com sucesso!'); setDeleteTarget(null); refetch(); },
      })
    }
  }

  const getTypeLabel = (type: string) => {
    return ACCOUNT_TYPES.find((t) => t.value === type)?.label || type
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Header
        title="Cartões"
        action={
          <Button onClick={handleOpenCreate} className="hidden sm:inline-flex">
            <Plus className="mr-2 h-4 w-4" />
            Novo Cartão
          </Button>
        }
      />
      <main className="mt-6 space-y-6">
        <Button className="w-full sm:hidden" onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cartão
        </Button>

        {creditCards.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Cartões de Crédito
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {creditCards.map((account) => (
                <Card key={account.id} className="border-slate-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{account.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{getTypeLabel(account.type)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(account)}
                          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                          aria-label={`Editar ${account.name}`}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(account)}
                          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-red-100 hover:text-red-600"
                          aria-label={`Excluir ${account.name}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Saldo</span>
                      <span className="font-medium">{formatBRL(account.balance)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Saldo Inicial</span>
                      <span>{formatBRL(account.initialBalance)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Moeda</span>
                      <span>{account.currency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <span className={account.active ? 'text-emerald-600' : 'text-slate-500'}>
                        {account.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {otherAccounts.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Outras Contas</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {otherAccounts.map((account) => (
                <Card key={account.id} className="border-slate-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{account.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{getTypeLabel(account.type)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(account)}
                          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                          aria-label={`Editar ${account.name}`}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(account)}
                          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-red-100 hover:text-red-600"
                          aria-label={`Excluir ${account.name}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Saldo</span>
                      <span className="font-medium">{formatBRL(account.balance)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Saldo Inicial</span>
                      <span>{formatBRL(account.initialBalance)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Moeda</span>
                      <span>{account.currency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <span className={account.active ? 'text-emerald-600' : 'text-slate-500'}>
                        {account.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {creditCards.length === 0 && otherAccounts.length === 0 && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-12 text-center">
              <CreditCard className="h-12 w-12 mx-auto text-slate-300" />
              <p className="mt-4 font-semibold">Nenhum cartão ou conta cadastrado</p>
              <p className="mt-2 text-sm text-muted-foreground">Adicione seu primeiro cartão de crédito ou conta bancária</p>
            </CardContent>
          </Card>
        )}

        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center">
            <button type="button" className="absolute inset-0" aria-label="Fechar" onClick={handleCloseForm} />
            <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
              <h2 className="text-lg font-semibold">{editingAccount ? 'Editar Cartão' : 'Novo Cartão'}</h2>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome</label>
                  <Input
                    placeholder="Ex: Nubank, Itaú, C6"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo</label>
                  <Select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })} required>
                    {ACCOUNT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Saldo Inicial</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.initialBalance}
                    onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
                    placeholder="0,00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Moeda</label>
                  <Input
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    placeholder="BRL"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button type="button" variant="outline" onClick={handleCloseForm} disabled={isSubmitting}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        <AlertDialog
          open={Boolean(deleteTarget)}
          onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
          title="Excluir cartão"
          description="Tem certeza que deseja excluir este cartão? Esta ação não pode ser desfeita."
          confirmLabel="Excluir"
          onConfirm={handleConfirmDelete}
          isLoading={deleteAccount.isPending}
          variant="destructive"
        />
      </main>
    </div>
  )
}