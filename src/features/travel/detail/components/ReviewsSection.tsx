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

const paginationStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '3',
  mt: '2',
})

const pageInfoStyle = css({
  fontSize: 'sm',
  color: 'text.secondary',
  minW: '12',
  textAlign: 'center',
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

const PAGE_SIZE = 4

export default function ReviewsSection({ placeId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[] | undefined>(undefined)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isPaging, setIsPaging] = useState(false)
  const [hasMyReview, setHasMyReview] = useState(false)
  const isLoading = reviews === undefined
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const loadPage = useCallback(
    (targetPage: number) => {
      return getPlaceReviews(placeId, { page: targetPage, pageSize: PAGE_SIZE })
        .then(({ reviews: list, total: count }) => {
          setReviews(list)
          setTotal(count)
          setHasMyReview((prev) => prev || list.some((r) => r.isOwner))
        })
        .catch(() => {
          setReviews([])
          setTotal(0)
        })
    },
    [placeId]
  )

  const fetchReviews = useCallback(() => {
    setReviews(undefined)
    setPage(1)
    setHasMyReview(false)
    loadPage(1)
  }, [loadPage])

  useEffect(() => {
    loadPage(1)
  }, [loadPage])

  const handlePageChange = async (targetPage: number) => {
    if (isPaging || targetPage < 1 || targetPage > totalPages) return
    setIsPaging(true)
    await loadPage(targetPage)
    setPage(targetPage)
    setIsPaging(false)
  }

  const handleDeleted = (reviewId: number) => {
    setReviews((prev) => prev?.filter((r) => r.id !== reviewId))
    setTotal((prev) => Math.max(0, prev - 1))
  }

  return (
    <section aria-label="리뷰" className={sectionStyle}>
      <div className={headerStyle}>
        <h2 className={headingStyle}>
          리뷰{!isLoading && total > 0 && ` (${total.toLocaleString()}개)`}
        </h2>
        <ReviewWriteButton
          placeId={placeId}
          onSuccess={fetchReviews}
          hasMyReview={hasMyReview}
        />
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

      {!isLoading && totalPages > 1 && (
        <div className={paginationStyle}>
          <Button
            variant="secondary"
            onClick={() => handlePageChange(page - 1)}
            disabled={isPaging || page <= 1}
          >
            &lt; 이전
          </Button>
          <span className={pageInfoStyle}>
            {page} / {totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={() => handlePageChange(page + 1)}
            disabled={isPaging || page >= totalPages}
          >
            다음 &gt;
          </Button>
        </div>
      )}
    </section>
  )
}
