import type { LucideIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend?: string
  variant?: 'default' | 'income' | 'expense' | 'primary'
}

const variantStyles = {
  default: 'text-foreground',
  income: 'text-income',
  expense: 'text-expense',
  primary: 'text-primary',
}

const iconStyles = {
  default: 'bg-secondary text-foreground',
  income: 'bg-income/10 text-income',
  expense: 'bg-expense/10 text-expense',
  primary: 'bg-primary/10 text-primary',
}

export function StatCard({ title, value, icon: Icon, trend, variant = 'default' }: StatCardProps) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="flex items-start justify-between p-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className={cn('text-lg font-bold tracking-tight', variantStyles[variant])}>{value}</p>
          {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
        </div>
        <div className={cn('rounded-xl p-2.5', iconStyles[variant])}>
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  )
}
