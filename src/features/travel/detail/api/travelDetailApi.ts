import api from '@/lib/api'
import type { TravelDetail } from '../types/travelDetail.types'

export const getTravelDetail = async (id: string): Promise<TravelDetail> => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: src/mocks/local/ 는 .gitignore 대상 — 로컬 개발 전용
    const { getLocalMock } = await import('@/mocks/local/travelDetail')
    return getLocalMock(id)
  }
  const response = await api.get<TravelDetail>(`/api/v1/places/${id}`)
  return response.data
}
