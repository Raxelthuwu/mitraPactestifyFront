import { LogOut, PencilLine, Table2 } from 'lucide-react'
import { FormEvent, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../core/auth/useAuth'
import { BrandHeader } from '../../../shared/components/BrandHeader'
import { Button } from '../../../shared/components/Button'
import { SelectField } from '../../../shared/components/SelectField'
import { SystemStatus } from '../../../shared/components/SystemStatus'

export function SeleccionMesaPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [mesa, setMesa] = useState('')
  const [error, setError] = useState('')
  const mesas = useMemo(() => Array.from({ length: user?.mesas ?? 0 }, (_, index) => index + 1), [user?.mesas])

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!mesa) {
      setError('Elige una mesa antes de hacer el reporte.')
      return
    }
    navigate('/testigo/reporte', { state: { mesa: Number(mesa), puesto: user?.puestoVotacion } })
  }

  return (
    <main className="app-shell">
      <BrandHeader compact />
      <section className="workspace" aria-labelledby="testigo-title">
        <div className="workspace-head">
          <h2 className="page-title" id="testigo-title">
            Panel de testigo
          </h2>
          <div className="context-strip">
            <span className="context-pill">Puesto: {user?.puestoVotacion ?? 'Sin puesto asignado'}</span>
            <span className="context-pill">{user?.mesas ?? 0} mesas disponibles</span>
          </div>
        </div>

        <form className="workspace-form" onSubmit={onSubmit}>
          <SystemStatus tone="info" title="Sistema listo" message="Elige la mesa y continúa cuando tengas el reporte." />
          <SelectField label="Elije mesa" name="mesa" value={mesa} onChange={(event) => setMesa(event.target.value)} error={error} icon={<Table2 size={20} />}>
            <option value="">Seleccionar mesa</option>
            {mesas.map((value) => (
              <option key={value} value={value}>
                Mesa {value}
              </option>
            ))}
          </SelectField>
          <div className="actions">
            <Button type="submit" icon={<PencilLine size={20} />}>
              Hacer reporte
            </Button>
            <Button type="button" variant="danger" onClick={logout} icon={<LogOut size={20} />}>
              Cerrar sesión
            </Button>
          </div>
        </form>
      </section>
    </main>
  )
}
