export function tokenValido(token: string | null): boolean {
  if (!token) return false

  try {
    const payload = token.split('.')[1]
    if (!payload) return false

    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    const exp = decoded.exp

    if (!exp) return false

    const now = Math.floor(Date.now() / 1000)
    return exp > now
  } catch {
    return false
  }
}

export function decodeTokenPayload(token: string): Record<string, unknown> | null {
  if (!token) return null

  try {
    const payload = token.split('.')[1]
    if (!payload) return null

    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}