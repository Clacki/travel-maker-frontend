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
  // TODO: API 연동 시 백엔드와 isOwner(서버 계산) vs userId(클라이언트 비교) 방식 합의 필요
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
