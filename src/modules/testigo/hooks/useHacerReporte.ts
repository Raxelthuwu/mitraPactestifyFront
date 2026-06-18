import { useMutation } from '@tanstack/react-query'
import { reporteTestigoService } from '../services/reporteTestigo.service'

export function useHacerReporte() {
  return useMutation({
    mutationFn: reporteTestigoService.crearReporte,
  })
}
