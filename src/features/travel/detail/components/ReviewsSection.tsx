import { Button } from '@/components/common/button'
import { EmptyState } from '@/components/common/status/EmptyState'
import { css } from '@/styled-system/css'

import type { Review } from '../types/travelDetail.types'
import ReviewCard from './ReviewCard'
import ReviewWriteButton from './ReviewWriteButton'

interface ReviewsSectionProps {
  reviews: Review[]
  reviewCount: number
}

const sectionStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '4',
})

const headerStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const headingStyle = css({
  fontSize: 'xl',
  fontWeight: 'bold',
  color: 'text.primary',
})

const reviewListStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '3',
})

const moreButtonWrapperStyle = css({
  display: 'flex',
  justifyContent: 'center',
  mt: '2',
})

export default function ReviewsSection({
  reviews,
  reviewCount,
}: ReviewsSectionProps) {
  return (
    <section aria-label="리뷰" className={sectionStyle}>
      <div className={headerStyle}>
        <h2 className={headingStyle}>리뷰</h2>
        <ReviewWriteButton />
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          title="아직 리뷰가 없어요"
          description="첫 번째 리뷰를 남겨보세요."
        />
      ) : (
        <div className={reviewListStyle}>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {reviewCount > reviews.length && (
        <div className={moreButtonWrapperStyle}>
          <Button variant="secondary">
            리뷰 더 보기 ({reviewCount.toLocaleString()}개)
          </Button>
        </div>
      )}
    </section>
  )
}
