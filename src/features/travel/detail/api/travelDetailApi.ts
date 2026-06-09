import api from '@/lib/api'
import type { TravelDetail } from '../types/travelDetail.types'

export const getTravelDetail = async (id: string): Promise<TravelDetail> => {
  if (process.env.NODE_ENV === 'development') {
    const { getLocalMock } = await import('@/mocks/local/travelDetail')
    return getLocalMock(id)
  }
  const response = await api.get<TravelDetail>(`/api/v1/places/${id}`)
  return response.data
}
