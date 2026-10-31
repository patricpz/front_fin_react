import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { InstallmentCard } from '@/features/installments/InstallmentCard'

describe('InstallmentCard', () => {
  const mockInstallment = {
    id: 'inst-1',
    description: 'Tablet',
    category: 'Eletrônicos',
    total_amount: 3000.00,
    installment_count: 10,
    installment_amount: 300.00,
    paid_installments: 2,
    remaining_installments: 8,
    progress_percent: 20,
    paid_amount: 600.00,
    remaining_amount: 2400.00,
    next_due_date: '2026-11-10',
    is_completed: false,
  }

  const mockOnPay = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza descrição', () => {
    render(<InstallmentCard item={mockInstallment} onPay={mockOnPay} />)
    expect(screen.getByText('Tablet')).toBeInTheDocument()
  })

  it('renderiza valor da parcela e total de parcelas', () => {
    render(<InstallmentCard item={mockInstallment} onPay={mockOnPay} />)
    expect(screen.getByText(/R\$\s*300,00/)).toBeInTheDocument()
    expect(screen.getByText(/10x/)).toBeInTheDocument()
  })

  it('renderiza progresso com percentual e contagem', () => {
    render(<InstallmentCard item={mockInstallment} onPay={mockOnPay} />)
    expect(screen.getByText('20% · 2/10')).toBeInTheDocument()
  })

  it('renderiza barra de progresso acessível', () => {
    render(<InstallmentCard item={mockInstallment} onPay={mockOnPay} />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '20')
    expect(progressBar).toHaveAttribute('aria-valuemin', '0')
    expect(progressBar).toHaveAttribute('aria-valuemax', '100')
  })

  it('renderiza valores pago e restante', () => {
    render(<InstallmentCard item={mockInstallment} onPay={mockOnPay} />)
    expect(screen.getByText(/R\$\s*600,00/)).toBeInTheDocument()
    expect(screen.getByText(/R\$\s*2\.400,00/)).toBeInTheDocument()
  })

  it('renderiza próxima data de vencimento', () => {
    render(<InstallmentCard item={mockInstallment} onPay={mockOnPay} />)
    expect(screen.getByText('Próxima parcela:')).toBeInTheDocument()
    expect(screen.getByText('10 de nov.')).toBeInTheDocument()
  })

  it('renderiza botão de pagamento quando não concluída', () => {
    render(<InstallmentCard item={mockInstallment} onPay={mockOnPay} />)
    const button = screen.getByRole('button', { name: /Registrar pagamento de parcela/i })
    expect(button).toBeInTheDocument()
    expect(button).not.toBeDisabled()
  })

  it('chama onPay ao clicar no botão', () => {
    render(<InstallmentCard item={mockInstallment} onPay={mockOnPay} />)
    screen.getByRole('button', { name: /Registrar pagamento de parcela/i }).click()
    expect(mockOnPay).toHaveBeenCalledWith('inst-1')
  })

  it('mostra estado concluída quando is_completed true', () => {
    const completedInstallment = { ...mockInstallment, is_completed: true, progress_percent: 100, next_due_date: null }
    render(<InstallmentCard item={completedInstallment} onPay={mockOnPay} />)
    expect(screen.getByText('Concluída')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Registrar pagamento de parcela/i })).not.toBeInTheDocument()
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '100')
  })

  it('limita progress_percent a 100 por segurança', () => {
    const overflowInstallment = { ...mockInstallment, progress_percent: 150 }
    render(<InstallmentCard item={overflowInstallment} onPay={mockOnPay} />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '100')
  })

  it('limita progress_percent a 0 por segurança', () => {
    const underflowInstallment = { ...mockInstallment, progress_percent: -10 }
    render(<InstallmentCard item={underflowInstallment} onPay={mockOnPay} />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '0')
  })
})