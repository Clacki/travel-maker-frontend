'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { css } from '@/styled-system/css'
import { ROUTES } from '@/constants/routes'
import { ProfileCard } from '../ProfileCard'
import { ProfileTabs } from '../ProfileTabs'
import type { TabType } from '../ProfileTabs'
import { PlaceCard } from '@/components/ui/PlaceCard'
import { ReviewModal } from '@/components/common/ReviewModal'
import type { ReviewModalMode } from '@/components/common/ReviewModal'
import { WithdrawModal } from '@/components/common/WithdrawModal'
import { EmptyState } from '@/components/common/status'
import {
  mockMyProfile,
  mockBookmarks,
  mockReviews,
} from '@/mocks/data/mypage-data'

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

const gridStyle = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '4',
  mt: '4',
})

export function MyPageContent({ userId }: MyPageContentProps) {
  const router = useRouter()

  // TODO: 실제 API 연동 시 세션에서 현재 유저 ID 확인
  const isMyProfile = true

  const [activeTab, setActiveTab] = useState<TabType>('bookmark')
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean
    mode: ReviewModalMode
    reviewId: number | null
    initialRating: number
    initialContent: string
  }>({
    isOpen: false,
    mode: 'create',
    reviewId: null,
    initialRating: 0,
    initialContent: '',
  })

  // TODO: 실제 API 연동
  const user = mockMyProfile
  const bookmarks = mockBookmarks
  const reviews = mockReviews

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

  const handleReviewEdit = (placeId: number) => {
    const review = reviews.find((r) => r.review_id === placeId)
    if (review) {
      setReviewModal({
        isOpen: true,
        mode: 'edit',
        reviewId: review.review_id,
        initialRating: review.rating,
        initialContent: review.content,
      })
    }
  }

  const handleReviewDelete = (placeId: number) => {
    setReviewModal({
      isOpen: true,
      mode: 'delete',
      reviewId: placeId,
      initialRating: 0,
      initialContent: '',
    })
  }

  const handleReviewSubmit = (rating: number, content: string) => {
    console.log('review submit', reviewModal.reviewId, rating, content)
    // TODO: 리뷰 수정 API 호출
  }

  const handleReviewDeleteConfirm = () => {
    console.log('review delete', reviewModal.reviewId)
    // TODO: 리뷰 삭제 API 호출
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
          reviewCount={reviews.length}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === 'bookmark' &&
          (bookmarks.length > 0 ? (
            <div className={gridStyle}>
              {bookmarks.map((bookmark) => (
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
          ) : (
            <EmptyState
              title="첫 번째 여행지의 시작"
              description="지금 마음에 드는 곳을 찾아보세요"
              actionLabel="여행지 찾아가기"
              onAction={() => router.push(ROUTES.EXPLORE)}
            />
          ))}

        {activeTab === 'review' && (
          <div className={gridStyle}>
            {reviews.map((review) => (
              <PlaceCard
                key={review.review_id}
                variant="review"
                placeId={review.review_id}
                placeName="부산 광안리 야경"
                description={review.content}
                rating={review.rating}
                onEditClick={handleReviewEdit}
                onDeleteClick={handleReviewDelete}
              />
            ))}
          </div>
        )}

        {activeTab === 'test' && (
          <EmptyState
            title="아직 성향 테스트를 하지 않았어요"
            description="나의 여행 성향을 알아보세요"
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
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal((prev) => ({ ...prev, isOpen: false }))}
        mode={reviewModal.mode}
        initialRating={reviewModal.initialRating}
        initialContent={reviewModal.initialContent}
        onSubmit={handleReviewSubmit}
        onDelete={handleReviewDeleteConfirm}
      />
    </div>
  )
}
