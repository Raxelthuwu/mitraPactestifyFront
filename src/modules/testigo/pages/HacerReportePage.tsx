import { AlertTriangle, ArrowLeft, CheckCircle } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import type { Severity } from '../../../core/types/api.types'
import { BrandHeader } from '../../../shared/components/BrandHeader'
import { Button } from '../../../shared/components/Button'
import { SelectField } from '../../../shared/components/SelectField'
import { SystemStatus } from '../../../shared/components/SystemStatus'
import { TextAreaField } from '../../../shared/components/TextAreaField'
import { ConfirmarCancelarModal } from '../components/ConfirmarCancelarModal'
import { useHacerReporte } from '../hooks/useHacerReporte'

type ReporteLocationState = {
  mesa?: number
  puesto?: string
}

export function HacerReportePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state ?? {}) as ReporteLocationState
  const [reporte, setReporte] = useState('')
  const [severity, setSeverity] = useState<Severity | ''>('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [cancelOpen, setCancelOpen] = useState(false)
  const mutation = useHacerReporte()

  if (!state.mesa) return <Navigate to="/testigo" replace />

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setSuccess('')
    if (!reporte.trim() || !severity) {
      setError('La descripción y la gravedad son obligatorias.')
      return
    }

    try {
      await mutation.mutateAsync({ Reporte: reporte.trim(), Mesa: state.mesa!, severity })
      setSuccess('Reporte enviado.')
      window.setTimeout(() => navigate('/testigo', { replace: true }), 650)
    } catch {
      setError('No se pudo enviar el reporte. Reintentar.')
    }
  }

  return (
    <main className="app-shell">
      <BrandHeader compact />
      <section className="workspace" aria-labelledby="report-title">
        <div className="workspace-head">
          <h2 className="page-title" id="report-title">
            Hacer reporte
          </h2>
          <div className="context-strip">
            <span className="context-pill">{state.puesto ?? 'Puesto'}</span>
            <span className="context-pill">Mesa {state.mesa}</span>
          </div>
        </div>

        <form className="workspace-form" onSubmit={onSubmit}>
          {!mutation.isPending && !success && !error ? <SystemStatus tone="info" title="Reporte sin enviar" message="Escribe lo ocurrido, elige gravedad y confirma cuando estés listo." /> : null}
          {mutation.isPending ? <SystemStatus tone="loading" title="Enviando reporte" message="No cierres esta pantalla hasta ver la confirmación." /> : null}
          {success ? <SystemStatus tone="success" title="Reporte enviado" message="Volverás al panel inicial en un momento." /> : null}
          {error ? <SystemStatus tone="error" title="No se pudo enviar" message={error} /> : null}
          <TextAreaField label="Descripción del reporte" name="reporte" value={reporte} onChange={(event) => setReporte(event.target.value)} />
          <SelectField label="Seleccione la gravedad" name="severity" value={severity} onChange={(event) => setSeverity(event.target.value as Severity)} icon={<AlertTriangle size={20} />}>
            <option value="">Seleccionar gravedad</option>
            <option value="alto">Alto</option>
            <option value="medio">Medio</option>
            <option value="bajo">Bajo</option>
          </SelectField>
          <div className="actions">
            <Button type="submit" disabled={mutation.isPending} icon={<CheckCircle size={20} />}>
              {mutation.isPending ? 'Enviando' : 'Hacer reporte'}
            </Button>
            <Button type="button" variant="danger" onClick={() => setCancelOpen(true)} icon={<ArrowLeft size={20} />}>
              Cancelar
            </Button>
          </div>
        </form>
      </section>
      <ConfirmarCancelarModal open={cancelOpen} onClose={() => setCancelOpen(false)} onConfirm={() => navigate('/testigo', { replace: true })} />
    </main>
  )
}
