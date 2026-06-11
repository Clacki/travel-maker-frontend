export type PlaceTag = {
  id: number
  tag_name: string
}

//is_liked는 장소 찜목록여부를 확인한는 임시코드
export type Place = {
  id: number
  place_name: string
  image_url: string
  description: string
  bookmark_count: number
  rating_avg: number
  tags: PlaceTag[]
  is_liked: boolean
  main_image: string
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
