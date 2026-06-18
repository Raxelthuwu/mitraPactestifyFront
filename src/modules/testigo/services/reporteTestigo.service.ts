import { endpoints } from '../../../core/api/endpoints'
import { httpClient } from '../../../core/api/httpClient'
import type { CrearReporteTestigoPayload } from '../types/testigo.types'

export const reporteTestigoService = {
  async crearReporte(payload: CrearReporteTestigoPayload) {
    const { data } = await httpClient.post(endpoints.createTestigoReport, {
      Reporte: payload.Reporte,
      Mesa: payload.Mesa,
      Problem_Grade: severityToProblemGrade(payload.severity),
    })
    return data
  },
}

function severityToProblemGrade(severity: CrearReporteTestigoPayload['severity']) {
  if (severity === 'alto') return 3
  if (severity === 'medio') return 2
  return 1
}
