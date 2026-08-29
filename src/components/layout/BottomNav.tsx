import {
  ArrowLeftRight,
  LayoutDashboard,
  Plus,
  User,
  Wallet,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { ROUTES } from '@/constants'
import { cn } from '@/lib/utils'

const navItems = [
  { to: ROUTES.DASHBOARD, label: 'Início', icon: LayoutDashboard },
  { to: ROUTES.TRANSACTIONS, label: 'Transações', icon: ArrowLeftRight },
  { to: ROUTES.ACCOUNTS, label: 'Contas', icon: Wallet },
  { to: ROUTES.PROFILE, label: 'Perfil', icon: User },
]

export function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto grid max-w-lg grid-cols-5 items-end px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {navItems.slice(0, 2).map((item) => {
          const isActive = location.pathname === item.to
          const Icon = item.icon

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className={cn('size-5', isActive && 'stroke-[2.5]')} />
              {item.label}
            </Link>
          )
        })}

        <Link
          to={ROUTES.TRANSACTION_NEW}
          className="-mt-6 mx-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105"
          aria-label="Nova transação"
        >
          <Plus className="size-7" />
        </Link>

        {navItems.slice(2).map((item) => {
          const isActive = location.pathname === item.to
          const Icon = item.icon

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className={cn('size-5', isActive && 'stroke-[2.5]')} />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
