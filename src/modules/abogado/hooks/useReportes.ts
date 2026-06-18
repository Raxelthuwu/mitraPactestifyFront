import { useQuery } from '@tanstack/react-query'
import { reportesService } from '../services/reportes.service'

export function useReportes(puesto: string | null, mesa: number | null) {
  return useQuery({
    queryKey: ['reportes', puesto, mesa],
    queryFn: () => reportesService.getByPuestoMesa(puesto!, mesa!),
    enabled: Boolean(puesto && mesa),
    staleTime: 1000 * 20,
  })
}
