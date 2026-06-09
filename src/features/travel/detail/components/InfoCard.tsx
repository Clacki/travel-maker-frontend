'use client'

import { useRef, useState } from 'react'

import type { TravelDetail } from '../types/travelDetail.types'

import InfoGrid from './InfoGrid'
import TagList from './TagList'
import { css } from '@/styled-system/css'

interface InfoCardProps {
  detail: Pick<
    TravelDetail,
    'title' | 'rating' | 'reviewCount' | 'tags' | 'description' | 'infoItems'
  >
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
  transition: 'background-color 0.3s ease, border-color 0.3s ease',
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

export default function InfoCard({ detail }: InfoCardProps) {
  const { title, rating, reviewCount, tags, description, infoItems } = detail
  const [copied, setCopied] = useState(false)
  const [isWished, setIsWished] = useState(false)
  const isSharing = useRef(false)

  const handleShare = async () => {
    if (isSharing.current) return
    isSharing.current = true
    try {
      const url = window.location.href
      if (navigator.share) {
        await navigator.share({ title, url })
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
    <div className={cardStyle}>
      <div className={headerStyle}>
        <div className={titleInfoStyle}>
          <h1 className={titleStyle}>{title}</h1>
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
            <span className={ratingTextStyle}>{rating.toFixed(1)}</span>
            <span className={reviewCountStyle}>
              ({reviewCount.toLocaleString()}개 리뷰)
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
            onClick={() => setIsWished((prev) => !prev)}
            style={{
              backgroundColor: isWished
                ? 'var(--colors-primary)'
                : 'var(--colors-bg-muted)',
              borderColor: isWished
                ? 'var(--colors-primary)'
                : 'var(--colors-border-subtle)',
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

      <TagList tags={tags} />

      <p className={descriptionStyle}>{description}</p>

      <InfoGrid items={infoItems} />
    </div>
  )
}
