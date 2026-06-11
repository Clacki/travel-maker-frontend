'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { ReviewModal } from '@/components/common/ReviewModal'
import { WithdrawModal } from '@/components/common/WithdrawModal'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { MyPageSkeleton } from '@/features/mypage/components/MyPageSkeleton'
import { css } from '@/styled-system/css'

import {
  normalizeTravelTypeResult,
  type TravelTypeResultResponse,
} from '../../api/travelTypeResultApi'
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

const mockTravelTypeResultResponse: TravelTypeResultResponse = {
  saved: true,
  travel_type_id: 4,
  type_key: 'SEA-AF',
  name: '자유로운 바다 탐험가',
  description:
    '계획보다는 즉흥, 도시보다는 자연, 혼자만의 시간을 사랑하며 바다 앞에서 가장 큰 충전을 얻는 타입이에요.',
  image_url: '',
  type_tags: ['액티비티형', '혼자형', '자연형', '바다', '즉흥여행', '사진찍기'],
  detail_cards: [
    {
      title: '여행 리듬',
      description: '빽빽한 일정 대신 여백이 있는 동선을 선호해요.',
    },
    {
      title: '좋아하는 장소',
      description: '시야가 트인 바다, 산책로, 조용한 전망대를 좋아해요.',
    },
    {
      title: '동행 스타일',
      description: '함께하더라도 각자의 시간을 존중하는 여행에 잘 맞아요.',
    },
    {
      title: '추천 포인트',
      description: '일출과 노을을 볼 수 있는 코스를 넣으면 만족도가 높아요.',
    },
  ],
  result_vector: [
    { label: '액티비티형', value: 88 },
    { label: '혼자형', value: 76 },
    { label: '자연형', value: 82 },
    { label: '바다 선호', value: 91 },
  ],
  destinations: [
    {
      place_id: 126508,
      place_name: '부산',
      description: '바다와 도시 산책을 함께 즐길 수 있는 여행지',
      image_url: '',
      tags: ['바다', '도시'],
      match_rate: 95,
    },
    {
      place_id: 125895,
      place_name: '제주',
      description: '즉흥 드라이브와 자연 풍경이 잘 어울리는 섬',
      image_url: '',
      tags: ['자연', '드라이브'],
      match_rate: 91,
    },
    {
      place_id: 126126,
      place_name: '강릉',
      description: '느긋한 바다 산책과 카페 투어를 즐기기 좋은 곳',
      image_url: '',
      tags: ['바다', '휴식'],
      match_rate: 87,
    },
    {
      place_id: 127394,
      place_name: '여수',
      description: '밤바다와 전망을 함께 담기 좋은 항구 도시',
      image_url: '',
      tags: ['야경', '바다'],
    },
  ],
  updated_at: '2026-05-21T09:00:00.000Z',
  answered_count: 12,
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
