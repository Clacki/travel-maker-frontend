'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { isAxiosError } from 'axios'

import { ReviewModal } from '@/components/common/ReviewModal'
import { WithdrawModal } from '@/components/common/WithdrawModal'
import { ErrorState } from '@/components/common/status'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { MyPageSkeleton } from '@/features/mypage/components/MyPageSkeleton'
import { css } from '@/styled-system/css'

import { followUser, unfollowUser } from '../../api/followApi'
import { FollowListModal } from '../FollowListModal/FollowListModal'
import {
  getTravelTypeResult,
  normalizeTravelTypeResult,
} from '../../api/travelTypeResultApi'
import { mockMyTripCourses } from '../../data/myTripsMock'
import { useMyBookmarks } from '../../hooks/useMyBookmarks'
import { useMyPageOwner } from '../../hooks/useMyPageOwner'
import { useMyReviews } from '../../hooks/useMyReviews'
import { MyBookmarksSection } from '../MyBookmarksSection'
import { MyReviewsSection } from '../MyReviewsSection'
import {
  MyTravelTypeResult,
  type TravelTypeResultState,
} from '../MyTravelTypeResult'
import { MyTripsSection } from '../MyTripsSection'
import { ProfileCard } from '../ProfileCard'
import type { TabType } from '../ProfileTabs'
import { ProfileTabs } from '../ProfileTabs'

interface MyPageContentProps {
  userId: string
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

export function MyPageContent({ userId }: MyPageContentProps) {
  const router = useRouter()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized)
  const {
    user,
    isOwner,
    isProfileLoading,
    profileError,
    canEditProfile,
    canManageAccount,
    canManageReviews,
    canManageBookmarks,
  } = useMyPageOwner(userId)

  const [activeTab, setActiveTab] = useState<TabType>('bookmark')
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [followModal, setFollowModal] = useState<{
    type: 'followers' | 'following'
    isOpen: boolean
  }>({ type: 'followers', isOpen: false })
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [localFollowerCount, setLocalFollowerCount] = useState<number | null>(
    null
  )

  const {
    bookmarkCount,
    bookmarkPage,
    bookmarkTotalPages,
    isBookmarkLoading,
    paginatedBookmarks,
    setBookmarkPage,
    handleLikeToggle,
  } = useMyBookmarks()

  const {
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
  } = useMyReviews({
    enabled: isOwner ? activeTab === 'review' : isAuthInitialized && isLoggedIn,
    canManage: canManageReviews,
    isAuthInitialized,
    isLoggedIn,
    targetUserId: isOwner ? undefined : user.id,
  })

  const [travelTypeResultState, setTravelTypeResultState] =
    useState<TravelTypeResultState>({ status: 'loading' })

  useEffect(() => {
    if (!isAuthInitialized || !isLoggedIn || activeTab !== 'test') return
    // 이미 로드된 경우 재요청하지 않음
    if (travelTypeResultState.status !== 'loading') return

    getTravelTypeResult()
      .then((response) => {
        const normalized = normalizeTravelTypeResult(response)
        if (!normalized) {
          setTravelTypeResultState({ status: 'empty' })
        } else {
          setTravelTypeResultState({ status: 'success', data: normalized })
        }
      })
      .catch((error: unknown) => {
        const status = isAxiosError(error) ? error.response?.status : undefined
        if (status === 404) {
          setTravelTypeResultState({ status: 'empty' })
        } else {
          setTravelTypeResultState({
            status: 'error',
            message: '성향 테스트 결과를 불러오지 못했어요.',
          })
        }
      })
  }, [isAuthInitialized, isLoggedIn, activeTab, travelTypeResultState.status])

  useEffect(() => {
    if (!isAuthInitialized) {
      return
    }

    if (!isLoggedIn) {
      router.replace('/?showLogin=true')
    }
  }, [isAuthInitialized, isLoggedIn, router])

  if (!isAuthInitialized || isProfileLoading) {
    return <MyPageSkeleton />
  }

  if (!isLoggedIn) {
    return null
  }

