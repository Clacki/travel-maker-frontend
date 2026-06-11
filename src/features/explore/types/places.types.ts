export type PlaceTag = {
  id: number
  tag_name: string
}

export type Place = {
  id: number
  place_name: string
  image_url: string | null
  description: string
  bookmark_count: number
  rating_avg: number
  tags: PlaceTag[]
  is_bookmarked: boolean
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
