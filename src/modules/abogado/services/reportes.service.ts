import { endpoints } from '../../../core/api/endpoints'
import { httpClient } from '../../../core/api/httpClient'
import { mockApi } from '../../../core/api/mockApi'
import type { Severity } from '../../../core/types/api.types'
import type { Reporte } from '../../../core/types/domain.types'

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'

type ReportesResponse = {
  status: number
  reports?: Array<{ id?: string; text?: string; Repord?: string; severity?: Severity | number; Problem_Grade?: number; testigo?: string; hora?: string }>
}

export const reportesService = {
  async getByMesa(table: number): Promise<Reporte[]> {
    if (useMocks) return mockApi.getReports(table)
    const { data } = await httpClient.get<ReportesResponse>(endpoints.placeReports, { params: { table } })
    if (data.status !== 200 || !data.reports) throw new Error('No se pudieron cargar los reportes.')
    return data.reports.map((report, index) => ({
      id: report.id ?? `${table}-${index}`,
      text: report.text ?? report.Repord ?? '',
      severity: normalizeSeverity(report.severity ?? report.Problem_Grade),
      testigo: report.testigo,
      hora: report.hora,
    }))
  },
}

function normalizeSeverity(value: Severity | number | undefined): Severity {
  if (value === 'alto' || value === 3) return 'alto'
  if (value === 'medio' || value === 2) return 'medio'
  return 'bajo'
}
