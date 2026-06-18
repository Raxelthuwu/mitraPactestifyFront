import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { queryClient } from '../cache/queryClient'
import type { LoginRequest } from '../types/api.types'
import type { User } from '../types/user.types'
import { authEvents } from './authEvents'
import { AuthContext, type AuthContextValue, type AuthStatus } from './authContextValue'
import { getCurrentUserRequest, loginRequest, logoutRequest } from './auth.service'
import { isTokenExpired } from './jwt'
import { tokenStorage } from './tokenStorage'

export function AuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AuthStatus>('checking')
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  const clearSession = useCallback(() => {
    tokenStorage.clear()
    queryClient.clear()
    setToken(null)
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } finally {
      clearSession()
    }
  }, [clearSession])

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const response = await loginRequest(credentials)
      const started = response.inicio === true || response.inicio === 'true'

      if (!started) {
        throw new Error('Esta cuenta ya tiene una sesión activa en otro dispositivo.')
      }

      if (response.status !== 200 || !response.token) {
        throw new Error('Correo, cédula o contraseña inválidos.')
      }

      tokenStorage.set(response.token)
      const currentUser = await getCurrentUserRequest()
      setToken(response.token)
      setUser(currentUser)
      setStatus('authenticated')
    },
    [],
  )

  useEffect(() => {
    const existingToken = tokenStorage.get()
    if (!existingToken || isTokenExpired(existingToken)) {
      clearSession()
      return
    }

    let active = true
    getCurrentUserRequest()
      .then((currentUser) => {
        if (!active) return
        setToken(existingToken)
        setUser(currentUser)
        setStatus('authenticated')
      })
      .catch(() => {
        if (active) clearSession()
      })

    return () => {
      active = false
    }
  }, [clearSession])

  useEffect(() => authEvents.onLogout(logout), [logout])

  const value = useMemo<AuthContextValue>(
    () => ({ status, token, user, login, logout }),
    [status, token, user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
