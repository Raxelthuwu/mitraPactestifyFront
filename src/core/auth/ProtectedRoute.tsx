import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Spinner } from '../../shared/components/Spinner'
import { useAuth } from './useAuth'

export function ProtectedRoute({ children }: PropsWithChildren) {
  const location = useLocation()
  const { status } = useAuth()

  if (status === 'checking') {
    return (
      <main className="app-shell centered-shell">
        <Spinner label="Validando sesión" />
      </main>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
