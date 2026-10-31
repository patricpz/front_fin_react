import { useState } from 'react'
import { useInstallments, usePayInstallment } from '@/hooks/useInstallments'
import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Plus, Loader2, CreditCard, X } from 'lucide-react'
import { toast } from 'sonner'
import { InstallmentCard } from '@/features/installments/InstallmentCard'

export function InstallmentsPage() {
  const { data: installments = [], isLoading } = useInstallments()
  const payInstallment = usePayInstallment()

  const [showForm, setShowForm] = useState(false)
  const [editingInstallment, setEditingInstallment] = useState<typeof installments[0] | null>(null)
  const [form, setForm] = useState({
    description: '',
    category: '',
    totalAmount: '',
    installmentCount: 2,
    firstDueDate: '',
  })

  const isSubmitting = false // TODO: add create installment mutation when backend supports it

  const resetForm = () => {
    setForm({
      description: '',
      category: '',
      totalAmount: '',
      installmentCount: 2,
      firstDueDate: '',
    })
    setEditingInstallment(null)
  }

  const handlePay = async (id: string) => {
    try {
      await payInstallment.mutateAsync(id)
      toast.success('Parcela registrada com sucesso!')
    } catch (error) {
      toast.error('Erro ao registrar parcela')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Header
        title="Despesas Parceladas"
        action={
          <Button onClick={() => { resetForm(); setShowForm(true); }} className="hidden sm:inline-flex">
            <Plus className="h-4 w-4 mr-2" />
            Nova Despesa Parcelada
          </Button>
        }
      />
      <main className="mt-6 space-y-4">
        <Button className="w-full sm:hidden" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Despesa Parcelada
        </Button>

        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center">
            <button type="button" className="absolute inset-0" aria-label="Fechar" onClick={() => { resetForm(); setShowForm(false); }} />
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{editingInstallment ? 'Editar Despesa Parcelada' : 'Nova Despesa Parcelada'}</h2>
                <button type="button" onClick={() => { resetForm(); setShowForm(false); }} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); toast.info('Criação de parcelas será implementada'); resetForm(); setShowForm(false); }} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <Input
                    placeholder="Ex: Notebook, Smartphone"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoria</label>
                  <Input
                    placeholder="Ex: Eletrônicos, Móveis"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Valor Total</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={form.totalAmount}
                    onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Número de Parcelas</label>
                  <Select value={String(form.installmentCount)} onChange={(e) => setForm({ ...form, installmentCount: Number(e.target.value) })}>
                    {Array.from({ length: 24 }, (_, i) => i + 2).map((n) => (
                      <option key={n} value={String(n)}>{n}x</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primeiro Vencimento</label>
                  <Input
                    type="date"
                    value={form.firstDueDate}
                    onChange={(e) => setForm({ ...form, firstDueDate: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button type="button" variant="outline" onClick={() => { resetForm(); setShowForm(false); }}>
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

        {installments.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="p-12 text-center">
              <CreditCard className="h-12 w-12 mx-auto text-slate-300" />
              <p className="mt-4 font-semibold">Nenhuma despesa parcelada</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Cadastre suas compras parceladas para acompanhar o progresso
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {installments.map((inst) => (
              <InstallmentCard key={inst.id} item={inst} onPay={handlePay} />
            ))}
          </div>
        )}

              </main>
    </div>
  )
}