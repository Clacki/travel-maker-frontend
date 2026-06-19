import { useCallback, useEffect, useMemo, useState } from 'react'
import { isAxiosError } from 'axios'

import type { ReviewSubmitPayload } from '@/components/common/ReviewModal'
import {
  deleteReview,
  updateReview,
  uploadReviewImage,
  type UpdateReviewRequest,
} from '@/features/reviews/api/reviewsApi'

import {
  getMyReviews,
  getPublicUserReviews,
  type MyReviewItem,
  type MyReviewsResponse,
} from '../api/myReviewsApi'
import type { MyReviewCardItem, ReviewModalState } from '../types/mypage'

const REVIEW_PAGE_SIZE = 8

const initialReviewModalState: ReviewModalState = {
  isOpen: false,
  mode: 'create',
  reviewId: null,
  initialRating: 0,
  initialContent: '',
  initialImageSrc: null,
  initialCreatedAt: undefined,
}

function normalizeMyReviewsResponse(response: MyReviewsResponse) {
  if (Array.isArray(response)) {
    return {
      count: response.length,
      next: null,
      previous: null,
      results: response,
    }
  }

  const results = response.results ?? []

  return {
    count: response.count ?? results.length,
    next: response.next ?? null,
    previous: response.previous ?? null,
    results,
  }
}

function mapMyReviewToCard(review: MyReviewItem): MyReviewCardItem {
  return {
    reviewId: review.review_id,
    placeId: review.place_id,
    placeName: review.place_name,
    rating: review.rating,
    content: review.content,
    imageUrl: review.image_url ?? review.img_url ?? null,
    createdAt: review.created_at,
    updatedAt: review.updated_at,
  }
}

function getDeleteReviewErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    const status = error.response?.status

    if (status === 401) {
      return '로그인이 만료되었습니다. 다시 로그인해주세요.'
    }

    if (status === 403) {
      return '리뷰를 삭제할 권한이 없습니다.'
    }

    if (status === 404) {
      return '이미 삭제되었거나 찾을 수 없는 리뷰입니다.'
    }

    if (status && status >= 500) {
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    }
  }

  return '리뷰 삭제에 실패했습니다. 다시 시도해주세요.'
}

interface UseMyReviewsOptions {
  enabled: boolean
  canManage: boolean
  isAuthInitialized: boolean
  isLoggedIn: boolean
  targetUserId?: number
}

