import { endpoints } from '../../../core/api/endpoints'
import { httpClient } from '../../../core/api/httpClient'
import type { Place } from '../../../core/types/domain.types'

type PlacesResponse = {
  status: number
  places?: Array<{ name?: string; Name_place?: string; tables?: number; Cuantity_tables?: number }>
}

export const placesService = {
  async getAll(): Promise<Place[]> {
    const { data } = await httpClient.get<PlacesResponse>(endpoints.places)
    if (data.status !== 200 || !data.places) throw new Error('No se pudieron cargar los puestos.')
    return data.places.map((place) => ({
      name: place.name ?? place.Name_place ?? '',
      tables: place.tables ?? place.Cuantity_tables ?? 0,
    }))
  },
}
