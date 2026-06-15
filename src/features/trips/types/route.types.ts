import type { RouteListItem } from './trip'

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

export type PatchRouteRequest = Partial<Omit<CreateRouteRequest, 'days'>> & {
  days?: Array<{ day_index: number; place_ids: number[] }>
}

export type PatchRouteResponse = {
  route_id: number
  title: string
  updated_at: string
}

export type RouteListParams = {
  ordering?: 'latest' | 'popular'
  page?: number
  page_size?: number
  region_tag_id?: number
  theme_tag_ids?: number[]
}

export type RouteListResult = {
  items: RouteListItem[]
  totalCount: number
}
