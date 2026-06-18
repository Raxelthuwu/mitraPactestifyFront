import { useQuery } from '@tanstack/react-query'
import { reportesService } from '../services/reportes.service'

export function useReportes(table: number | null) {
  return useQuery({
    queryKey: ['reportes', table],
    queryFn: () => reportesService.getByMesa(table!),
    enabled: table !== null,
    staleTime: 1000 * 20,
  })
}
