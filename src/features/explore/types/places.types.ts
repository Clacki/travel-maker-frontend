export type PlaceTag = {
  id: number
  tag_name: string
}

export type Place = {
  id: number
  place_name: string
  image_url: string | null
  description: string | null
  bookmark_count: number
  rating_avg: number
  tags: PlaceTag[]
  is_bookmarked: boolean
  latitude: string | null
  longitude: string | null
  recommended_duration?: number // API 미제공 — 추후 확정 시 연결
}

export type PlacesResponse = {
  count: number
  next: string | null
  previous: string | null
  results: Place[]
}

export type GetPlacesParams = {
  page?: number
  page_size?: number
}

export type GetPlacesFilterParams = {
  keyword?: string
  tags?: number | number[]
  sort?: 'bookmark' | 'review' | 'rating'
  order?: 'desc' | 'asc'
  page?: number
  page_size?: number
}

export type GetPlacesSearchParams = Omit<GetPlacesFilterParams, 'tags'>
