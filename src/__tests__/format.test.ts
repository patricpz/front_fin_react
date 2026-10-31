import { formatBRL, toNumber } from '@/lib/money'
import { formatShortDate, formatRelative, parseLocalDate } from '@/lib/dates'

describe('money.ts', () => {
  it('formata BRL corretamente', () => {
    const result = formatBRL('1180.00')
    expect(result).toContain('R$')
    expect(result).toContain('1.180')
    expect(result).toContain(',00')
    expect(formatBRL(1180)).toContain('R$')
  })

  it('converte number to number', () => {
    expect(toNumber('1180.00')).toBe(1180)
    expect(toNumber(1180)).toBe(1180)
    expect(toNumber('1.180,00')).toBe(1180)
  })
})

describe('dates.ts', () => {
  it('não desloca o dia do fuso', () => {
    const date = parseLocalDate('2026-11-10')
    expect(date.getDate()).toBe(10)
    expect(date.getMonth()).toBe(10) // novembro (0-indexado)
    expect(date.getFullYear()).toBe(2026)
  })

  it('formata data curta em pt-BR', () => {
    const result = formatShortDate('2026-11-10')
    expect(result).toContain('10')
    expect(result).toContain('nov')
  })

  it('formata tempo relativo', () => {
    expect(formatRelative('2026-11-10T00:00:00')).toBeDefined()
  })
})