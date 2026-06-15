export type TripCourse = {
  id: number
  title: string
  description: string
  region: string
  themes: string[]
  authorName: string
  imageUrl: string
  placeCount: number
  saveCount: number
  viewCount: number
  createdAt: string
  isFeatured?: boolean
}

export type TripSortOption = 'latest' | 'popular'

export type RouteListItem = {
  route_id: number
  title: string
  description: string | null
  image_url: string | null
  place_count: number
  like_count: number
  created_at: string
  region_tag: string | null
  theme_tags: string[]
}

const FALLBACK_IMAGE = '/images/bg_Theme/travel-bg.webp'

export function toTripCourse(item: RouteListItem): TripCourse {
  return {
    id: item.route_id,
    title: item.title,
    description: item.description ?? '',
    region: item.region_tag ?? '',
    themes: item.theme_tags,
    authorName: '',
    imageUrl: item.image_url ?? FALLBACK_IMAGE,
    placeCount: item.place_count,
    saveCount: item.like_count,
    viewCount: 0,
    createdAt: item.created_at.slice(0, 10),
  }
}
