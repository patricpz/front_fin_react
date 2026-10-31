import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { NotificationBell } from '@/features/notifications/NotificationBell'

// Mock do hook useUnreadCount
vi.mock('@/features/notifications/hooks', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useUnreadCount: vi.fn(),
  }
})

import { useUnreadCount } from '@/features/notifications/hooks'

describe('NotificationBell', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza botão do sino', () => {
    ;(useUnreadCount as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: 0 })

    render(<NotificationBell />)
    const button = screen.getByRole('button', { name: /Notificações/i })
    expect(button).toBeInTheDocument()
  })

  it('não exibe badge quando unreadCount é 0', () => {
    ;(useUnreadCount as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: 0 })

    render(<NotificationBell />)
    expect(screen.queryByText('0')).not.toBeInTheDocument()
    expect(screen.queryByText('9+')).not.toBeInTheDocument()
  })

  it('exibe badge com contagem quando unreadCount > 0', () => {
    ;(useUnreadCount as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: 3 })

    render(<NotificationBell />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('exibe "9+" quando unreadCount > 9', () => {
    ;(useUnreadCount as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: 15 })

    render(<NotificationBell />)
    expect(screen.getByText('9+')).toBeInTheDocument()
  })

  it('aria-label inclui contagem de não lidas', () => {
    ;(useUnreadCount as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: 5 })

    render(<NotificationBell />)
    const button = screen.getByRole('button', { name: /5 não lidas/i })
    expect(button).toBeInTheDocument()
  })

  it('aria-label genérico quando sem não lidas', () => {
    ;(useUnreadCount as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: 0 })

    render(<NotificationBell />)
    const button = screen.getByRole('button', { name: /Notificações$/i })
    expect(button).toBeInTheDocument()
  })

  it('atualiza badge quando unreadCount muda', () => {
    const mockReturnValue = { data: 2 }
    ;(useUnreadCount as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockReturnValue)

    const { rerender } = render(<NotificationBell />)
    expect(screen.getByText('2')).toBeInTheDocument()

    mockReturnValue.data = 7
    rerender(<NotificationBell />)
    expect(screen.getByText('7')).toBeInTheDocument()
  })
})