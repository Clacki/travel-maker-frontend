import api from '@/lib/api'

const placeReviewsPath = (placeId: number) => `/places/${placeId}/reviews`

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
  const response = await api.post<CreateReviewResponse>(
    placeReviewsPath(placeId),
    body
  )

  return response.data
}
