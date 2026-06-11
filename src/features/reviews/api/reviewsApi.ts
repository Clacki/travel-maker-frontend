import api from '@/lib/api'

export type UpdateReviewRequest = {
  rating: number
  content: string
  image_url?: string
}

export type UpdateReviewResponse = {
  review_id?: number
  place_id?: number
  place_name?: string
  rating?: number
  content?: string
  image_url?: string | null
  created_at?: string
  updated_at?: string
}

export async function updateReview(
  reviewId: number,
  body: UpdateReviewRequest
) {
  const response = await api.patch<UpdateReviewResponse>(
    `/reviews/${reviewId}`,
    body
  )

  return response.data
}

export async function deleteReview(reviewId: number) {
  await api.delete<void>(`/reviews/${reviewId}`)
}
