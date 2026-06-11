import api from '@/lib/api'

export type CreateRouteRequest = {
  title: string
  description?: string
  region_tag_id: number
  theme_tag_ids?: number[]
  start_date: string
  end_date: string
  days: Array<{ day_index: number; place_ids: number[] }>
}

export type CreateRouteResponse = {
  route_id: number
  title: string
  created_at: string
}

export const postRoute = async (
  payload: CreateRouteRequest
): Promise<CreateRouteResponse> => {
  const response = await api.post<CreateRouteResponse>('/routes', payload)
  return response.data
}
