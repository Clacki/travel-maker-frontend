import api from '@/lib/api'
import type {
  PlacesResponse,
  GetPlacesParams,
  GetPlacesFilterParams,
  GetPlacesSearchParams,
} from '@/types/place.types'

const PLACES_PATH = '/places'
const PLACES_FILTER_PATH = '/places/filter'
const PLACES_SEARCH_PATH = '/places/search'

const serializeParams = (p: Record<string, unknown>): string => {
  const parts: string[] = []
  for (const [key, value] of Object.entries(p)) {
    if (value === undefined || value === null) {
      continue
    }
    if (Array.isArray(value)) {
      value.forEach((v) => parts.push(`${key}=${encodeURIComponent(v)}`))
    } else {
      parts.push(`${key}=${encodeURIComponent(String(value))}`)
    }
  }
  return parts.join('&')
}

export const getPlaces = async (
  params: GetPlacesParams = {}
): Promise<PlacesResponse> => {
  const response = await api.get<PlacesResponse>(PLACES_PATH, { params })
  return response.data
}

export const getPlacesSearch = async (
  params: GetPlacesSearchParams = {}
): Promise<PlacesResponse> => {
  const response = await api.get<PlacesResponse>(PLACES_SEARCH_PATH, {
    params,
    paramsSerializer: serializeParams,
  })
  return response.data
}

export const getPlacesFilter = async (
  params: GetPlacesFilterParams = {}
): Promise<PlacesResponse> => {
  const response = await api.get<PlacesResponse>(PLACES_FILTER_PATH, {
    params,
    paramsSerializer: serializeParams,
  })
  return response.data
}
