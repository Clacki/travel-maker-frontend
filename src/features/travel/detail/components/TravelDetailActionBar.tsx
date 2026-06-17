'use client'

import { css } from '@/styled-system/css'

interface TravelDetailActionBarProps {
  copied: boolean
  isAuthInitialized: boolean
  isBookmarked: boolean
  isBookmarkPending: boolean
  onShare: () => void
  onBookmarkToggle: () => void
}

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

export function TravelDetailActionBar({
  copied,
  isAuthInitialized,
  isBookmarked,
  isBookmarkPending,
  onShare,
  onBookmarkToggle,
}: TravelDetailActionBarProps) {
  return (
    <div className={buttonGroupStyle}>
      <button
        className={shareButtonStyle}
        aria-label="공유하기"
        onClick={onShare}
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
        aria-label={isBookmarked ? '찜 해제' : '찜 하기'}
        aria-pressed={isBookmarked}
        aria-busy={!isAuthInitialized || isBookmarkPending}
        disabled={!isAuthInitialized || isBookmarkPending}
        onClick={onBookmarkToggle}
        style={{
          backgroundColor: isBookmarked
            ? 'var(--colors-primary)'
            : 'var(--colors-bg-muted)',
          borderColor: isBookmarked
            ? 'var(--colors-primary)'
            : 'var(--colors-border-subtle)',
          opacity: !isAuthInitialized ? 0.45 : 1,
          cursor: !isAuthInitialized ? 'default' : 'pointer',
        }}
      >
        <span
          className={wishThumbStyle}
          style={{
            transform: isBookmarked ? 'translateX(36px)' : 'translateX(4px)',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isBookmarked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              color: isBookmarked
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
  )
}
