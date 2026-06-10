import api from '@/lib/api'
import type {
  PlaceRecommendItem,
  PlaceRecommendParams,
} from '../types/placeRecommend.types'

export const getRecommendPlaces = async (
  params?: PlaceRecommendParams
): Promise<PlaceRecommendItem[]> => {
  const response = await api.get<PlaceRecommendItem[]>('/places/recommend', {
    params,
  })
  return response.data
}
