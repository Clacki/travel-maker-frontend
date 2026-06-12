'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { ReviewModal } from '@/components/common/ReviewModal'
import { WithdrawModal } from '@/components/common/WithdrawModal'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { MyPageSkeleton } from '@/features/mypage/components/MyPageSkeleton'
import { css } from '@/styled-system/css'

import { normalizeTravelTypeResult } from '../../api/travelTypeResultApi'
import { mockTravelTypeResultResponse } from '../../data/travelTypeResultMock'
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
    canEditProfile,
    canManageAccount,
    canManageReviews,
    canManageBookmarks,
  } = useMyPageOwner(userId)

  const [activeTab, setActiveTab] = useState<TabType>('bookmark')
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)

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
    enabled: activeTab === 'review',
    canManage: canManageReviews,
    isAuthInitialized,
    isLoggedIn,
  })

  const normalizedTravelTypeResult = useMemo(
    () => normalizeTravelTypeResult(mockTravelTypeResultResponse),
    []
  )
  const travelTypeResultState = useMemo<TravelTypeResultState>(() => {
    if (!normalizedTravelTypeResult) {
      return { status: 'empty' }
    }

    return { status: 'success', data: normalizedTravelTypeResult }
  }, [normalizedTravelTypeResult])

  useEffect(() => {
    if (!isAuthInitialized) {
      return
    }

    if (!isLoggedIn) {
      router.replace('/?showLogin=true')
    }
  }, [isAuthInitialized, isLoggedIn, router])

  if (!isAuthInitialized) {
    return <MyPageSkeleton />
  }

  if (!isLoggedIn) {
    return null
  }

  const displayedReviewCount =
    activeTab === 'review' || reviewCount > 0 ? reviewCount : user.review_count

  const handleEditProfile = () => {
    router.push(`/profile/${userId}/edit`)
  }

  const handleWithdraw = (reason: string) => {
    console.log('withdraw', reason)
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
        user={user}
        isMyProfile={isOwner}
        canEdit={canEditProfile}
        canManageAccount={canManageAccount}
        onEditClick={handleEditProfile}
        onWithdrawClick={() => setIsWithdrawOpen(true)}
      />

      <div className={tabContentStyle}>
        <ProfileTabs
          isMyProfile={isOwner}
          bookmarkCount={bookmarkCount}
          reviewCount={displayedReviewCount}
          tripCount={0}
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
