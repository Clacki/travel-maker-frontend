'use client'

import type { ReviewModalMode } from '@/components/common/ReviewModal'
import { ReviewModal } from '@/components/common/ReviewModal'
import { WithdrawModal } from '@/components/common/WithdrawModal'
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/components/common/status'
import { Pagination } from '@/components/ui/Pagination/Pagination'
import { PlaceCard } from '@/components/ui/PlaceCard'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'
import { getBookmarks, deleteBookmark } from '@/features/mypage/api/bookmarkApi'
import { mockMyProfile } from '@/mocks/data/mypage-data'
import {
  getDefaultEditableProfile,
  useProfileStore,
} from '@/store/profileStore'
import { css } from '@/styled-system/css'
import { isAxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  deleteReview,
  getMyReviews,
  updateReview,
  type MyReviewItem,
  type MyReviewsResponse,
  type UpdateReviewRequest,
} from '../../api/myReviewsApi'
import { mapProfileTagIdsToUserTags } from '../../lib/profile-tags'
import { ProfileCard } from '../ProfileCard'
import type { TabType } from '../ProfileTabs'
import { ProfileTabs } from '../ProfileTabs'

// 북마크 API 응답 구조에 맞춘 인터페이스 정의
interface BookmarkPlace {
  id: number
  place_name: string
  rating_avg: string
  main_image: string | null
}

interface BookmarkResponseItem {
  id: number
  place: BookmarkPlace
  created_at: string
}

interface MyPageContentProps {
  userId: string
}

const BOOKMARK_PAGE_SIZE = 8
const REVIEW_PAGE_SIZE = 8

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
    imageUrl: null,
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

const loadingStyle = css({
  textAlign: 'center',
  py: '8',
  color: 'text.secondary',
})

export function MyPageContent({ userId }: MyPageContentProps) {
  const router = useRouter()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized)
  const currentUserProfile = useUserProfileStore((state) => state.userProfile)

  const isMyProfile = true

  const fallbackProfile = useMemo(() => getDefaultEditableProfile(), [])
  const profile = useProfileStore((state) =>
    state.getProfile(userId, fallbackProfile)
  )

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
  const [isReviewDeleting, setIsReviewDeleting] = useState(false)
  const [reviewDeleteError, setReviewDeleteError] = useState<string | null>(
    null
  )
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [bookmarks, setBookmarks] = useState<BookmarkResponseItem[]>([])
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(true)
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
    let cancelled = false

    getBookmarks()
      .then((data) => {
        if (!cancelled) {
          // bookmarkApi.ts의 리턴 타입이 BookmarkResponseItem[]와 호환된다고 가정
          setBookmarks(data as unknown as BookmarkResponseItem[])
          setIsBookmarkLoading(false)
        }
      })
      .catch((error) => {
        console.error('북마크 목록 조회 실패', error)
        if (!cancelled) {
          setIsBookmarkLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

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

  const isCurrentUserPage =
    !!currentUserProfile &&
    (userId === currentUserProfile?.id || userId === 'me')
  const user = {
    ...mockMyProfile,
    id: isCurrentUserPage ? Number(currentUserProfile?.id) : mockMyProfile.id,
    nickname: isCurrentUserPage
      ? (currentUserProfile?.nickname ?? profile.nickname)
      : profile.nickname,
    bio: isCurrentUserPage ? (currentUserProfile?.bio ?? '') : profile.bio,
    email: isCurrentUserPage
      ? (currentUserProfile?.email ?? '')
      : mockMyProfile.email,
    profile_img_url: isCurrentUserPage
      ? (currentUserProfile?.profileImageUrl ?? '')
      : mockMyProfile.profile_img_url,
    follower_count: isCurrentUserPage
      ? (currentUserProfile?.followerCount ?? 0)
      : 0,
    following_count: isCurrentUserPage
      ? (currentUserProfile?.followingCount ?? 0)
      : 0,
    bookmark_count: isCurrentUserPage
      ? (currentUserProfile?.bookmarkCount ?? mockMyProfile.bookmark_count)
      : mockMyProfile.bookmark_count,
    review_count: isCurrentUserPage
      ? (currentUserProfile?.reviewCount ?? mockMyProfile.review_count)
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
  }

  const handleLikeToggle = async (placeId: number) => {
    try {
      await deleteBookmark(placeId)
      setBookmarks((prev) => prev.filter((b) => b.place.id !== placeId))
    } catch (error) {
      console.error('북마크 해제 실패', error)
    }
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
      initialImageSrc: review.imageUrl,
      initialCreatedAt: review.createdAt,
    })
  }

  const handleReviewDelete = (reviewId: number) => {
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
  }

  const handleReviewClose = () => {
    if (isReviewSubmitting || isReviewDeleting) {
      return
    }

    setReviewSubmitError(null)
    setReviewDeleteError(null)
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

  const handleReviewDeleteConfirm = async () => {
    if (isReviewDeleting || reviewModal.reviewId === null) {
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
          (isBookmarkLoading ? (
            <p className={loadingStyle}>로딩 중...</p>
          ) : bookmarks.length > 0 ? (
            <>
              <div className={gridStyle}>
                {paginatedBookmarks.map((bookmark) => (
                  <PlaceCard
                    key={bookmark.place.id}
                    variant="bookmark"
                    placeId={bookmark.place.id}
                    placeName={bookmark.place.place_name}
                    imageUrl={bookmark.place.main_image || undefined}
                    rating={Number(bookmark.place.rating_avg)}
                    isLiked={true}
                    onLikeToggle={() => handleLikeToggle(bookmark.place.id)}
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
                    placeName={review.placeName}
                    description={review.content}
                    rating={review.rating}
                    onEditClick={() => handleReviewEdit(review.reviewId)}
                    onDeleteClick={() => handleReviewDelete(review.reviewId)}
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
            description="나의 여행 성향을 알아보세요."
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
        isSubmitting={
          reviewModal.mode === 'delete' ? isReviewDeleting : isReviewSubmitting
        }
        errorMessage={
          reviewModal.mode === 'delete' ? reviewDeleteError : reviewSubmitError
        }
        onSubmit={handleReviewSubmit}
        onDelete={handleReviewDeleteConfirm}
      />
    </div>
  )
}
