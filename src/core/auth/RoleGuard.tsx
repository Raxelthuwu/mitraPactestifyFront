import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import type { Role } from '../types/user.types'
import { routeForRole } from '../types/user.types'
import { useAuth } from './useAuth'

type RoleGuardProps = PropsWithChildren<{
  allow: Role[]
}>

export function RoleGuard({ allow, children }: RoleGuardProps) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!allow.includes(user.role)) return <Navigate to={routeForRole(user.role)} replace />
  return children
}