export function useMyReviews({
  enabled,
  canManage,
  isAuthInitialized,
  isLoggedIn,
  targetUserId,
}: UseMyReviewsOptions) {
  const [reviewPage, setReviewPage] = useState(1)
  const [reviews, setReviews] = useState<MyReviewCardItem[]>([])
  const [reviewCount, setReviewCount] = useState(0)
  const [reviewNext, setReviewNext] = useState<string | null>(null)
  const [reviewPrevious, setReviewPrevious] = useState<string | null>(null)
  const [isReviewLoading, setIsReviewLoading] = useState(false)
  const [reviewError, setReviewError] = useState<string | null>(null)
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false)
  const [reviewSubmitError, setReviewSubmitError] = useState<string | null>(
    null
  )
  const [isReviewDeleting, setIsReviewDeleting] = useState(false)
  const [reviewDeleteError, setReviewDeleteError] = useState<string | null>(
    null
  )
  const [reviewModal, setReviewModal] = useState<ReviewModalState>(
    initialReviewModalState
  )

  const fetchMyReviews = useCallback(
    async (page: number) => {
      if (!isAuthInitialized) {
        return
      }

      if (!targetUserId && !isLoggedIn) {
        return
      }

      setIsReviewLoading(true)
      setReviewError(null)

      try {
        const response = targetUserId
          ? await getPublicUserReviews(targetUserId, {
              page,
              pageSize: REVIEW_PAGE_SIZE,
            })
          : await getMyReviews({
              page,
              pageSize: REVIEW_PAGE_SIZE,
            })
        const normalized = normalizeMyReviewsResponse(response)

        setReviews(normalized.results.map(mapMyReviewToCard))
        setReviewCount(normalized.count)
        setReviewNext(normalized.next)
        setReviewPrevious(normalized.previous)
      } catch {
        setReviews([])
        setReviewCount(0)
        setReviewNext(null)
        setReviewPrevious(null)
        setReviewError('리뷰 목록을 불러오지 못했습니다.')
      } finally {
        setIsReviewLoading(false)
      }
    },
    [isAuthInitialized, isLoggedIn, targetUserId]
  )

  useEffect(() => {
    if (!enabled) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      void fetchMyReviews(reviewPage)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [enabled, fetchMyReviews, reviewPage])

  const reviewTotalPages = useMemo(
    () =>
      reviewCount > 0
        ? Math.ceil(reviewCount / REVIEW_PAGE_SIZE)
        : reviewNext || reviewPrevious
          ? reviewPage + (reviewNext ? 1 : 0)
          : 1,
    [reviewCount, reviewNext, reviewPage, reviewPrevious]
  )

  const handleReviewEdit = useCallback(
    (reviewId: number) => {
      if (!canManage) {
        return
      }

      const review = reviews.find((item) => item.reviewId === reviewId)

      if (!review) {
        return
      }

      setReviewSubmitError(null)
      setReviewModal({
        isOpen: true,
        mode: 'edit',
        reviewId: review.reviewId,
        initialRating: review.rating,
        initialContent: review.content,
        initialImageSrc: review.imageUrl,
        initialCreatedAt: review.createdAt,
      })
    },
    [canManage, reviews]
  )

  const handleReviewDelete = useCallback(
    (reviewId: number) => {
      if (!canManage) {
        return
      }

      setReviewSubmitError(null)
      setReviewDeleteError(null)
      setReviewModal({
        isOpen: true,
        mode: 'delete',
        reviewId,
        initialRating: 0,
        initialContent: '',
        initialImageSrc: null,
        initialCreatedAt: undefined,
      })
    },
    [canManage]
  )

  const handleReviewClose = useCallback(() => {
    if (isReviewSubmitting || isReviewDeleting) {
      return
    }

    setReviewSubmitError(null)
    setReviewDeleteError(null)
    setReviewModal((prev) => ({ ...prev, isOpen: false }))
  }, [isReviewDeleting, isReviewSubmitting])

  const handleReviewSubmit = useCallback(
    async ({ rating, content, imageUrl, imageFile }: ReviewSubmitPayload) => {
      if (!canManage) {
        return
      }

      const reviewId = reviewModal.reviewId
      const trimmedContent = content.trim()

      if (rating < 1 || rating > 5) {
        setReviewSubmitError('평점을 선택해주세요.')
        return
      }

      if (!trimmedContent) {
        setReviewSubmitError('리뷰 내용을 입력해주세요.')
        return
      }

      if (!reviewId) {
        setReviewSubmitError('수정할 리뷰 정보를 찾을 수 없습니다.')
        return
      }

      const body: UpdateReviewRequest = {
        rating,
        content: trimmedContent,
      }

      if (imageUrl && !imageUrl.startsWith('blob:')) {
        body.image_url = imageUrl
      }

      setIsReviewSubmitting(true)
      setReviewSubmitError(null)

      try {
        if (imageFile) {
          try {
            body.image_url = await uploadReviewImage(imageFile)
          } catch (error) {
            setReviewSubmitError(
              isAxiosError(error)
                ? '이미지 업로드 URL 발급에 실패했습니다.'
                : '이미지 업로드에 실패했습니다.'
            )
            return
          }
        }

        await updateReview(reviewId, body)
        setReviewModal((prev) => ({ ...prev, isOpen: false }))
        await fetchMyReviews(reviewPage)
      } catch {
        setReviewSubmitError(
          '리뷰 수정에 실패했습니다. 잠시 후 다시 시도해주세요.'
        )
      } finally {
        setIsReviewSubmitting(false)
      }
    },
    [canManage, fetchMyReviews, reviewModal.reviewId, reviewPage]
  )

  const handleReviewDeleteConfirm = useCallback(async () => {
    if (!canManage || isReviewDeleting || reviewModal.reviewId === null) {
      return
    }

    setIsReviewDeleting(true)
    setReviewDeleteError(null)

    try {
      await deleteReview(reviewModal.reviewId)
      setReviewModal((prev) => ({ ...prev, isOpen: false }))

      const nextPage =
        reviews.length === 1 && reviewPage > 1 ? reviewPage - 1 : reviewPage

      if (nextPage !== reviewPage) {
        setReviewPage(nextPage)
      } else {
        await fetchMyReviews(nextPage)
      }
    } catch (error) {
      setReviewDeleteError(getDeleteReviewErrorMessage(error))
    } finally {
      setIsReviewDeleting(false)
    }
  }, [
    canManage,
    fetchMyReviews,
    isReviewDeleting,
    reviewModal.reviewId,
    reviewPage,
    reviews.length,
  ])

  return {
    reviews,
    reviewCount,
    reviewPage,
    reviewTotalPages,
    isReviewLoading,
    reviewError,
    reviewModal,
    isReviewSubmitting,
    isReviewDeleting,
    reviewSubmitError,
    reviewDeleteError,
    setReviewPage,
    fetchMyReviews,
    handleReviewEdit,
    handleReviewDelete,
    handleReviewClose,
    handleReviewSubmit,
    handleReviewDeleteConfirm,
  }
}
