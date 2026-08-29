import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/constants'
import { useLogout } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'

export function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const logout = useLogout()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout.mutateAsync()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <div className="mx-auto max-w-lg">
      <Header title="Perfil" />
      <main className="space-y-4 px-4 py-4">
        <Card className="border-0 shadow-md">
          <CardContent className="space-y-3 p-5">
            <div>
              <p className="text-xs text-muted-foreground">Nome</p>
              <p className="font-medium">{user?.name || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">E-mail</p>
              <p className="font-medium">{user?.email || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Moeda</p>
              <p className="font-medium">{user?.currency || 'BRL'}</p>
            </div>
          </CardContent>
        </Card>

        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
          disabled={logout.isPending}
        >
          <LogOut className="size-4" />
          {logout.isPending ? 'Saindo...' : 'Sair'}
        </Button>
      </main>
    </div>
  )
}
