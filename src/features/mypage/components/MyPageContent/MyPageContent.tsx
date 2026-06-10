'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { css } from '@/styled-system/css'
import { ROUTES } from '@/constants/routes'
import { ProfileCard } from '../ProfileCard'
import { ProfileTabs } from '../ProfileTabs'
import type { TabType } from '../ProfileTabs'
import { PlaceCard } from '@/components/ui/PlaceCard'
import { Pagination } from '@/components/ui/Pagination/Pagination'
import { ReviewModal } from '@/components/common/ReviewModal'
import type { ReviewModalMode } from '@/components/common/ReviewModal'
import { WithdrawModal } from '@/components/common/WithdrawModal'
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/components/common/status'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { mockMyProfile, mockBookmarks } from '@/mocks/data/mypage-data'
import { mapProfileTagIdsToUserTags } from '../../lib/profile-tags'
import {
  getDefaultEditableProfile,
  useProfileStore,
} from '@/store/profileStore'
import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'
import {
  getMyReviews,
  updateReview,
  type MyReviewItem,
  type MyReviewsResponse,
  type UpdateReviewRequest,
} from '../../api/myReviewsApi'

interface MyPageContentProps {
  userId: string
}

const BOOKMARK_PAGE_SIZE = 8
const REVIEW_PAGE_SIZE = 4

type MyReviewCardItem = {
  reviewId: number
  placeId: number
  placeName: string
  rating: number
  content: string
  imageUrl: string | null
  createdAt: string
  updatedAt: string
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
    // TODO: 백엔드 리뷰 목록 응답에 이미지 URL이 추가되면 PlaceCard imageUrl로 매핑한다.
    imageUrl: null,
    createdAt: review.created_at,
    updatedAt: review.updated_at,
  }
}

const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '6',
  maxW: '1120px',
  mx: 'auto',
  px: { base: '4', md: '6' },
  py: { base: '6', md: '8' },
})

const tabContentStyle = css({
  bg: 'bg.surface',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
  p: { base: '4', md: '6' },
})

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

