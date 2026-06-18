import { useQuery } from '@tanstack/react-query'
import { placesService } from '../services/places.service'

export function usePlaces() {
  return useQuery({
    queryKey: ['places'],
    queryFn: placesService.getAll,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  })
}
