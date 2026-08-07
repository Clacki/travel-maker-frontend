'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { PageFadeIn } from '@/components/common/PageFadeIn'
import { ReviewModal } from '@/components/common/ReviewModal'
import { WithdrawModal } from '@/components/common/WithdrawModal'
import { Modal } from '@/components/common/modal/Modal'
import { Button } from '@/components/common/button'
import { ErrorState } from '@/components/common/status'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { MyPageSkeleton } from '@/features/mypage/components/MyPageSkeleton'
import { css } from '@/styled-system/css'

import { logout, withdrawUser } from '@/features/auth/api/authApi'
import { FollowListModal } from '../FollowListModal/FollowListModal'
import { useMyBookmarks } from '../../hooks/useMyBookmarks'
import { useMyPageOwner } from '../../hooks/useMyPageOwner'
import { useMyReviews } from '../../hooks/useMyReviews'
import { useMyTrips } from '../../hooks/useMyTrips'
import { useMyTravelTypeResult } from '../../hooks/useMyTravelTypeResult'
import { MyBookmarksSection } from '../MyBookmarksSection'
import { MyReviewsSection } from '../MyReviewsSection'
import { MyTravelTypeResult } from '../MyTravelTypeResult'
import { MyTripsSection } from '../MyTripsSection'
import { ProfileCard } from '../ProfileCard'
import type { TabType } from '../ProfileTabs'
import { ProfileTabs } from '../ProfileTabs'
import { loadCurrentUserProfile } from '@/features/auth/utils/currentUserProfile'

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
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const {
    user,
    isOwner,
    isProfileLoading,
    profileError,
    canManageBookmarks,
    initialIsFollowing,
  } = useMyPageOwner(userId)

  useEffect(() => {
    if (!isAuthInitialized || !isLoggedIn || !isOwner) return

    void loadCurrentUserProfile()
  }, [isAuthInitialized, isLoggedIn, isOwner])

  const [activeTab, setActiveTab] = useState<TabType>(() =>
    userId === '1' || userId === 'me' ? 'bookmark' : 'review'
  )
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [followModal, setFollowModal] = useState<{
    type: 'followers' | 'following'
    isOpen: boolean
  }>({ type: 'followers', isOpen: false })
  const [followingOverride] = useState<boolean | null>(null)
  const isFollowing = followingOverride ?? initialIsFollowing
  const [isFollowLoading] = useState(false)
  const [localFollowerCount] = useState<number | null>(null)

  const {
    bookmarkCount,
    bookmarkPage,
    bookmarkTotalPages,
    isBookmarkLoading,
    bookmarks,
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
    enabled: isOwner
      ? activeTab === 'review'
      : isAuthInitialized && activeTab === 'review',
    canManage: false,
    isAuthInitialized,
    isLoggedIn,
    targetUserId: isOwner ? undefined : user.id,
  })

  const {
    trips,
    tripCount,
    deletingTripId,
    isTripDeleting,
    tripDeleteError,
    handleTripDeleteRequest,
    handleTripDeleteCancel,
    handleTripDeleteConfirm,
  } = useMyTrips({
    enabled: isOwner && isAuthInitialized && isLoggedIn,
    isAuthInitialized,
    isLoggedIn,
    nickname: user.nickname,
  })

  const travelTypeResultState = useMyTravelTypeResult({
    isAuthInitialized,
    isLoggedIn,
    isTabActive: activeTab === 'test',
  })

  if (!isAuthInitialized || isProfileLoading) {
    return <MyPageSkeleton />
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

  const handleWithdraw = async (reason: string) => {
    await withdrawUser(reason)
    try {
      await logout()
    } catch {
      // 탈퇴 후 로그아웃 실패해도 진행
    }
    clearAuth()
    router.replace('/')
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setBookmarkPage(1)
    setReviewPage(1)
  }

  // TODO: 리뷰 수정/삭제 API가 여러 feature에서 사용되므로 reviews 도메인으로 분리 검토.
  return (
    <PageFadeIn>
      <div className={containerStyle}>
        <ProfileCard
          user={{
            ...user,
            follower_count: localFollowerCount ?? user.follower_count,
          }}
          isMyProfile={isOwner}
          canEdit={false}
          canManageAccount={false}
          isFollowing={isFollowing}
          isFollowLoading={isFollowLoading}
        />

        <div className={tabContentStyle}>
          <ProfileTabs
            isMyProfile={isOwner}
            bookmarkCount={bookmarkCount}
            reviewCount={displayedReviewCount}
            tripCount={tripCount}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          {activeTab === 'bookmark' && (
            <MyBookmarksSection
              bookmarks={bookmarks}
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
              canManage={false}
              onPageChange={setReviewPage}
              onRetry={() => void fetchMyReviews(reviewPage)}
              onEditReview={handleReviewEdit}
              onDeleteReview={handleReviewDelete}
            />
          )}

          {activeTab === 'trip' && (
            <MyTripsSection
              trips={trips}
              canManage={false}
              onCreateTrip={() => router.push(ROUTES.TRIP_CREATE)}
              onDeleteTrip={isOwner ? handleTripDeleteRequest : undefined}
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
            reviewModal.mode === 'delete'
              ? isReviewDeleting
              : isReviewSubmitting
          }
          errorMessage={
            reviewModal.mode === 'delete'
              ? reviewDeleteError
              : reviewSubmitError
          }
          onSubmit={handleReviewSubmit}
          onDelete={handleReviewDeleteConfirm}
        />

        <Modal
          isOpen={deletingTripId !== null}
          onClose={handleTripDeleteCancel}
          title="여행 코스 삭제"
          size="sm"
          closeOnOverlayClick={!isTripDeleting}
          footer={
            <div className={css({ display: 'flex', gap: '2' })}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTripDeleteCancel}
                disabled={isTripDeleting}
              >
                취소
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => void handleTripDeleteConfirm()}
                disabled={isTripDeleting}
              >
                {isTripDeleting ? '삭제 중...' : '삭제'}
              </Button>
            </div>
          }
        >
          <p className={css({ color: 'text.primary', fontSize: 'sm' })}>
            이 여행 코스를 삭제하면 복구할 수 없습니다. 정말 삭제하시겠어요?
          </p>
          {tripDeleteError ? (
            <p
              className={css({
                mt: '3',
                color: 'red.500',
                fontSize: 'sm',
              })}
            >
              {tripDeleteError}
            </p>
          ) : null}
        </Modal>
      </div>
    </PageFadeIn>
  )
}
