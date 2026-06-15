import api from '@/lib/api'
import type { RouteListItem } from '../types/trip'

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

export type RouteListParams = {
  ordering?: 'latest' | 'popular'
  page?: number
  page_size?: number
  region_tag_id?: number
  theme_tag_ids?: number[]
}

type PaginatedRouteList = {
  count: number
  next: string | null
  previous: string | null
  results: RouteListItem[]
}

export type RouteListResult = {
  items: RouteListItem[]
  totalCount: number
}

export const getRoutes = async (
  params?: RouteListParams
): Promise<RouteListResult> => {
  const response = await api.get<PaginatedRouteList | RouteListItem[]>(
    '/routes',
    { params }
  )
  const data = response.data

  // API는 { count, next, previous, results } 형태로 응답하나,
  // 배열로 반환되는 경우도 방어적으로 처리한다.
  if (Array.isArray(data)) {
    return { items: data, totalCount: data.length }
  }

  return { items: data.results, totalCount: data.count }
}
