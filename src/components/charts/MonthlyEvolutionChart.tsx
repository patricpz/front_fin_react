import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCompactCurrency } from '@/utils/formatCurrency'

interface MonthlyEvolutionChartProps {
  data: Array<{ month: string; receitas: number; despesas: number }>
}

export function MonthlyEvolutionChart({ data }: MonthlyEvolutionChartProps) {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-base">Receitas x Despesas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.91 0.01 264)" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'oklch(0.5 0.02 264)' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'oklch(0.5 0.02 264)' }}
                tickFormatter={(value) => formatCompactCurrency(Number(value))}
              />
              <Tooltip
                formatter={(value) => formatCompactCurrency(Number(value))}
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
              />
              <Bar dataKey="receitas" name="Receitas" fill="oklch(0.55 0.17 155)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="despesas" name="Despesas" fill="oklch(0.55 0.22 25)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
