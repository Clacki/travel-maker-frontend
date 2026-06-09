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

export type TripSortOption = 'latest' | 'popular' | 'saved'
