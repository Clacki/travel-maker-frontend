import type { ReviewModalMode } from '@/components/common/ReviewModal'
import type { UserProfile } from '@/types/mypage.types'

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

export type MyTripCourse = {
  routeId: number
  title: string
  description: string
  imageUrl?: string | null
  regionName?: string
  startDate?: string
  endDate?: string
  dayCount?: number
  placeCount?: number
  tags: string[]
  isPublic: boolean
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
