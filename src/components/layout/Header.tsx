import { Bell, UserCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/constants'
import { useLayout } from '@/hooks/useLayout'
import { useAuthStore } from '@/store/authStore'

interface HeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function Header({ title, subtitle, action }: HeaderProps) {
  const user = useAuthStore((state) => state.user)
  const { isWeb } = useLayout()

  if (isWeb) {
    return (
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    )
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-4">
        <div>
          <p className="text-xs text-muted-foreground">Olá, {user?.name?.split(' ')[0] ?? 'Usuário'}</p>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {action}
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            aria-label="Notificações"
          >
            <Bell className="size-5" />
          </button>
          <Link
            to={ROUTES.PROFILE}
            className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors hover:bg-primary/20"
            aria-label="Perfil"
          >
            <UserCircle2 className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
