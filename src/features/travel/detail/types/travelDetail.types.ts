export type InfoItem = {
  label: string
  value: string
}

export type Tag = {
  id: number
  tag_name: string
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
  id: number
  place_name: string
  description: string
  latitude: number
  longitude: number
  rating_avg: number
  review_count: number
  bookmark_count: number
  images: string[]
  tags: Tag[]
}
