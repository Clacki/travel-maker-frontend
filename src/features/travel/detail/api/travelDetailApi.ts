import api from '@/lib/api'
import type { TravelDetail } from '../types/travelDetail.types'

export const getTravelDetail = async (id: string): Promise<TravelDetail> => {
  const response = await api.get<TravelDetail>(`/places/${id}`)
  return response.data
}
