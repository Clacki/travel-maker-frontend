export interface PlaceTag {
  id: number
  tag_name: string
}

export interface PlaceRecommendItem {
  id: number
  place_name: string
  image_url: string
  description: string
  bookmark_count: number
  rating_avg: number
  tags: PlaceTag[]
}

export interface PlaceRecommendParams {
  limit?: number
  region_tag_id?: number
  tags?: number[]
}
