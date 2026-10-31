const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** Aceita number ou string ("1180.00", "1180,00", "1.180,00") e devolve número. */
export function toNumber(value: number | string): number {
  if (typeof value === 'number') return value
  const str = value.trim()
  // Se tem vírgula e ponto, assume pt-BR: "1.180,00" -> remove pontos, troca vírgula por ponto
  if (str.includes(',') && str.includes('.')) {
    return Number(str.replace(/\./g, '').replace(',', '.'))
  }
  // Se só tem vírgula, assume decimal pt-BR: "1180,00" -> troca vírgula por ponto
  if (str.includes(',')) {
    return Number(str.replace(',', '.'))
  }
  // Se só tem ponto, assume decimal padrão: "1180.00" -> usa direto
  return Number(str)
}

export function formatBRL(value: number | string): string {
  return BRL.format(toNumber(value))
}