import { endpoints } from '../../../core/api/endpoints'
import { httpClient } from '../../../core/api/httpClient'
import { mockApi } from '../../../core/api/mockApi'

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'

export const exportService = {
  async descargarExcel(puesto: string, mesa: number) {
    const result = useMocks
      ? await mockApi.exportReports(puesto, mesa)
      : await httpClient
          .get<Blob>(endpoints.exportReports, {
            params: { puesto, mesa, Puesto: puesto, Mesa: mesa },
            responseType: 'blob',
          })
          .then((response) => ({
            blob: response.data,
            filename: filenameFromHeader(response.headers['content-disposition']) ?? `reportes-${puesto}-mesa-${mesa}.xlsx`,
          }))

    downloadBlob(result.blob, result.filename)
  },
}

function filenameFromHeader(header: unknown) {
  if (typeof header !== 'string') return null
  const match = header.match(/filename="?([^"]+)"?/i)
  return match?.[1] ?? null
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