  if (profileError === 'not_found') {
    return <ErrorState title="존재하지 않는 유저예요" description="" />
  }

  if (profileError === 'error') {
    return (
      <ErrorState
        title="프로필을 불러오지 못했어요"
        description="잠시 후 다시 시도해주세요."
      />
    )
  }

  const displayedReviewCount =
    activeTab === 'review' || reviewCount > 0 ? reviewCount : user.review_count

  const handleFollowToggle = async () => {
    if (isFollowLoading) return
    setIsFollowLoading(true)
    try {
      if (isFollowing) {
        await unfollowUser(user.id)
        setIsFollowing(false)
        setLocalFollowerCount((prev) =>
          Math.max(0, (prev ?? user.follower_count) - 1)
        )
      } else {
        await followUser(user.id)
        setIsFollowing(true)
        setLocalFollowerCount((prev) => (prev ?? user.follower_count) + 1)
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status
        if (status === 409) {
          setIsFollowing(true)
        } else if (status === 404) {
          setIsFollowing(false)
        }
      }
    } finally {
      setIsFollowLoading(false)
    }
  }

  const handleEditProfile = () => {
    router.push(`/profile/${userId}/edit`)
  }

  const handleWithdraw = (_reason: string) => {
    // TODO: 회원 탈퇴 API 연동
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setBookmarkPage(1)
    setReviewPage(1)
  }

  // TODO: 리뷰 수정/삭제 API가 여러 feature에서 사용되므로 reviews 도메인으로 분리 검토.
  return (
    <div className={containerStyle}>
      <ProfileCard
        user={{
          ...user,
          follower_count: localFollowerCount ?? user.follower_count,
        }}
        isMyProfile={isOwner}
        canEdit={canEditProfile}
        canManageAccount={canManageAccount}
        isFollowing={isFollowing}
        isFollowLoading={isFollowLoading}
        onEditClick={handleEditProfile}
        onWithdrawClick={() => setIsWithdrawOpen(true)}
        onFollowToggle={handleFollowToggle}
        onFollowerClick={() =>
          setFollowModal({ type: 'followers', isOpen: true })
        }
        onFollowingClick={() =>
          setFollowModal({ type: 'following', isOpen: true })
        }
      />

      <div className={tabContentStyle}>
        <ProfileTabs
          isMyProfile={isOwner}
          bookmarkCount={bookmarkCount}
          reviewCount={displayedReviewCount}
          tripCount={mockMyTripCourses.length}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {activeTab === 'bookmark' && (
          <MyBookmarksSection
            bookmarks={paginatedBookmarks}
            currentPage={bookmarkPage}
            totalPages={bookmarkTotalPages}
            isLoading={isBookmarkLoading}
            canManage={canManageBookmarks}
            onPageChange={setBookmarkPage}
            onExploreClick={() => router.push(ROUTES.EXPLORE)}
            onLikeToggle={handleLikeToggle}
          />
        )}

        {activeTab === 'review' && (
          <MyReviewsSection
            reviews={reviews}
            currentPage={reviewPage}
            totalPages={reviewTotalPages}
            isLoading={isReviewLoading}
            errorMessage={reviewError}
            canManage={canManageReviews}
            onPageChange={setReviewPage}
            onRetry={() => void fetchMyReviews(reviewPage)}
            onEditReview={handleReviewEdit}
            onDeleteReview={handleReviewDelete}
          />
        )}

        {activeTab === 'trip' && (
          <MyTripsSection
            trips={mockMyTripCourses}
            canManage={isOwner}
            onCreateTrip={() => router.push(ROUTES.TRIP_CREATE)}
          />
        )}

        {activeTab === 'test' && (
          <MyTravelTypeResult
            state={travelTypeResultState}
            onRetryTest={() => router.push(ROUTES.TEST)}
          />
        )}
      </div>

      <FollowListModal
        isOpen={followModal.isOpen}
        userId={user.id}
        type={followModal.type}
        onClose={() => setFollowModal((prev) => ({ ...prev, isOpen: false }))}
      />

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