export function MyPageContent({ userId }: MyPageContentProps) {
  const router = useRouter()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized)

  // TODO: 실제 API 연동 후 세션의 현재 유저 ID와 비교하도록 교체
  const isMyProfile = true

  const fallbackProfile = useMemo(() => getDefaultEditableProfile(), [])
  const profile = useProfileStore((state) =>
    state.getProfile(userId, fallbackProfile)
  )
  const currentUserProfile = useUserProfileStore((state) => state.userProfile)
  const [activeTab, setActiveTab] = useState<TabType>('bookmark')
  const [bookmarkPage, setBookmarkPage] = useState(1)
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
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean
    mode: ReviewModalMode
    reviewId: number | null
    initialRating: number
    initialContent: string
    initialImageSrc: string | null
    initialCreatedAt?: string
  }>({
    isOpen: false,
    mode: 'create',
    reviewId: null,
    initialRating: 0,
    initialContent: '',
    initialImageSrc: null,
    initialCreatedAt: undefined,
  })

  const fetchMyReviews = useCallback(
    async (page: number) => {
      if (!isAuthInitialized || !isLoggedIn) {
        return
      }

      setIsReviewLoading(true)
      setReviewError(null)

      try {
        const response = await getMyReviews({
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
    [isAuthInitialized, isLoggedIn]
  )

  useEffect(() => {
    if (!isAuthInitialized) {
      return
    }

    if (!isLoggedIn) {
      router.replace('/?showLogin=true')
    }
  }, [isAuthInitialized, isLoggedIn, router])

  useEffect(() => {
    if (activeTab !== 'review') {
      return
    }

    const timeoutId = window.setTimeout(() => {
      void fetchMyReviews(reviewPage)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [activeTab, fetchMyReviews, reviewPage])

  if (!isAuthInitialized) {
    return <LoadingState />
  }

  if (!isLoggedIn) {
    return null
  }

  const bookmarks = mockBookmarks

  const isCurrentUserPage =
    !!currentUserProfile &&
    (userId === currentUserProfile.id || userId === 'me')
  const user = {
    ...mockMyProfile,
    id: isCurrentUserPage ? Number(currentUserProfile.id) : mockMyProfile.id,
    nickname: isCurrentUserPage
      ? currentUserProfile.nickname
      : profile.nickname,
    bio: isCurrentUserPage ? currentUserProfile.bio || '' : profile.bio,
    email: isCurrentUserPage
      ? currentUserProfile.email || ''
      : mockMyProfile.email,
    profile_img_url: isCurrentUserPage
      ? currentUserProfile.profileImageUrl || ''
      : mockMyProfile.profile_img_url,
    bookmark_count: isCurrentUserPage
      ? (currentUserProfile.bookmarkCount ?? mockMyProfile.bookmark_count)
      : mockMyProfile.bookmark_count,
    review_count: isCurrentUserPage
      ? (currentUserProfile.reviewCount ?? mockMyProfile.review_count)
      : mockMyProfile.review_count,
    tags: mapProfileTagIdsToUserTags(profile.tagIds),
  }
  const displayedReviewCount =
    activeTab === 'review' || reviewCount > 0 ? reviewCount : user.review_count

  const bookmarkTotalPages = Math.ceil(bookmarks.length / BOOKMARK_PAGE_SIZE)
  const reviewTotalPages =
    reviewCount > 0
      ? Math.ceil(reviewCount / REVIEW_PAGE_SIZE)
      : reviewNext || reviewPrevious
        ? reviewPage + (reviewNext ? 1 : 0)
        : 1

  const paginatedBookmarks = bookmarks.slice(
    (bookmarkPage - 1) * BOOKMARK_PAGE_SIZE,
    bookmarkPage * BOOKMARK_PAGE_SIZE
  )

  const handleEditProfile = () => {
    router.push(`/profile/${userId}/edit`)
  }

  const handleWithdraw = (reason: string) => {
    console.log('withdraw', reason)
    // TODO: 탈퇴 API 호출
  }

  const handleLikeToggle = (placeId: number) => {
    console.log('toggle bookmark', placeId)
    // TODO: 북마크 해제 API 호출
  }

  const handleReviewEdit = (reviewId: number) => {
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
      // TODO: 백엔드 리뷰 목록 응답에 이미지 URL이 추가되면 수정 모달 초기 이미지로 전달한다.
      initialImageSrc: review.imageUrl,
      initialCreatedAt: review.createdAt,
    })
  }

  const handleReviewDelete = (reviewId: number) => {
    setReviewSubmitError(null)
    setReviewModal({
      isOpen: true,
      mode: 'delete',
      reviewId,
      initialRating: 0,
      initialContent: '',
      initialImageSrc: null,
      initialCreatedAt: undefined,
    })
  }

  const handleReviewClose = () => {
    if (isReviewSubmitting) {
      return
    }

    setReviewSubmitError(null)
    setReviewModal((prev) => ({ ...prev, isOpen: false }))
  }

  const handleReviewSubmit = async (
    rating: number,
    content: string,
    imageUrl?: string
  ) => {
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
      setReviewSubmitError('수정할 리뷰 정보를 찾지 못했습니다.')
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
  }

  const handleReviewDeleteConfirm = () => {
    console.log('review delete', reviewModal.reviewId)
    // TODO: 리뷰 삭제 API 호출
    void fetchMyReviews(reviewPage)
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setBookmarkPage(1)
    setReviewPage(1)
  }

  return (
    <div className={containerStyle}>
      <ProfileCard
        user={user}
        isMyProfile={isMyProfile}
        onEditClick={handleEditProfile}
        onWithdrawClick={() => setIsWithdrawOpen(true)}
      />

      <div className={tabContentStyle}>
        <ProfileTabs
          isMyProfile={isMyProfile}
          bookmarkCount={bookmarks.length}
          reviewCount={displayedReviewCount}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {activeTab === 'bookmark' &&
          (bookmarks.length > 0 ? (
            <>
              <div className={gridStyle}>
                {paginatedBookmarks.map((bookmark) => (
                  <PlaceCard
                    key={bookmark.place_id}
                    variant="bookmark"
                    placeId={bookmark.place_id}
                    placeName={bookmark.place_name}
                    imageUrl={bookmark.image_url || undefined}
                    rating={bookmark.rating}
                    isLiked={true}
                    onLikeToggle={handleLikeToggle}
                  />
                ))}
              </div>
              <Pagination
                currentPage={bookmarkPage}
                totalPages={bookmarkTotalPages}
                onPageChange={setBookmarkPage}
              />
            </>
          ) : (
            <EmptyState
              title="첫 번째 여행지를 저장해보세요"
              description="지금 마음에 드는 곳을 찾아보세요."
              actionLabel="여행지 찾아가기"
              onAction={() => router.push(ROUTES.EXPLORE)}
            />
          ))}

        {activeTab === 'review' &&
          (isReviewLoading ? (
            <LoadingState
              title="리뷰를 불러오는 중이에요"
              description="작성한 리뷰 목록을 확인하고 있어요."
            />
          ) : reviewError ? (
            <ErrorState
              title="리뷰 목록을 불러오지 못했어요"
              description={reviewError}
              actionLabel="다시 시도"
              onAction={() => void fetchMyReviews(reviewPage)}
            />
          ) : reviews.length > 0 ? (
            <>
              <div className={gridStyle}>
                {reviews.map((review) => (
                  <PlaceCard
                    key={review.reviewId}
                    variant="review"
                    placeId={review.placeId}
                    reviewId={review.reviewId}
                    placeName={review.placeName}
                    description={review.content}
                    imageUrl={review.imageUrl ?? undefined}
                    rating={review.rating}
                    onEditClick={handleReviewEdit}
                    onDeleteClick={handleReviewDelete}
                  />
                ))}
              </div>
              <Pagination
                currentPage={reviewPage}
                totalPages={reviewTotalPages}
                onPageChange={setReviewPage}
              />
            </>
          ) : (
            <EmptyState
              title="작성한 리뷰가 없어요"
              description="여행지를 방문하고 리뷰를 남겨보세요."
            />
          ))}

        {activeTab === 'test' && (
          <EmptyState
            title="아직 성향 테스트를 하지 않았어요"
            description="나의 여행 성향을 찾아보세요."
            actionLabel="테스트 하러 가기"
            onAction={() => router.push('/test')}
          />
        )}
      </div>

      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        onWithdraw={handleWithdraw}
      />

      <ReviewModal
        key={`${reviewModal.mode}-${reviewModal.reviewId}`}
        isOpen={reviewModal.isOpen}
        onClose={handleReviewClose}
        mode={reviewModal.mode}
        initialRating={reviewModal.initialRating}
        initialContent={reviewModal.initialContent}
        initialImageSrc={reviewModal.initialImageSrc}
        initialCreatedAt={reviewModal.initialCreatedAt}
        isSubmitting={isReviewSubmitting}
        errorMessage={reviewSubmitError}
        onSubmit={handleReviewSubmit}
        onDelete={handleReviewDeleteConfirm}
      />
    </div>
  )
}
