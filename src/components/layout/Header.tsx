import { Bell, UserCircle2 } from 'lucide-react'

import { useAuthStore } from '@/store/authStore'

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const user = useAuthStore((state) => state.user)

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-4">
        <div>
          <p className="text-xs text-muted-foreground">Olá, {user?.name?.split(' ')[0] ?? 'Usuário'}</p>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Notificações"
          >
            <Bell className="size-5" />
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
            aria-label="Perfil"
          >
            <UserCircle2 className="size-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
