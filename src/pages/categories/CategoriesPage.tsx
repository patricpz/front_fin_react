import { useState } from 'react'
import { useCategoryTree, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { Plus, Trash2, Edit, Loader2, ChevronRight, FolderClosed, X } from 'lucide-react'
import { toast } from 'sonner'

const CATEGORY_TYPES = [
  { value: 'despesa', label: 'Despesa' },
  { value: 'receita', label: 'Receita' },
] as const

interface CategoryFormData {
  name: string
  type: 'receita' | 'despesa'
  color: string
  icon: string
  parentId: string | null
}

interface CategoryNode {
  id: string
  name: string
  type: string
  color: string
  icon: string
  parentId: string | null
  children?: CategoryNode[]
  level?: number
}

export function CategoriesPage() {
  const [activeType] = useState<'receita' | 'despesa'>('despesa')
  const { data: tree = [], isLoading } = useCategoryTree(activeType)
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  // Use tree for parent options since it has the hierarchical structure
  const treeData = tree as unknown as CategoryNode[]

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryNode | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const [form, setForm] = useState<CategoryFormData>({
    name: '',
    type: activeType,
    color: '#6366f1',
    icon: 'Tag',
    parentId: null,
  })

  const isSubmitting = createCategory.isPending || updateCategory.isPending

  const resetForm = () => {
    setForm({
      name: '',
      type: activeType,
      color: '#6366f1',
      icon: 'Tag',
      parentId: null,
    })
    setEditingCategory(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      name: form.name,
      type: form.type,
      color: form.color,
      icon: form.icon,
      parentId: form.parentId,
    }

    if (editingCategory) {
      updateCategory.mutate({ id: editingCategory.id, payload }, {
        onSuccess: () => {
          toast.success('Categoria atualizada com sucesso!')
          resetForm()
          setIsDialogOpen(false)
        },
      })
    } else {
      createCategory.mutate(payload, {
        onSuccess: () => {
          toast.success('Categoria criada com sucesso!')
          resetForm()
          setIsDialogOpen(false)
        },
      })
    }
  }

  const handleEdit = (category: CategoryNode) => {
    setEditingCategory(category)
    setForm({
      name: category.name,
      type: category.type as 'receita' | 'despesa',
      color: category.color,
      icon: category.icon,
      parentId: category.parentId,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id)
  }

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteCategory.mutate(deleteConfirmId, {
        onSuccess: () => {
          toast.success('Categoria removida com sucesso!')
          setDeleteConfirmId(null)
        },
      })
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const flattenTree = (nodes: CategoryNode[], level = 0): CategoryNode[] => {
    return nodes.flatMap((node) => [
      { ...node, level },
      ...(expandedIds.has(node.id) && node.children ? flattenTree(node.children, level + 1) : []),
    ])
  }

  const flatTree = flattenTree(treeData)

  const getParentOptions = () => {
    const flattenForOptions = (nodes: CategoryNode[]): CategoryNode[] => {
      return nodes.flatMap((node) => [
        node,
        ...(node.children ? flattenForOptions(node.children) : []),
      ])
    }
    const allNodes = flattenForOptions(treeData)
    return allNodes
      .filter((c) => c.id !== (editingCategory?.id || ''))
      .map((c) => ({ value: c.id, label: c.name }))
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
      <Header title="Categorias" action={
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="hidden sm:inline-flex">
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      } />
      <main className="mt-6">
        <Button className="w-full sm:hidden" onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>

        {isDialogOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center">
            <button type="button" className="absolute inset-0" aria-label="Fechar" onClick={() => { resetForm(); setIsDialogOpen(false); }} />
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h2>
                <button type="button" onClick={() => { resetForm(); setIsDialogOpen(false); }} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ex: Alimentação, Salário"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo</label>
                  <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })} required>
                    {CATEGORY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cor</label>
                  <Input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="h-10 w-10 cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ícone (nome do lucide-react)</label>
                  <Input
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="Ex: UtensilsCrossed, Wallet, Car"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoria Pai (opcional)</label>
                  <Select value={form.parentId ?? ''} onChange={(e) => setForm({ ...form, parentId: e.target.value || null })}>
                    <option value="">Nenhuma (categoria raiz)</option>
                    {getParentOptions().map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button type="button" variant="outline" onClick={() => { resetForm(); setIsDialogOpen(false); }}>
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
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {flatTree.length === 0 ? (
            <div className="p-12 text-center">
              <FolderClosed className="h-12 w-12 mx-auto text-slate-300" />
              <p className="mt-4 font-semibold">Nenhuma categoria cadastrada</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Crie sua primeira categoria de {activeType === 'despesa' ? 'despesa' : 'receita'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {flatTree.map((node) => (
                <li key={node.id} className="px-4 py-3 hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <span style={{ marginLeft: `${(node.level ?? 0) * 24}px` }} className="flex items-center gap-2">
                      {node.children && node.children.length > 0 ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
                          onClick={() => toggleExpand(node.id)}
                          aria-label={expandedIds.has(node.id) ? 'Colapsar' : 'Expandir'}
                        >
                          {expandedIds.has(node.id) ? (
                            <ChevronRight className="h-4 w-4 rotate-90" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      ) : (
                        <span className="w-6" />
                      )}
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: node.color }}
                      >
                        <span className="text-[10px]">📁</span>
                      </span>
                      <span className="font-medium">{node.name}</span>
                    </span>
                    <div className="ml-auto flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(node)} aria-label="Editar">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(node.id)} aria-label="Excluir">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <AlertDialog
          open={!!deleteConfirmId}
          onOpenChange={(open) => !open && setDeleteConfirmId(null)}
          title="Excluir categoria"
          description="Tem certeza que deseja excluir esta categoria? Subcategorias também serão afetadas."
          confirmLabel="Excluir"
          onConfirm={confirmDelete}
          variant="destructive"
        />
      </main>
    </div>
  )
}