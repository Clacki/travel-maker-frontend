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

export type PlaceInfo = {
  operating_hours: string | null
  closed_days: string | null
  parking: boolean | null
  admission_fee: string | null
  spend_time: string | null
  discount_info: string | null
  accom_count: string | null
  pet: boolean | null
  baby_carriage: boolean | null
  credit_card: boolean | null
}

export type TravelDetail = {
  id: number
  place_name: string
  description: string | null
  latitude: number
  longitude: number
  homepage: string | null
  tel: string | null
  address_primary: string | null
  address_detail: string | null
  rating_avg: number
  review_count: number
  bookmark_count: number
  images: string[]
  tags: Tag[]
  info: PlaceInfo | null
}
