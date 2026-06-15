import api from '@/lib/api'

export type MyReviewItem = {
  review_id: number
  place_id: number
  place_name: string
  rating: number
  content: string
  image_url?: string | null
  img_url?: string | null
  // TODO: 백엔드에서 리뷰 이미지 URL 필드가 추가되면 image_url 타입을 연결한다.
  created_at: string
  updated_at: string
}

export type PaginatedMyReviewsResponse = {
  count?: number
  next?: string | null
  previous?: string | null
  results?: MyReviewItem[]
}

export type MyReviewsResponse = PaginatedMyReviewsResponse | MyReviewItem[]

export type GetMyReviewsParams = {
  page?: number
  pageSize?: number
}

export async function getMyReviews({
  page = 1,
  pageSize = 4,
}: GetMyReviewsParams = {}) {
  const response = await api.get<MyReviewsResponse>('/users/reviews', {
    params: {
      page,
      page_size: pageSize,
    },
  })

  return response.data
}

export async function getPublicUserReviews(
  userId: number,
  { page = 1, pageSize = 8 }: GetMyReviewsParams = {}
) {
  const response = await api.get<MyReviewsResponse>(
    `/users/${userId}/reviews`,
    {
      params: {
        page,
        page_size: pageSize,
      },
    }
  )

  return response.data
}
