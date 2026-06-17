'use client'

import { useEffect, useRef, useState } from 'react'
import axios from 'axios'

import TagList from './TagList'
import InfoGrid from './InfoGrid'
import { LoginModal } from '@/components/auth/LoginModal'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { postBookmark, deleteBookmark } from '@/features/mypage/api/bookmarkApi'
import { getTravelDetail } from '../api/travelDetailApi'
import { formatDetailText } from '../utils/formatDetailText'

import type { TravelDetail } from '../types/travelDetail.types'

import { css } from '@/styled-system/css'

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

const titleInfoStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
})

const titleStyle = css({
  fontSize: '2xl',
  fontWeight: 'bold',
  color: 'text.primary',
})

const ratingRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '1',
})

const ratingTextStyle = css({
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'text.primary',
})

const reviewCountStyle = css({
  fontSize: 'sm',
  color: 'text.secondary',
})

const buttonGroupStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  flexShrink: '0',
})

const shareButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  borderRadius: '8px',
  bg: 'bg.muted',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  cursor: 'pointer',
  color: 'text.secondary',
  _hover: { bg: 'bg.canvas' },
})

const wishTrackStyle = css({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  width: '72px',
  height: '40px',
  borderRadius: '9999px',
  borderWidth: '1px',
  cursor: 'pointer',
  flexShrink: '0',
  transition:
    'background-color 0.3s ease, border-color 0.3s ease, opacity 0.2s ease',
})

const wishThumbStyle = css({
  position: 'absolute',
  top: '4px',
  width: '32px',
  height: '32px',
  borderRadius: '9999px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  bg: 'bg.surface',
  transition: 'transform 0.3s ease',
  boxShadow: 'shadows.sm',
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
  const { isLoggedIn, isAuthInitialized } = useAuthStore()
  const [copied, setCopied] = useState(false)
  const [isWished, setIsWished] = useState(is_bookmarked ?? false)
  const [isWishPending, setIsWishPending] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const isSharing = useRef(false)

  useEffect(() => {
    if (!isAuthInitialized || !isLoggedIn) return
    getTravelDetail(String(id))
      .then((data) => setIsWished(data.is_bookmarked ?? false))
      .catch((error) => console.error('찜 상태 동기화 실패', error))
  }, [isAuthInitialized, isLoggedIn, id])

  const handleWishToggle = async () => {
    if (!isAuthInitialized || isWishPending) {
      return
    }
    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
      return
    }

    const isAdding = !isWished
    setIsWished(isAdding)
    setIsWishPending(true)

    try {
      if (isAdding) {
        await postBookmark(id)
      } else {
        await deleteBookmark(id)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setIsWishPending(false)
        return
      }
      setIsWished(!isAdding)
      alert('처리에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsWishPending(false)
    }
  }

  const handleShare = async () => {
    if (isSharing.current) return
    isSharing.current = true
    try {
      const url = window.location.href
      if (navigator.share) {
        await navigator.share({ title: place_name, url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } finally {
      isSharing.current = false
    }
  }

  return (
    <>
      <div className={cardStyle}>
        <div className={headerStyle}>
          <div className={titleInfoStyle}>
            <h1 className={titleStyle}>{place_name}</h1>
            <div className={ratingRowStyle}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className={css({ color: 'warning' })}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className={ratingTextStyle}>
                {(rating_avg ?? 0).toFixed(1)}
              </span>
              <span className={reviewCountStyle}>
                ({review_count.toLocaleString()}개 리뷰)
              </span>
            </div>
          </div>

          <div className={buttonGroupStyle}>
            <button
              className={shareButtonStyle}
              aria-label="공유하기"
              onClick={handleShare}
              title={copied ? '링크 복사됨!' : '공유하기'}
            >
              {copied ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={css({ color: 'primary' })}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              )}
            </button>

            <button
              className={wishTrackStyle}
              aria-label={isWished ? '찜 해제' : '찜 하기'}
              aria-pressed={isWished}
              aria-busy={!isAuthInitialized || isWishPending}
              disabled={!isAuthInitialized || isWishPending}
              onClick={handleWishToggle}
              style={{
                backgroundColor: isWished
                  ? 'var(--colors-primary)'
                  : 'var(--colors-bg-muted)',
                borderColor: isWished
                  ? 'var(--colors-primary)'
                  : 'var(--colors-border-subtle)',
                opacity: !isAuthInitialized ? 0.45 : 1,
                cursor: !isAuthInitialized ? 'default' : 'pointer',
              }}
            >
              <span
                className={wishThumbStyle}
                style={{
                  transform: isWished ? 'translateX(36px)' : 'translateX(4px)',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={isWished ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    color: isWished
                      ? 'var(--colors-primary)'
                      : 'var(--colors-text-secondary)',
                  }}
                  aria-hidden="true"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        <TagList tags={tags} highlightedTags={highlightedTags} />

        <p className={descriptionStyle}>{description}</p>

        <InfoGrid
          items={[
            address_primary
              ? {
                  label: '위치',
                  value: formatDetailText(
                    address_detail
                      ? `${address_primary} ${address_detail}`
                      : address_primary
                  ),
                }
              : null,
            info?.operating_hours
              ? {
                  label: '운영',
                  value: formatDetailText(info.operating_hours),
                }
              : null,
            info?.closed_days
              ? { label: '휴무일', value: formatDetailText(info.closed_days) }
              : null,
            info?.admission_fee
              ? {
                  label: '입장료',
                  value: formatDetailText(info.admission_fee),
                }
              : null,
            info?.parking !== null && info?.parking !== undefined
              ? { label: '주차', value: info.parking ? '가능' : '불가' }
              : null,
            info?.spend_time
              ? { label: '소요시간', value: info.spend_time }
              : null,
            info?.pet !== null && info?.pet !== undefined
              ? {
                  label: '반려동물',
                  value: info.pet ? '동반 가능' : '동반 불가',
                }
              : null,
            info?.baby_carriage !== null && info?.baby_carriage !== undefined
              ? { label: '유모차', value: info.baby_carriage ? '가능' : '불가' }
              : null,
            info?.credit_card !== null && info?.credit_card !== undefined
              ? { label: '카드결제', value: info.credit_card ? '가능' : '불가' }
              : null,
            info?.discount_info
              ? { label: '할인정보', value: info.discount_info }
              : null,
            info?.accom_count
              ? { label: '수용인원', value: info.accom_count }
              : null,
          ]
            .filter(
              (item): item is { label: string; value: string } => item !== null
            )
            .slice(0, 4)
            .concat(Array(4).fill({ label: '', value: '' }))
            .slice(0, 4)}
        />
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}
