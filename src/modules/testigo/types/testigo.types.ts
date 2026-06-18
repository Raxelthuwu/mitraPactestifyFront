import type { Severity } from '../../../core/types/api.types'

export type CrearReporteTestigoPayload = {
  Reporte: string
  Mesa: number
  severity: Severity
}
