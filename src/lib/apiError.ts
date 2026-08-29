import axios from 'axios'

import { isRecord } from '@/lib/pick'

export function getApiErrorMessage(error: unknown, fallback = 'Ocorreu um erro inesperado.'): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback
  }

  const detail = error.response?.data

  if (typeof detail === 'string') return detail
  if (!isRecord(detail)) return error.message || fallback

  const raw = detail.detail ?? detail.message ?? detail.error ?? detail.msg

  if (typeof raw === 'string') return raw
  if (Array.isArray(raw)) {
    return raw
      .map((item) => {
        if (typeof item === 'string') return item
        if (isRecord(item) && typeof item.msg === 'string') return item.msg
        return null
      })
      .filter(Boolean)
      .join(' ')
  }

  return error.message || fallback
}
