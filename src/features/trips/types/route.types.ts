import type { RouteListItem } from './trip'

// GET /routes/{route_id} 응답 스키마
export type RouteDetailPlace = {
  order: number
  place_id: number
  place_name: string
  description: string
  address_primary: string
  address_detail: string
  latitude: number
  longitude: number
  image_url: string | null
}

export type RouteDetailDay = {
  day_index: number
  places: RouteDetailPlace[]
}

export type RouteDetail = {
  route_id: number
  title: string
  description: string | null
  user_id: number
  user_nickname: string
  region_tag: string | null
  theme_tags: string[]
  start_date: string
  end_date: string
  created_at: string
  days: RouteDetailDay[]
}

export type CreateRouteRequest = {
  title: string
  description?: string
  region_tag_id: number
  theme_tag_ids: number[]
  start_date: string
  end_date: string
  days: Array<{ day_index: number; place_ids: number[] }>
}

export type CreateRouteResponse = {
  route_id: number
  title: string
  created_at: string
  days: RouteDetailDay[]
}

export type PatchRouteRequest = Partial<Omit<CreateRouteRequest, 'days'>> & {
  days?: Array<{ day_index: number; place_ids: number[] }>
}

export type PatchRouteResponse = {
  route_id: number
  title: string
  updated_at: string
  days: RouteDetailDay[]
}

export type RouteListParams = {
  ordering?: 'latest'
  page?: number
  page_size?: number
  region_tag_id?: number
  theme_tag_ids?: number[]
}

export type RouteListResult = {
  items: RouteListItem[]
  totalCount: number
}
