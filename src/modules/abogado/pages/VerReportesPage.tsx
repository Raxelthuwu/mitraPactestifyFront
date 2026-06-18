import { ArrowLeft, LogOut, RefreshCw } from 'lucide-react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../../core/auth/useAuth'
import { BrandHeader } from '../../../shared/components/BrandHeader'
import { Button } from '../../../shared/components/Button'
import { ReporteCard } from '../../../shared/components/ReporteCard'
import { SystemStatus } from '../../../shared/components/SystemStatus'
import { useReportes } from '../hooks/useReportes'

type ReportesLocationState = {
  puesto?: string
  mesa?: number
}

export function VerReportesPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const location = useLocation()
  const state = (location.state ?? {}) as ReportesLocationState
  const { data: reportes = [], isLoading, isError, refetch, isFetching } = useReportes(state.puesto ?? null, state.mesa ?? null)

  if (!state.puesto || !state.mesa) return <Navigate to="/abogado" replace />

  return (
    <main className="app-shell">
      <BrandHeader compact />
      <section className="workspace" aria-labelledby="reports-title">
        <div className="workspace-head">
          <h2 className="page-title" id="reports-title">
            Reportes totales: {reportes.length}
          </h2>
          <div className="context-strip">
            <span className="context-pill">Puesto {state.puesto}</span>
            <span className="context-pill">Mesa {state.mesa}</span>
          </div>
        </div>

        <div className="actions">
          <Button type="button" variant="secondary" onClick={() => navigate('/abogado')} icon={<ArrowLeft size={20} />}>
            Volver
          </Button>
          <Button type="button" variant="secondary" onClick={() => refetch()} disabled={isFetching} icon={<RefreshCw size={20} />}>
            Actualizar
          </Button>
        </div>

        {isLoading ? <SystemStatus tone="loading" title="Cargando reportes" message="Estamos consultando la mesa seleccionada." /> : null}
        {!isLoading && isFetching ? <SystemStatus tone="loading" title="Actualizando reportes" message="La lista se refrescará en un momento." /> : null}
        {isError ? <SystemStatus tone="error" title="No se pudieron cargar los reportes" message="Reintenta la consulta desde esta misma pantalla." /> : null}
        {!isLoading && !isError && reportes.length === 0 ? <SystemStatus tone="success" title="Sin reportes por ahora" message="No hay novedades registradas para esta mesa." /> : null}
        {!isLoading && !isError && reportes.length > 0 && !isFetching ? <SystemStatus tone="success" title="Reportes cargados" message="La información de esta mesa ya está visible." /> : null}
        <div className="stack">
          {reportes.map((reporte) => (
            <ReporteCard key={reporte.id} reporte={reporte} />
          ))}
        </div>

        <Button type="button" variant="danger" onClick={logout} icon={<LogOut size={20} />}>
          Cerrar sesión
        </Button>
      </section>
    </main>
  )
}
