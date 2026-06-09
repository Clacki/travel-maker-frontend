import api from '@/lib/api'
import type { PlacesResponse, GetPlacesParams } from '../types/places.types'

const PLACES_PATH = '/api/v1/places'

export const getPlaces = async (
  params: GetPlacesParams = {}
): Promise<PlacesResponse> => {
  const response = await api.get<PlacesResponse>(PLACES_PATH, { params })
  return response.data
}
