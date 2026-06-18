import { Download, FileSearch, Landmark, LogOut, Table2 } from 'lucide-react'
import { FormEvent, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../core/auth/useAuth'
import { BrandHeader } from '../../../shared/components/BrandHeader'
import { Button } from '../../../shared/components/Button'
import { SelectField } from '../../../shared/components/SelectField'
import { SystemStatus } from '../../../shared/components/SystemStatus'
import { exportService } from '../services/export.service'
import { usePlaces } from '../hooks/usePlaces'

export function ConsultarReportesPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { data: places = [], isLoading, isError, refetch } = usePlaces()
  const [puesto, setPuesto] = useState('')
  const [mesa, setMesa] = useState('')
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState(false)
  const selectedPlace = useMemo(() => places.find((place) => place.name === puesto), [places, puesto])
  const mesas = useMemo(() => Array.from({ length: selectedPlace?.tables ?? 0 }, (_, index) => index + 1), [selectedPlace?.tables])

  function validateSelection() {
    if (!puesto || !mesa) {
      setError('Selecciona puesto y mesa para continuar.')
      return false
    }
    setError('')
    return true
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!validateSelection()) return
    navigate('/abogado/reportes', { state: { puesto, mesa: Number(mesa) } })
  }

  async function onExport() {
    if (!validateSelection()) return
    setExporting(true)
    try {
      await exportService.descargarExcel(puesto, Number(mesa))
    } catch {
      setError('No se pudo exportar el archivo. Reintentar.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <main className="app-shell">
      <BrandHeader compact />
      <section className="workspace" aria-labelledby="abogado-title">
        <div className="workspace-head">
          <h2 className="page-title" id="abogado-title">
            Consultar reportes
          </h2>
          <p className="muted">Elige puesto de votación y luego mesa para revisar o exportar reportes.</p>
        </div>

        {isLoading ? <SystemStatus tone="loading" title="Cargando puestos" message="Estamos preparando la lista de votación." /> : null}
        {isError ? (
          <div className="surface stack">
            <SystemStatus tone="error" title="No se pudieron cargar los puestos" message="Revisa la conexión y vuelve a intentar." />
            <Button type="button" variant="secondary" onClick={() => refetch()}>
              Reintentar
            </Button>
          </div>
        ) : null}

        <form className="workspace-form" onSubmit={onSubmit}>
          {!isLoading && !isError && !exporting ? <SystemStatus tone="info" title="Sistema listo" message="Selecciona puesto y mesa; el sistema habilita cada paso en orden." /> : null}
          {exporting ? <SystemStatus tone="loading" title="Preparando archivo" message="La descarga empezará cuando el reporte esté listo." /> : null}
          <SelectField
            label="Puesto de votación"
            name="puesto"
            value={puesto}
            onChange={(event) => {
              setPuesto(event.target.value)
              setMesa('')
            }}
            disabled={isLoading || isError}
            icon={<Landmark size={20} />}
          >
            <option value="">{isLoading ? 'Cargando puestos' : 'Seleccionar puesto'}</option>
            {places.map((place) => (
              <option key={place.name} value={place.name}>
                {place.name}
              </option>
            ))}
          </SelectField>

          <SelectField label="Mesa de votación" name="mesa" value={mesa} onChange={(event) => setMesa(event.target.value)} disabled={!puesto} icon={<Table2 size={20} />}>
            <option value="">{puesto ? 'Seleccionar mesa' : 'Primero selecciona un puesto'}</option>
            {mesas.map((value) => (
              <option key={value} value={value}>
                Mesa {value}
              </option>
            ))}
          </SelectField>

          {error ? <p className="error-text">{error}</p> : null}
          <div className="actions">
            <Button type="button" variant="secondary" disabled={exporting || isLoading || isError} onClick={onExport} icon={<Download size={20} />}>
              {exporting ? 'Exportando' : 'Exportar Excel'}
            </Button>
            <Button type="submit" disabled={isLoading || isError} icon={<FileSearch size={20} />}>
              Ver reportes
            </Button>
          </div>
          <Button type="button" variant="danger" onClick={logout} icon={<LogOut size={20} />}>
            Cerrar sesión
          </Button>
        </form>
      </section>
    </main>
  )
}
