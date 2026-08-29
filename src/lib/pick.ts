export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function pick<T>(source: Record<string, unknown>, keys: string[], fallback: T): T {
  for (const key of keys) {
    const value = source[key]
    if (value !== undefined && value !== null && value !== '') {
      return value as T
    }
  }

  return fallback
}

export function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value.replace(',', '.'))
    if (Number.isFinite(parsed)) return parsed
  }

  return fallback
}

export function toIsoDate(value: unknown): string {
  if (typeof value !== 'string' || !value) return ''
  return value.slice(0, 10)
}

export function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[]
  if (!isRecord(data)) return []

  const candidates = [data.items, data.results, data.data, data.registros]
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate as T[]
  }

  return []
}
