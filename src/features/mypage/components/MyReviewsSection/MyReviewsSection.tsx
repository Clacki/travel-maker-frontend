import { EmptyState, ErrorState } from '@/components/common/status'
import { Pagination } from '@/components/ui/Pagination/Pagination'
import { PlaceCard } from '@/components/ui/PlaceCard'
import { CardGridSkeleton } from '@/features/mypage/components/MyPageSkeleton'
import { css } from '@/styled-system/css'

import type { MyReviewCardItem } from '../../types/mypage'

interface MyReviewsSectionProps {
  reviews: MyReviewCardItem[]
  currentPage: number
  totalPages: number
  isLoading: boolean
  errorMessage: string | null
  canManage: boolean
  onPageChange: (page: number) => void
  onRetry: () => void
  onEditReview: (reviewId: number) => void
  onDeleteReview: (reviewId: number) => void
}

const gridStyle = css({
  display: 'grid',
  gridTemplateColumns: {
    base: '1fr',
    sm: 'repeat(2, 1fr)',
    lg: 'repeat(4, 1fr)',
  },
  gap: '4',
  mt: '4',
})

export function MyReviewsSection({
  reviews,
  currentPage,
  totalPages,
  isLoading,
  errorMessage,
  canManage,
  onPageChange,
  onRetry,
  onEditReview,
  onDeleteReview,
}: MyReviewsSectionProps) {
  if (isLoading) {
    return <CardGridSkeleton count={8} />
  }

  if (errorMessage) {
    return (
      <ErrorState
        title="리뷰 목록을 불러오지 못했어요"
        description={errorMessage}
        actionLabel="다시 시도"
        onAction={onRetry}
      />
    )
  }

  if (reviews.length === 0) {
    return (
      <EmptyState
        title="작성한 리뷰가 없어요"
        description="여행지를 방문하고 리뷰를 남겨보세요."
      />
    )
  }

  return (
    <>
      <div className={gridStyle}>
        {reviews.map((review) => (
          <PlaceCard
            key={review.reviewId}
            variant="review"
            reviewId={review.reviewId}
            placeId={review.placeId}
            placeName={review.placeName}
            description={review.content}
            rating={review.rating}
            imageUrl={review.imageUrl ?? undefined}
            canManage={canManage}
            onEditClick={onEditReview}
            onDeleteClick={onDeleteReview}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  )
}
