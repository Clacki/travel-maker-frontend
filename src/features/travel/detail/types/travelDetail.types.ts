export type InfoItem = {
  label: string
  value: string
}

export type ReviewAuthor = {
  name: string
  avatarUrl?: string
}

export type Review = {
  id: number
  author: ReviewAuthor
  rating: number
  createdAt: string
  content: string
  isOwner?: boolean
}

export type TravelDetail = {
  id: string
  title: string
  region: string
  subRegion: string
  images: string[]
  rating: number
  reviewCount: number
  tags: string[]
  description: string
  infoItems: InfoItem[]
  latitude: number
  longitude: number
  reviews: Review[]
}
