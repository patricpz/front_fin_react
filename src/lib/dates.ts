/** "2026-11-10" -> Date local (meia-noite no fuso do aparelho). */
export function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatShortDate(iso: string): string {
  return parseLocalDate(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export function formatRelative(isoDateTime: string): string {
  const diffMin = Math.round((Date.now() - new Date(isoDateTime).getTime()) / 60000)
  if (diffMin < 1) return 'agora'
  if (diffMin < 60) return `há ${diffMin} min`
  const h = Math.round(diffMin / 60)
  if (h < 24) return `há ${h} h`
  return new Date(isoDateTime).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}