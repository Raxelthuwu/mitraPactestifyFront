type JwtPayload = {
  exp?: number
  role?: string
  name?: string
  puestoVotacion?: string
  mesas?: number
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  return window.atob(padded)
}

export function decodeJwt(token: string): JwtPayload | null {
  const [, payload] = token.split('.')
  if (!payload) return null

  try {
    return JSON.parse(decodeBase64Url(payload)) as JwtPayload
  } catch {
    return null
  }
}

export function isTokenExpired(token: string) {
  const payload = decodeJwt(token)
  if (!payload?.exp) return false
  return payload.exp * 1000 <= Date.now()
}
