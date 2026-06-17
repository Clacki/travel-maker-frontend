'use client'

import { useState } from 'react'

import { LoginModal } from '@/components/auth/LoginModal'
import { css } from '@/styled-system/css'
import { useShareLink } from '../hooks/useShareLink'
import { useTravelDetailBookmark } from '../hooks/useTravelDetailBookmark'
import { TravelDetailActionBar } from './TravelDetailActionBar'
import { TravelDetailHeaderInfo } from './TravelDetailHeaderInfo'
import { TravelDetailInfoItems } from './TravelDetailInfoItems'

import type { TravelDetail } from '../types/travelDetail.types'

interface InfoCardProps {
  detail: Pick<
    TravelDetail,
    | 'id'
    | 'place_name'
    | 'rating_avg'
    | 'review_count'
    | 'tags'
    | 'description'
    | 'address_primary'
    | 'address_detail'
    | 'info'
    | 'is_bookmarked'
  >
  highlightedTags?: string[]
}

const cardStyle = css({
  bg: 'bg.surface',
  borderRadius: 'lg',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  boxShadow: 'shadows.md',
  p: '6',
  display: 'flex',
  flexDirection: 'column',
  gap: '4',
})

const headerStyle = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '2',
})

const descriptionStyle = css({
  fontSize: 'sm',
  color: 'text.primary',
  lineHeight: 'relaxed',
  borderLeftWidth: '3px',
  borderColor: 'primary.soft',
  pl: '3',
  py: '1',
})

export default function InfoCard({ detail, highlightedTags }: InfoCardProps) {
  const {
    id,
    place_name,
    rating_avg,
    review_count,
    tags,
    description,
    address_primary,
    address_detail,
    info,
    is_bookmarked,
  } = detail
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { copied, shareLink } = useShareLink({ title: place_name })
  const {
    isAuthInitialized,
    isBookmarked,
    isPending: isBookmarkPending,
    toggleBookmark,
  } = useTravelDetailBookmark({
    placeId: id,
    initialIsBookmarked: is_bookmarked,
    onLoginRequired: () => setIsLoginModalOpen(true),
  })

  return (
    <>
      <div className={cardStyle}>
        <div className={headerStyle}>
          <TravelDetailHeaderInfo
            placeName={place_name}
            rating={rating_avg}
            reviewCount={review_count}
            tags={tags}
            highlightedTags={highlightedTags}
          />

          <TravelDetailActionBar
            copied={copied}
            isAuthInitialized={isAuthInitialized}
            isBookmarked={isBookmarked}
            isBookmarkPending={isBookmarkPending}
            onShare={shareLink}
            onBookmarkToggle={toggleBookmark}
          />
        </div>

        <p className={descriptionStyle}>{description}</p>

        <TravelDetailInfoItems
          addressPrimary={address_primary}
          addressDetail={address_detail}
          info={info}
        />
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}
