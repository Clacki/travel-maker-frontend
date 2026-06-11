import api from '@/lib/api'
import type { PlaceReviewsResponse, Review } from '../types/travelDetail.types'

const placeReviewsPath = (placeId: number) => `/places/${placeId}/reviews`

export const getPlaceReviews = async (placeId: number): Promise<Review[]> => {
  const response = await api.get<PlaceReviewsResponse>(
    placeReviewsPath(placeId)
  )
  return response.data.results.map((item) => ({
    id: item.review_id,
    author: { name: item.user_nickname },
    rating: item.rating,
    content: item.content,
    createdAt: item.created_at,
    isOwner: item.is_owner,
  }))
}

export type CreateReviewRequest = {
  rating: number
  content: string
  image?: string
}

export type CreateReviewResponse = {
  id?: number
  review_id?: number
  rating?: number
  content?: string
  image?: string | null
  created_at?: string
}

export const createPlaceReview = async (
  placeId: number,
  body: CreateReviewRequest
): Promise<CreateReviewResponse> => {
  const formData = new FormData()
  formData.append('rating', String(body.rating))
  formData.append('content', body.content.trim())

  if (body.image) {
    formData.append('image', body.image)
  }

  const response = await api.post<CreateReviewResponse>(
    placeReviewsPath(placeId),
    formData
  )

  return response.data
}
