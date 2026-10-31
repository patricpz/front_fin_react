import { useState } from 'react'
import { useBudgets, useCreateBudget, useUpdateBudget, useDeleteBudget, useBudgetProgress } from '@/hooks/useBudgets'
import { useCategories } from '@/hooks/useCategories'
import { formatBRL } from '@/lib/money'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { ProgressBar } from '@/components/ProgressBar'
import { Plus, Trash2, Edit, Loader2, AlertTriangle, X } from 'lucide-react'
import { toast } from 'sonner'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - 2 + i)

export function BudgetsPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR)

  const { data: budgets = [], isLoading: budgetsLoading } = useBudgets({ month: selectedMonth, year: selectedYear })
  const { data: categories = [] } = useCategories('despesa')
  const createBudget = useCreateBudget()
  const updateBudget = useUpdateBudget()
  const deleteBudget = useDeleteBudget()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<typeof budgets[0] | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const [form, setForm] = useState({
    categoryId: '',
    limitAmount: '',
    month: selectedMonth,
    year: selectedYear,
    alertPercentage: 80,
  })

  const isSubmitting = createBudget.isPending || updateBudget.isPending

  const resetForm = () => {
    setForm({
      categoryId: '',
      limitAmount: '',
      month: selectedMonth,
      year: selectedYear,
      alertPercentage: 80,
    })
    setEditingBudget(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      categoryId: form.categoryId,
      limitAmount: form.limitAmount,
      month: form.month,
      year: form.year,
      alertPercentage: form.alertPercentage,
    }

    if (editingBudget) {
      updateBudget.mutate({ id: editingBudget.id, payload }, {
        onSuccess: () => { toast.success('Orçamento atualizado!'); resetForm(); setIsDialogOpen(false); },
      })
    } else {
      createBudget.mutate(payload, {
        onSuccess: () => { toast.success('Orçamento criado!'); resetForm(); setIsDialogOpen(false); },
      })
    }
  }

  const handleEdit = (budget: typeof budgets[0]) => {
    setEditingBudget(budget)
    setForm({
      categoryId: budget.categoryId,
      limitAmount: String(budget.limitAmount),
      month: budget.month,
      year: budget.year,
      alertPercentage: budget.alertPercentage,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => setDeleteConfirmId(id)
  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteBudget.mutate(deleteConfirmId, {
        onSuccess: () => { toast.success('Orçamento removido!'); setDeleteConfirmId(null); },
      })
    }
  }

  const expenseCategories = categories.filter(c => c.type === 'despesa')

  // Fetch progress for each budget at top level to avoid hook rules violation
  const budgetIds = budgets.map(b => b.id)
  const budgetProgressQueries = budgetIds.map(id => useBudgetProgress(id))

  const budgetsWithProgress = budgets.map((budget, index) => ({
    ...budget,
    progress: budgetProgressQueries[index]?.data
  }))

  if (budgetsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Header title="Orçamentos" action={
        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
            <option value={1}>Janeiro</option>
            <option value={2}>Fevereiro</option>
            <option value={3}>Março</option>
            <option value={4}>Abril</option>
            <option value={5}>Maio</option>
            <option value={6}>Junho</option>
            <option value={7}>Julho</option>
            <option value={8}>Agosto</option>
            <option value={9}>Setembro</option>
            <option value={10}>Outubro</option>
            <option value={11}>Novembro</option>
            <option value={12}>Dezembro</option>
          </Select>
          <Select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </Select>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="hidden sm:inline-flex">
            <Plus className="h-4 w-4 mr-2" />Novo Orçamento
          </Button>
        </div>
      } />
      <main className="mt-6 space-y-4">
        <Button className="w-full sm:hidden" onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />Novo Orçamento
        </Button>

        {isDialogOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center">
            <button type="button" className="absolute inset-0" aria-label="Fechar" onClick={() => { resetForm(); setIsDialogOpen(false); }} />
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{editingBudget ? 'Editar Orçamento' : 'Novo Orçamento'}</h2>
                <button type="button" onClick={() => { resetForm(); setIsDialogOpen(false); }} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoria</label>
                  <Select value={form.categoryId} onChange={(e) => setForm({...form, categoryId: e.target.value})} required>
                    <option value="">Selecione uma categoria</option>
                    {expenseCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Limite</label>
                  <Input type="number" step="0.01" value={form.limitAmount} onChange={(e)=>setForm({...form, limitAmount: e.target.value})} placeholder="0,00" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><label className="text-sm font-medium">Mês</label>
                    <Select value={form.month} onChange={(e)=>setForm({...form, month: Number(e.target.value)})}>
                      <option value={1}>Janeiro</option>
                      <option value={2}>Fevereiro</option>
                      <option value={3}>Março</option>
                      <option value={4}>Abril</option>
                      <option value={5}>Maio</option>
                      <option value={6}>Junho</option>
                      <option value={7}>Julho</option>
                      <option value={8}>Agosto</option>
                      <option value={9}>Setembro</option>
                      <option value={10}>Outubro</option>
                      <option value={11}>Novembro</option>
                      <option value={12}>Dezembro</option>
                    </Select>
                  </div>
                  <div className="space-y-2"><label className="text-sm font-medium">Ano</label>
                    <Select value={form.year} onChange={(e)=>setForm({...form, year: Number(e.target.value)})}>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Alerta em %</label>
                  <Input type="number" min="1" max="100" value={form.alertPercentage} onChange={(e)=>setForm({...form, alertPercentage: Number(e.target.value)})} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button type="button" variant="outline" onClick={()=>{resetForm();setIsDialogOpen(false);}}>Cancelar</Button>
                  <Button type="submit" disabled={isSubmitting}>{isSubmitting?<Loader2 className="h-4 w-4 animate-spin"/>:'Salvar'}</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {budgetsWithProgress.length === 0 ? (
          <Card className="border-0 shadow-md"><CardContent className="p-12 text-center">
            <p className="font-semibold">Nenhum orçamento para este mês</p>
            <p className="mt-2 text-sm text-muted-foreground">Crie seu primeiro orçamento para controlar gastos por categoria</p>
          </CardContent></Card>
        ) : (
          budgetsWithProgress.map(budget => {
            const category = expenseCategories.find(c => c.id === budget.categoryId)
            const progress = budget.progress
            const percent = progress?.percentage ?? 0
            const spent = progress?.spent ?? 0
            const isAlert = progress?.alert ?? false
            const tone = percent >= 100 ? 'danger' : isAlert ? 'danger' : 'default'
            const label = `${category?.name || 'Categoria'}: ${formatBRL(spent)} de ${formatBRL(budget.limitAmount)}`
            return (
              <Card key={budget.id} className="border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: category?.color || '#6366f1'}}>
                        <span className="text-[10px]">📁</span>
                      </span>
                      <div>
                        <CardTitle className="text-base">{category?.name || 'Categoria'}</CardTitle>
                        <p className="text-sm text-muted-foreground">{formatBRL(spent)} / {formatBRL(budget.limitAmount)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isAlert && <AlertTriangle className="h-4 w-4 text-amber-600"  />}
                      {percent >= 100 && <AlertTriangle className="h-4 w-4 text-red-600"  />}
                      <Button variant="ghost" size="icon" onClick={()=>handleEdit(budget)} aria-label="Editar"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={()=>handleDelete(budget.id)} aria-label="Excluir"><Trash2 className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ProgressBar value={Math.min(percent, 100)} tone={tone} label={label} />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Alerta configurado em {budget.alertPercentage}% {isAlert ? '• Alerta ativo' : ''} {percent >= 100 ? '• Limite excedido' : ''}
                  </p>
                </CardContent>
              </Card>
            )
          })
        )}

        <AlertDialog
          open={!!deleteConfirmId}
          onOpenChange={(open)=>!open&&setDeleteConfirmId(null)}
          title="Excluir orçamento"
          description="Tem certeza? Esta ação não pode ser desfeita."
          confirmLabel="Excluir"
          onConfirm={confirmDelete}
          variant="destructive"
        />
      </main>
    </div>
  )
}