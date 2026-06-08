import { travelDetailMock } from '@/mocks/data/travelDetail'
import type { TravelDetail } from '../types/travelDetail.types'

export const getTravelDetail = async (id: string): Promise<TravelDetail> => {
  // TODO: 실제 API 연동 시 아래 코드로 교체
  // const response = await api.get<TravelDetail>(`/api/v1/places/${id}`)
  // return response.data
  return Promise.resolve({ ...travelDetailMock, id })
}
