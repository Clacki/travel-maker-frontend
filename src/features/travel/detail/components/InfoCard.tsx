'use client'

import { useState, useRef, useEffect } from 'react'

import { LoginModal } from '@/components/auth/LoginModal'
import { Toast } from '@/components/common/Toast/Toast'
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
  flexDirection: { base: 'column', md: 'row' },
  justifyContent: 'space-between',
  alignItems: { base: 'flex-start', md: 'flex-start' },
  gap: '3',
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

const toggleButtonStyle = css({
  fontSize: 'xs',
  color: 'primary',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: '0',
  mt: '1',
  display: 'block',
})

const MAX_LINES = 7

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
  const [isDescExpanded, setIsDescExpanded] = useState(false)
  const [isDescOverflow, setIsDescOverflow] = useState(false)
  const descRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = descRef.current
    if (!el) return
    // lineHeight * MAX_LINES 로 실제 줄 수 초과 여부 판단
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight)
    setIsDescOverflow(el.scrollHeight > lineHeight * MAX_LINES + 2)
  }, [description])

  const { toastVisible, shareLink } = useShareLink()
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
            copied={toastVisible}
            isAuthInitialized={isAuthInitialized}
            isBookmarked={isBookmarked}
            isBookmarkPending={isBookmarkPending}
            onShare={shareLink}
            onBookmarkToggle={toggleBookmark}
          />
        </div>

        <div>
          <p
            ref={descRef}
            className={descriptionStyle}
            style={
              !isDescExpanded && isDescOverflow
                ? {
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: MAX_LINES,
                  }
                : undefined
            }
          >
            {description}
          </p>
          {isDescOverflow && (
            <button
              type="button"
              className={toggleButtonStyle}
              onClick={() => setIsDescExpanded((prev) => !prev)}
            >
              {isDescExpanded ? '접기 ▲' : '더보기 ▼'}
            </button>
          )}
        </div>

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
      <Toast message="링크가 복사되었습니다" visible={toastVisible} />
    </>
  )
}
