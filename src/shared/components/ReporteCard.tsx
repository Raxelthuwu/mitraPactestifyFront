import type { Reporte } from '../../core/types/domain.types'
import type { CSSProperties } from 'react'

const severityLabels = {
  alto: 'Alto',
  medio: 'Medio',
  bajo: 'Bajo',
} as const

const severityColors = {
  alto: 'var(--sev-alto)',
  medio: 'var(--sev-medio)',
  bajo: 'var(--sev-bajo)',
} as const

export function ReporteCard({ reporte }: { reporte: Reporte }) {
  return (
    <article className="report-card" style={{ '--severity-color': severityColors[reporte.severity] } as CSSProperties}>
      <span className="severity-badge">Gravedad {severityLabels[reporte.severity]}</span>
      <p>{reporte.text}</p>
      <p className="muted">
        {reporte.testigo ?? 'Testigo'} · {reporte.hora ?? 'Hora no registrada'}
      </p>
    </article>
  )
}
