import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { API_ORIGIN, API_URL } from '@/lib/env'
import { isRecord, pick } from '@/lib/pick'
import { tokenStorage } from '@/services/tokenStorage'
import { endpoints } from '@/services/endpoints'

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }

let refreshPromise: Promise<string | null> | null = null

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const refreshClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined
    const status = error.response?.status

    if (!originalRequest || status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    const isAuthRoute = originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/refresh')

    if (isAuthRoute) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const newAccessToken = await refreshAccessToken()
    if (!newAccessToken) {
      tokenStorage.clear()
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login')
      }
      return Promise.reject(error)
    }

    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
    return api(originalRequest)
  },
)

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}

async function doRefresh(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefresh()
  if (!refreshToken) return null

  try {
    const { data } = await refreshClient.post(endpoints.auth.refresh, {
      refresh_token: refreshToken,
    })

    const payload = isRecord(data) ? data : {}
    const accessToken = String(pick(payload, ['access_token', 'accessToken'], ''))
    const nextRefresh = String(pick(payload, ['refresh_token', 'refreshToken'], refreshToken))

    if (!accessToken) return null

    tokenStorage.set(accessToken, nextRefresh)
    return accessToken
  } catch {
    return null
  }
}

export function healthUrl() {
  return `${API_ORIGIN}${endpoints.health}`
}
