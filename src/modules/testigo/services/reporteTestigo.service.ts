import { endpoints } from '../../../core/api/endpoints'
import { httpClient } from '../../../core/api/httpClient'
import { mockApi } from '../../../core/api/mockApi'
import type { CrearReporteTestigoPayload } from '../types/testigo.types'

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'

export const reporteTestigoService = {
  async crearReporte(payload: CrearReporteTestigoPayload) {
    if (useMocks) return mockApi.createReport(payload)
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
