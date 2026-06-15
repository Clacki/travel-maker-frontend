import api from '@/lib/api'
import type { PlaceReviewsResponse, Review } from '../types/travelDetail.types'

const placeReviewsPath = (placeId: number) => `/places/${placeId}/reviews`

// TODO: 리뷰 목록/작성 API가 여러 feature에서 재사용되면 reviews 도메인 이동 검토.
export const getPlaceReviews = async (placeId: number): Promise<Review[]> => {
  const response = await api.get<PlaceReviewsResponse>(
    placeReviewsPath(placeId)
  )
  return response.data.results.map((item) => ({
    id: item.review_id,
    author: { id: item.user_id, name: item.user_nickname },
    rating: item.rating,
    content: item.content,
    imageUrl: item.image_url ?? item.img_url ?? null,
    createdAt: item.created_at,
    isOwner: item.is_owner,
  }))
}
