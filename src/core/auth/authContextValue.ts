import { createContext } from 'react'
import type { LoginRequest } from '../types/api.types'
import type { User } from '../types/user.types'

export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated'

export type AuthContextValue = {
  status: AuthStatus
  token: string | null
  user: User | null
  login(credentials: LoginRequest): Promise<void>
  logout(): Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
