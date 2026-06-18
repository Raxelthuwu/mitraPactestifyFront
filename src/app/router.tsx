import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../core/auth/ProtectedRoute'
import { RoleGuard } from '../core/auth/RoleGuard'
import { LoginPage } from '../features/auth/LoginPage'
import { RouteFallback } from './RouteFallback'

const ModuloTestigo = lazy(() => import('../modules/testigo/ModuloTestigo'))
const ModuloAbogado = lazy(() => import('../modules/abogado/ModuloAbogado'))

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/testigo/*',
    element: (
      <ProtectedRoute>
        <RoleGuard allow={['TESTIGO']}>
          <Suspense fallback={<RouteFallback />}>
            <ModuloTestigo />
          </Suspense>
        </RoleGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: '/abogado/*',
    element: (
      <ProtectedRoute>
        <RoleGuard allow={['Abogado', 'Coordinador']}>
          <Suspense fallback={<RouteFallback />}>
            <ModuloAbogado />
          </Suspense>
        </RoleGuard>
      </ProtectedRoute>
    ),
  },
  { path: '*', element: <Navigate to="/login" replace /> },
])
