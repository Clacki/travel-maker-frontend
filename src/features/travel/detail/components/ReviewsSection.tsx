'use client'

import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/common/button'
import { EmptyState } from '@/components/common/status/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { css } from '@/styled-system/css'
import { getPlaceReviews } from '../api/reviewApi'
import type { Review } from '../types/travelDetail.types'
import ReviewCard from './ReviewCard'
import ReviewWriteButton from './ReviewWriteButton'

interface ReviewsSectionProps {
  reviewCount: number
  placeId: number
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

function ReviewSkeleton() {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '3',
        p: '4',
        borderRadius: 'lg',
        border: '1px solid',
        borderColor: 'border.subtle',
      })}
    >
      <div className={css({ display: 'flex', alignItems: 'center', gap: '2' })}>
        <Skeleton width="32px" height="32px" radius="pill" />
        <Skeleton width="80px" height="14px" />
      </div>
      <Skeleton width="100%" height="14px" />
      <Skeleton width="70%" height="14px" />
    </div>
  )
}

export default function ReviewsSection({
  reviewCount,
  placeId,
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[] | undefined>(undefined)
  const isLoading = reviews === undefined

  const fetchReviews = useCallback(() => {
    setReviews(undefined)
    getPlaceReviews(placeId)
      .then(setReviews)
      .catch(() => setReviews([]))
  }, [placeId])

  useEffect(() => {
    getPlaceReviews(placeId)
      .then(setReviews)
      .catch(() => setReviews([]))
  }, [placeId])

  const handleDeleted = (reviewId: number) => {
    setReviews((prev) => prev?.filter((r) => r.id !== reviewId))
  }

  return (
    <section aria-label="리뷰" className={sectionStyle}>
      <div className={headerStyle}>
        <h2 className={headingStyle}>리뷰</h2>
        <ReviewWriteButton placeId={placeId} onSuccess={fetchReviews} />
      </div>

      {isLoading ? (
        <div className={reviewListStyle}>
          {Array.from({ length: 3 }).map((_, i) => (
            <ReviewSkeleton key={i} />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          title="아직 리뷰가 없어요"
          description="첫 번째 리뷰를 남겨보세요"
        />
      ) : (
        <div className={reviewListStyle}>
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}

      {!isLoading && reviewCount > reviews.length && (
        <div className={moreButtonWrapperStyle}>
          {/* TODO: 리뷰 더보기 페이지네이션 또는 무한스크롤 연결 */}
          <Button variant="secondary" disabled>
            리뷰 더보기 ({reviewCount.toLocaleString()}개)
          </Button>
        </div>
      )}
    </section>
  )
}
