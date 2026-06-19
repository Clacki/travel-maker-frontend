import api from '@/lib/api'
import type { PlaceReviewsResponse, Review } from '../types/travelDetail.types'

const placeReviewsPath = (placeId: number) => `/places/${placeId}/reviews`

export type GetPlaceReviewsParams = {
  page?: number
  pageSize?: number
}

export type PlaceReviewsResult = {
  reviews: Review[]
  total: number
  hasMore: boolean
}

// TODO: 리뷰 목록/작성 API가 여러 feature에서 재사용되면 reviews 도메인 이동 검토.
export const getPlaceReviews = async (
  placeId: number,
  { page = 1, pageSize = 4 }: GetPlaceReviewsParams = {}
): Promise<PlaceReviewsResult> => {
  const response = await api.get<PlaceReviewsResponse>(
    placeReviewsPath(placeId),
    { params: { page, page_size: pageSize } }
  )
  const data = response.data
  return {
    reviews: data.results.map((item) => ({
      id: item.review_id,
      author: {
        id: item.user_id,
        name: item.user_nickname,
        avatarUrl: item.user_profile_img_url ?? undefined,
      },
      rating: item.rating,
      content: item.content,
      imageUrl: item.image_url ?? item.img_url ?? null,
      createdAt: item.created_at,
      isOwner: item.is_owner,
    })),
    total: data.count,
    hasMore: data.next !== null,
  }
}
