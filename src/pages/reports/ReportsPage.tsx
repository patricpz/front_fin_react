import { useState } from 'react'
import { useMonthlySummary, useCategorySpending, useBalanceEvolution, useBudgetVsActual } from '@/hooks/useReports'
import { formatBRL } from '@/lib/money'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, DollarSign, PieChart } from 'lucide-react'
import { ProgressBar } from '@/components/ProgressBar'
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
} from 'recharts'
import type { PieLabelRenderProps } from 'recharts'

const CURRENT_MONTH = new Date().getMonth() + 1
const CURRENT_YEAR = new Date().getFullYear()
const MONTHS = [
  { value: 1, label: 'Janeiro' }, { value: 2, label: 'Fevereiro' }, { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' }, { value: 5, label: 'Maio' }, { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' }, { value: 8, label: 'Agosto' }, { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' }, { value: 11, label: 'Novembro' }, { value: 12, label: 'Dezembro' },
]
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - 2 + i)

const COLORS = ['#6366f1', '#ec4899', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6', '#ef4444', '#14b8a6', '#f43f5e']

export function ReportsPage() {
  const [month, setMonth] = useState(CURRENT_MONTH)
  const [year, setYear] = useState(CURRENT_YEAR)

  const { data: summary, isLoading: summaryLoading } = useMonthlySummary(month, year)
  const { data: categorySpending, isLoading: catLoading } = useCategorySpending(month, year)
  const { data: balanceEvolution, isLoading: balLoading } = useBalanceEvolution(month, year)
  const { data: budgetVsActual, isLoading: bvaLoading } = useBudgetVsActual(month, year)

  const isLoading = summaryLoading || catLoading || balLoading || bvaLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const totalIncome = summary?.totalIncome ?? 0
  const totalExpenses = summary?.totalExpenses ?? 0
  const balance = summary?.balance ?? 0
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

  const expenseCategories = categorySpending?.categories?.filter(c => c.type === 'despesa') ?? []
  const incomeCategories = categorySpending?.categories?.filter(c => c.type === 'receita') ?? []

  const balanceData = balanceEvolution?.points?.map((p: { date: string; balance: number }) => ({
    name: p.date,
    saldo: p.balance,
  })) ?? []

  const budgetData = budgetVsActual?.map((b) => ({
    name: b.categoryName,
    orcado: b.budgeted,
    realizado: b.actual,
    percentual: b.percentage,
    alert: b.alert,
  })) ?? []

  return (
    <div className="mx-auto w-full max-w-5xl">
      <Header title="Relatórios" action={
        <div className="flex items-center gap-2">
          <Select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </Select>
          <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </Select>
        </div>
      } />

      <main className="mt-6 space-y-6">
        {/* Resumo Mensal */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Resumo do Mês</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Receitas</p>
                    <p className="text-2xl font-bold text-emerald-600">{formatBRL(totalIncome)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-emerald-600/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Despesas</p>
                    <p className="text-2xl font-bold text-red-600">{formatBRL(totalExpenses)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-red-600/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Saldo</p>
                    <p className={`text-2xl font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatBRL(balance)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa de Poupança</p>
                    <p className={`text-2xl font-bold ${savingsRate >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {savingsRate.toFixed(1)}%
                    </p>
                  </div>
                  <PieChart className="h-8 w-8 text-blue-600/20" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Tabs defaultValue="categorias" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="categorias">Gastos por Categoria</TabsTrigger>
            <TabsTrigger value="evolucao">Evolução Patrimonial</TabsTrigger>
            <TabsTrigger value="orcamento">Orçado vs Realizado</TabsTrigger>
          </TabsList>

          {/* Gastos por Categoria */}
          <TabsContent value="categorias">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle>Despesas por Categoria</CardTitle></CardHeader>
                <CardContent>
                  {expenseCategories.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Nenhuma despesa neste período</p>
                  ) : (
                    <>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={expenseCategories}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={2}
                              dataKey="amount"
                              nameKey="categoryName"
                              label={(props: PieLabelRenderProps) => `${props.name} ${((props.percent ?? 0) * 100).toFixed(1)}%`}
                            >
                              {expenseCategories.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [typeof value === 'number' ? formatBRL(value) : '', '']} />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                        {expenseCategories.map((cat, i) => (
                          <div key={cat.categoryId} className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            <span className="flex-1 text-sm">{cat.categoryName}</span>
                            <span className="text-sm font-medium">{formatBRL(cat.amount)}</span>
                            <span className="text-sm text-muted-foreground">{cat.percentage.toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Receitas por Categoria</CardTitle></CardHeader>
                <CardContent>
                  {incomeCategories.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Nenhuma receita neste período</p>
                  ) : (
                    <div className="space-y-2">
                      {incomeCategories.map((cat, _i) => (
                        <div key={cat.categoryId} className="flex items-center gap-3">
                          <span className="w-3 h-3 rounded-full bg-emerald-500" />
                          <span className="flex-1 text-sm">{cat.categoryName}</span>
                          <span className="text-sm font-medium text-emerald-600">{formatBRL(cat.amount)}</span>
                          <span className="text-sm text-muted-foreground">{cat.percentage.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Evolução Patrimonial */}
          <TabsContent value="evolucao">
            <Card>
              <CardHeader><CardTitle>Evolução do Saldo</CardTitle></CardHeader>
              <CardContent>
                {balanceData.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Sem dados de evolução</p>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={balanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tickFormatter={(v) => v.split('-').slice(1).join('/')} />
                        <YAxis tickFormatter={(v) => formatBRL(v)} />
                        <Tooltip formatter={(value) => [typeof value === 'number' ? formatBRL(value) : '', 'Saldo']} />
                        <Line
                          type="monotone"
                          dataKey="saldo"
                          stroke="#6366f1"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orçado vs Realizado */}
          <TabsContent value="orcamento">
            <Card>
              <CardHeader><CardTitle>Orçado vs Realizado</CardTitle></CardHeader>
              <CardContent>
                {budgetData.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhum orçamento configurado para este mês</p>
                ) : (
                  <>
                    <div className="h-64 mb-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={budgetData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" tickFormatter={(v) => formatBRL(v)} />
                          <YAxis type="category" dataKey="name" width={120} />
                          <Tooltip formatter={(value, name) => [typeof value === 'number' ? formatBRL(value) : '', name === 'orcado' ? 'Orçado' : 'Realizado']} />
                          <Bar dataKey="orcado" fill="#6366f1" name="Orçado" radius={[0, 4, 4, 0]} />
                          <Bar dataKey="realizado" fill="#ef4444" name="Realizado" radius={[0, 4, 4, 0]} />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {budgetData.map((b) => (
                        <div key={b.name} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.alert ? '#ef4444' : '#22c55e' }} />
                              {b.name}
                            </span>
                            <span>{b.percentual.toFixed(1)}%</span>
                          </div>
                          <ProgressBar
                            value={Math.min(b.percentual, 100)}
                            tone={b.alert ? 'danger' : b.percentual >= 100 ? 'danger' : 'default'}
                            label={`${b.name}: ${formatBRL(b.realizado)} de ${formatBRL(b.orcado)}`}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}