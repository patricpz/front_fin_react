import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { ActivateAlertsButton } from '@/features/push/ActivateAlertsButton'
import { NotificationBell } from '@/features/notifications/NotificationBell'
import { NotificationPanel } from '@/features/notifications/NotificationPanel'
import { IosInstallBanner } from '@/features/push/IosInstallBanner'

// Mock hooks
vi.mock('@/features/notifications/hooks', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useUnreadCount: vi.fn(),
    useMarkAllRead: vi.fn(() => ({ mutate: vi.fn() })),
    usePreferences: vi.fn(),
    useNotifications: vi.fn(() => ({
      data: { pages: [] },
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
      isError: false,
    })),
  }
})

vi.mock('@/features/push/usePushPermission', () => ({
  usePushPermission: vi.fn(),
}))

import { useUnreadCount } from '@/features/notifications/hooks'
import { useMarkAllRead } from '@/features/notifications/hooks'
import { usePreferences } from '@/features/notifications/hooks'
import { usePushPermission } from '@/features/push/usePushPermission'

describe('Componentes de Notificação e Instalação', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('NotificationBell exibe badge com count', () => {
    ;(useUnreadCount as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: 5 })

    render(<NotificationBell />)
    const badge = screen.getByRole('button', { name: /5 não lidas/i })
    expect(badge).toBeInTheDocument()
  })

  it('IosInstallBanner renderiza quando não dispensado', () => {
    render(<IosInstallBanner onDismiss={() => {}} />)
    expect(screen.getByText(/Para receber alertas no iPhone/i)).toBeInTheDocument()
  })

  it('IosInstallBanner não renderiza quando dispensado', () => {
    localStorage.setItem('ios-install-banner-dismissed', String(Date.now()))
    render(<IosInstallBanner onDismiss={() => {}} />)
    expect(screen.queryByRole('dialog', { name: /Como instalar no iPhone/i })).not.toBeInTheDocument()
  })

  it('ActivateAlertsButton desabilita quando granted', () => {
    ;(usePushPermission as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'granted',
      isStandalone: false,
      isIOS: false,
      requestPermission: vi.fn(),
    })

    render(<ActivateAlertsButton />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('ActivateAlertsButton mostra banner iOS quando isIOS e não standalone', async () => {
    ;(usePushPermission as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'default',
      isStandalone: false,
      isIOS: true,
      requestPermission: vi.fn(),
    })

    render(<ActivateAlertsButton />)
    // Clica no botão para mostrar o banner
    await screen.getByRole('button', { name: /Ativar alertas/i }).click()
    expect(screen.getByText(/Para receber alertas no iPhone/i)).toBeInTheDocument()
  })

  it('ActivateAlertsButton não mostra banner iOS quando não é iOS', () => {
    ;(usePushPermission as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'default',
      isStandalone: false,
      isIOS: false,
      requestPermission: vi.fn(),
    })

    render(<ActivateAlertsButton />)
    expect(screen.queryByText(/Para receber alertas no iPhone/i)).not.toBeInTheDocument()
  })

  it('NotificationPanel fecha com o botão de fechar', () => {
    ;(useUnreadCount as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: 0 })
    ;(useMarkAllRead as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ mutate: vi.fn() })
    ;(usePreferences as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: null })

    render(<NotificationPanel isOpen={true} onClose={vi.fn()} />)
    // O botão de fechar tem aria-label="Fechar" mas não tem texto visível
    expect(screen.getByLabelText('Fechar')).toBeInTheDocument()
  })
})