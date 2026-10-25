import {
  ArrowLeftRight,
  // BarChart3,
  CreditCard,
  LayoutDashboard,
  LogOut,
  PiggyBank,
  Plus,
  // Tag,
  Target,
  User,
  Wallet,
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { LayoutSwitcher } from '@/components/layout/LayoutSwitcher'
import { ROUTES } from '@/constants'
import { useLogout } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const mainNavItems = [
  { to: ROUTES.DASHBOARD, label: 'Início', icon: LayoutDashboard },
  { to: ROUTES.TRANSACTIONS, label: 'Transações', icon: ArrowLeftRight },
  { to: ROUTES.ACCOUNTS, label: 'Contas', icon: Wallet },
  { to: ROUTES.CARDS, label: 'Cartões', icon: CreditCard },
]

const managementNavItems = [
  // { to: ROUTES.CATEGORIES, label: 'Categorias', icon: Tag },
  { to: ROUTES.BUDGET, label: 'Orçamento', icon: PiggyBank },
  { to: ROUTES.GOALS, label: 'Metas', icon: Target },
  // { to: ROUTES.REPORTS, label: 'Relatórios', icon: BarChart3 },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useLogout()

  async function handleLogout() {
    await logout.mutateAsync()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <aside
      className={cn(
        'flex h-screen w-64 flex-col border-r bg-card/50 backdrop-blur select-none',
        className,
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
          <Wallet className="size-5" />
        </div>
        <div>
          <span className="font-bold tracking-tight text-foreground">Finanças</span>
          <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            Web
          </span>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="p-4">
        <Link
          to={ROUTES.TRANSACTION_NEW}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-lg active:scale-[0.99]"
        >
          <Plus className="size-4 stroke-[2.5]" />
          Nova transação
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-2">
        <div>
          <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Principal
          </p>
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.to
              const Icon = item.icon
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  )}
                >
                  <Icon className={cn('size-4', isActive && 'stroke-[2.5]')} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div>
          <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Gestão
          </p>
          <nav className="space-y-1">
            {managementNavItems.map((item) => {
              const isActive = location.pathname === item.to
              const Icon = item.icon
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  )}
                >
                  <Icon className={cn('size-4', isActive && 'stroke-[2.5]')} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Footer Area: Layout switcher + User Profile & Logout */}
      <div className="border-t p-4 space-y-3 bg-muted/20">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground">Layout:</span>
          <LayoutSwitcher compact />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-background/80 p-2.5 border shadow-xs">
          <Link
            to={ROUTES.PROFILE}
            className="flex min-w-0 flex-1 items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs">
              {user?.name?.[0]?.toUpperCase() ?? <User className="size-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold leading-tight">{user?.name ?? 'Usuário'}</p>
              <p className="truncate text-[11px] text-muted-foreground leading-tight">{user?.email ?? ''}</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={logout.isPending}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
            title="Sair"
            aria-label="Sair"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
