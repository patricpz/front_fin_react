import { UserCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { LayoutSwitcher } from '@/components/layout/LayoutSwitcher'
import { ROUTES } from '@/constants'
import { useAuthStore } from '@/store/authStore'
import { NotificationBell } from '@/features/notifications/NotificationBell'

interface WebHeaderProps {
  title?: string
  subtitle?: string
}

export function WebHeader({ title, subtitle }: WebHeaderProps) {
  const user = useAuthStore((state) => state.user)

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-8 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex items-center gap-4">
        {title ? (
          <div>
            <h1 className="text-lg font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        ) : (
          <p className="text-sm font-medium text-muted-foreground">
            Bem-vindo(a), <span className="font-semibold text-foreground">{user?.name?.split(' ')[0] ?? 'Usuário'}</span>
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <LayoutSwitcher />

        <NotificationBell />

        <Link
          to={ROUTES.PROFILE}
          className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors hover:bg-primary/20"
          aria-label="Perfil"
          title="Meu Perfil"
        >
          <UserCircle2 className="size-5" />
        </Link>
      </div>
    </header>
  )
}
