import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/constants'
import { useLogout } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import { NotificationPreferences } from '@/features/notifications/NotificationPreferences'
import { ActivateAlertsButton } from '@/features/push/ActivateAlertsButton'

export function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const logout = useLogout()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout.mutateAsync()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <div className="mx-auto w-full max-w-lg md:max-w-2xl">
      <Header title="Perfil" subtitle="Gerencie suas informações pessoais" />
      <main className="space-y-4 px-4 py-4 md:px-0 md:py-0">
        <Card className="border-0 shadow-md">
          <CardContent className="space-y-4 p-5 md:p-6">
            <div className="flex items-center gap-4 border-b pb-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
                {user?.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div>
                <h2 className="text-lg font-bold">{user?.name || 'Usuário'}</h2>
                <p className="text-sm text-muted-foreground">{user?.email || '—'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Nome completo</p>
                <p className="font-medium text-sm mt-0.5">{user?.name || '—'}</p>
              </div>
              <div className="rounded-xl bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">E-mail</p>
                <p className="font-medium text-sm mt-0.5">{user?.email || '—'}</p>
              </div>
              <div className="rounded-xl bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Moeda padrão</p>
                <p className="font-medium text-sm mt-0.5">{user?.currency || 'BRL'}</p>
              </div>
              <div className="rounded-xl bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Status da conta</p>
                <p className="font-medium text-sm text-emerald-600 mt-0.5">Ativa</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base">Notificações Push</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivateAlertsButton />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base">Preferências de Notificação</CardTitle>
          </CardHeader>
          <CardContent>
            <NotificationPreferences />
          </CardContent>
        </Card>

        <Button
          variant="destructive"
          className="w-full cursor-pointer"
          onClick={handleLogout}
          disabled={logout.isPending}
        >
          <LogOut className="size-4 mr-2" />
          {logout.isPending ? 'Saindo...' : 'Sair da conta'}
        </Button>
      </main>
    </div>
  )
}
