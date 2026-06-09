export type PlaceTag = {
  id: number
  tag_name: string
}

export type Place = {
  id: number
  place_name: string
  image_url: string
  description: string
  bookmark_count: number
  rating_avg: number
  tags: PlaceTag[]
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
  tags?: number | number[]
  page?: number
  page_size?: number
}
