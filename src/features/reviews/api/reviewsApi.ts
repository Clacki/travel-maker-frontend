import api from '@/lib/api'

export type ReviewPresignedUrlRequest = {
  file_name: string
}

export type ReviewPresignedUrlResponse = {
  presigned_url: string
  img_url: string
  key: string
  content_type: string
}

export type CreateReviewRequest = {
  rating: number
  content: string
  image_url?: string
  route_id?: number | null
}

export type UpdateReviewRequest = {
  rating?: number
  content?: string
  image_url?: string
  route_id?: number | null
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

export type CreateReviewResponse = {
  id?: number
  review_id?: number
  place_id?: number
  rating?: number
  content?: string
  image_url?: string | null
  created_at?: string
}

export async function createReviewPresignedUrl(
  body: ReviewPresignedUrlRequest
) {
  const response = await api.post<ReviewPresignedUrlResponse>(
    '/reviews/presigned-url',
    body
  )

  return response.data
}

export async function uploadReviewImage(file: File) {
  const presigned = await createReviewPresignedUrl({ file_name: file.name })
  const contentType = presigned.content_type || file.type

  const response = await fetch(presigned.presigned_url, {
    method: 'PUT',
    headers: contentType ? { 'Content-Type': contentType } : undefined,
    body: file,
  })

  if (!response.ok) {
    throw new Error('Failed to upload review image.')
  }

  return presigned.img_url
}

export async function createReview(placeId: number, body: CreateReviewRequest) {
  const response = await api.post<CreateReviewResponse>(
    `/places/${placeId}/reviews`,
    body
  )

  return response.data
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
