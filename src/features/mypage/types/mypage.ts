import type { ReviewModalMode } from '@/components/common/ReviewModal'
import type { UserProfile } from '@/types/mypage.types'

export interface BookmarkPlace {
  id: number
  place_name: string
  rating_avg: string
  main_image: string | null
}

export interface BookmarkResponseItem {
  id: number
  place: BookmarkPlace
  created_at: string
}

export type MyPageUser = UserProfile

export type MyReviewCardItem = {
  reviewId: number
  placeId: number
  placeName: string
  rating: number
  content: string
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

export type ReviewModalState = {
  isOpen: boolean
  mode: ReviewModalMode
  reviewId: number | null
  initialRating: number
  initialContent: string
  initialImageSrc: string | null
  initialCreatedAt?: string
}
