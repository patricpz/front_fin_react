import { useState } from 'react'
import { useGoals, useGoalProgress, useCreateGoal, useUpdateGoal, useDeleteGoal, useCreateGoalContribution, useGoalContributions } from '@/hooks/useGoals'
import { formatBRL } from '@/lib/money'
import { formatRelative, formatShortDate } from '@/lib/dates'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { ProgressBar } from '@/components/ProgressBar'
import { Plus, Trash2, Edit, Loader2, Target, ArrowUpRight, ArrowDownRight, Calendar, DollarSign, X } from 'lucide-react'
import { toast } from 'sonner'

export function GoalsPage() {
  const [statusFilter, setStatusFilter] = useState<'em_andamento' | 'concluida' | 'cancelada' | undefined>(undefined)
  const { data: goals = [], isLoading } = useGoals({ status: statusFilter })
  const createGoal = useCreateGoal()
  const updateGoal = useUpdateGoal()
  const deleteGoal = useDeleteGoal()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<typeof goals[0] | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [viewContributionsId, setViewContributionsId] = useState<string | null>(null)
  const [contributionForm, setContributionForm] = useState({ goalId: '', amount: '', type: 'aporte' as const, date: '', observation: '' })
  const [showContributionForm, setShowContributionForm] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    targetAmount: '',
    targetDate: '',
    category: '',
    status: 'em_andamento' as 'em_andamento' | 'concluida' | 'cancelada',
  })

  const isSubmitting = createGoal.isPending || updateGoal.isPending

  const resetForm = () => {
    setForm({ name: '', description: '', targetAmount: '', targetDate: '', category: '', status: 'em_andamento' })
    setEditingGoal(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      name: form.name,
      description: form.description || null,
      targetAmount: form.targetAmount,
      targetDate: form.targetDate || null,
      category: form.category,
      status: form.status,
    }

    if (editingGoal) {
      updateGoal.mutate({ id: editingGoal.id, payload }, {
        onSuccess: () => { toast.success('Meta atualizada!'); resetForm(); setIsDialogOpen(false); },
      })
    } else {
      createGoal.mutate(payload, {
        onSuccess: () => { toast.success('Meta criada!'); resetForm(); setIsDialogOpen(false); },
      })
    }
  }

  const handleEdit = (goal: typeof goals[0]) => {
    setEditingGoal(goal)
    setForm({
      name: goal.name,
      description: goal.description || '',
      targetAmount: String(goal.targetAmount),
      targetDate: goal.targetDate || '',
      category: goal.category,
      status: goal.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => setDeleteConfirmId(id)
  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteGoal.mutate(deleteConfirmId, {
        onSuccess: () => { toast.success('Meta removida!'); setDeleteConfirmId(null); },
      })
    }
  }

  const handleViewContributions = (goalId: string) => {
    setViewContributionsId(goalId)
    setContributionForm({ ...contributionForm, goalId })
  }

  const createContribution = useCreateGoalContribution()

  const handleContributionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createContribution.mutate({ goalId: contributionForm.goalId, payload: {
      amount: contributionForm.amount,
      type: contributionForm.type,
      date: contributionForm.date,
      observation: contributionForm.observation || null,
    }}, {
      onSuccess: () => {
        toast.success('Contribuição registrada!')
        setContributionForm({ goalId: contributionForm.goalId, amount: '', type: 'aporte', date: '', observation: '' })
        setShowContributionForm(false)
      },
    })
  }

  // Fetch progress for all goals at top level to avoid hook rules violation
  const goalProgressQueries = goals.map(goal => useGoalProgress(goal.id))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Header title="Metas" action={
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
            <option value="">Todos os status</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluida">Concluída</option>
            <option value="cancelada">Cancelada</option>
          </Select>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="hidden sm:inline-flex">
            <Plus className="h-4 w-4 mr-2" />Nova Meta
          </Button>
        </div>
      } />
      <main className="mt-6 space-y-4">
        <Button className="w-full sm:hidden" onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />Nova Meta
        </Button>

        {isDialogOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center">
            <button type="button" className="absolute inset-0" aria-label="Fechar" onClick={() => { resetForm(); setIsDialogOpen(false); }} />
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{editingGoal ? 'Editar Meta' : 'Nova Meta'}</h2>
                <button type="button" onClick={() => { resetForm(); setIsDialogOpen(false); }} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4 p-4">
                <div className="space-y-2"><label className="text-sm font-medium">Nome</label>
                  <Input value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} placeholder="Ex: Reserva de emergência" required /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Descrição</label>
                  <Input value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} placeholder="Opcional" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Valor Alvo</label>
                  <Input type="number" step="0.01" value={form.targetAmount} onChange={(e)=>setForm({...form, targetAmount: e.target.value})} placeholder="0,00" required /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Data Alvo</label>
                  <Input type="date" value={form.targetDate} onChange={(e)=>setForm({...form, targetDate: e.target.value})} /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Categoria</label>
                  <Input value={form.category} onChange={(e)=>setForm({...form, category: e.target.value})} placeholder="Ex: Investimentos, Viagem" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Status</label>
                  <Select value={form.status} onChange={(e)=>setForm({...form, status: e.target.value as any})}>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluida">Concluída</option>
                    <option value="cancelada">Cancelada</option>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button type="button" variant="outline" onClick={()=>{resetForm();setIsDialogOpen(false);}}>Cancelar</Button>
                  <Button type="submit" disabled={isSubmitting}>{isSubmitting?<Loader2 className="h-4 w-4 animate-spin"/>:'Salvar'}</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {goals.length === 0 ? (
          <Card className="border-0 shadow-md"><CardContent className="p-12 text-center">
            <Target className="h-12 w-12 mx-auto text-slate-300" />
            <p className="mt-4 font-semibold">Nenhuma meta cadastrada</p>
            <p className="mt-2 text-sm text-muted-foreground">Crie sua primeira meta financeira</p>
          </CardContent></Card>
        ) : (
          goals.map((goal, index) => {
            const progress = goalProgressQueries[index]?.data
            const percent = progress?.progressPercentage ?? goal.progressPercentage ?? 0
            const current = progress?.currentAmount ?? goal.currentAmount ?? 0
            const isComplete = goal.status === 'concluida' || percent >= 100
            return (
              <Card key={goal.id} className="border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="h-8 w-8 text-blue-600" />
                      <div>
                        <CardTitle className="text-base">{goal.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{goal.category || 'Sem categoria'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        goal.status === 'concluida' ? 'bg-emerald-100 text-emerald-700' :
                        goal.status === 'cancelada' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>{goal.status.replace('_', ' ')}</span>
                      <Button variant="ghost" size="icon" onClick={()=>handleEdit(goal)} aria-label="Editar"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={()=>handleViewContributions(goal.id)} aria-label="Ver contribuições">
                        <DollarSign className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={()=>handleDelete(goal.id)} aria-label="Excluir"><Trash2 className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ProgressBar value={Math.min(percent, 100)} tone={isComplete ? 'success' : 'default'} label={`${goal.name}: ${formatBRL(current)} de ${formatBRL(goal.targetAmount)}`} />
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div><p className="text-muted-foreground">Atual</p><p className="font-medium">{formatBRL(current)}</p></div>
                    <div><p className="text-muted-foreground">Alvo</p><p className="font-medium">{formatBRL(goal.targetAmount)}</p></div>
                    <div><p className="text-muted-foreground">Progresso</p><p className="font-medium">{Math.round(percent)}%</p></div>
                  </div>
                  {goal.targetDate && (
                    <p className="text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 inline mr-1" />
                      Data alvo: {formatShortDate(goal.targetDate)}
                    </p>
                  )}
                  {goal.description && <p className="text-sm text-muted-foreground">{goal.description}</p>}
                </CardContent>
              </Card>
            )
          })
        )}

        {viewContributionsId && (
          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contribuições</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => { setViewContributionsId(null); setShowContributionForm(false); }}>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full mb-4" onClick={() => setShowContributionForm(true)}>
                <Plus className="h-4 w-4 mr-2" />Nova Contribuição
              </Button>

              {showContributionForm && (
                <form onSubmit={handleContributionSubmit} className="space-y-3 p-4 bg-slate-50 rounded-lg mb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className="text-sm font-medium">Valor</label>
                      <Input type="number" step="0.01" value={contributionForm.amount} onChange={(e)=>setContributionForm({...contributionForm, amount: e.target.value})} required /></div>
                    <div className="space-y-1"><label className="text-sm font-medium">Tipo</label>
                      <Select value={contributionForm.type} onChange={(e)=>setContributionForm({...contributionForm, type: e.target.value as any})}>
                        <option value="aporte">Aporte</option>
                        <option value="retirada">Retirada</option>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className="text-sm font-medium">Data</label>
                      <Input type="date" value={contributionForm.date} onChange={(e)=>setContributionForm({...contributionForm, date: e.target.value})} required /></div>
                    <div className="space-y-1"><label className="text-sm font-medium">Observação</label>
                      <Input value={contributionForm.observation} onChange={(e)=>setContributionForm({...contributionForm, observation: e.target.value})} placeholder="Opcional" /></div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={()=>setShowContributionForm(false)}>Cancelar</Button>
                    <Button type="submit" disabled={createContribution.isPending}>
                      {createContribution.isPending ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Registrar'}
                    </Button>
                  </div>
                </form>
              )}

              {viewContributionsId && (
                <>
                  {(() => {
                    const contribsQuery = useGoalContributions(viewContributionsId)
                    const contribs = contribsQuery.data ?? []
                    return contribs.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">Nenhuma contribuição registrada</p>
                    ) : (
                      <ul className="divide-y divide-slate-100">
                        {contribs.map(c => (
                          <li key={c.id} className="py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                c.type === 'aporte' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {c.type === 'aporte' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                              </span>
                              <div>
                                <p className="font-medium">{formatBRL(c.amount)}</p>
                                <p className="text-xs text-muted-foreground">{formatRelative(c.date)}</p>
                              </div>
                            </div>
                            {c.observation && <p className="text-sm text-muted-foreground">{c.observation}</p>}
                          </li>
                        ))}
                      </ul>
                    )
                  })()}
                </>
              )}
            </CardContent>
          </Card>
        )}

        <AlertDialog
          open={!!deleteConfirmId}
          onOpenChange={(open)=>!open&&setDeleteConfirmId(null)}
          title="Excluir meta"
          description="Tem certeza? Esta ação não pode ser desfeita."
          confirmLabel="Excluir"
          onConfirm={confirmDelete}
          variant="destructive"
        />
      </main>
    </div>
  )
}