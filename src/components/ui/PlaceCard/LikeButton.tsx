'use client'

import { css } from '@/styled-system/css'

export interface LikeButtonProps {
  isLiked: boolean
  placeId: number
  onLikeToggle: (placeId: number) => void
}

const likeButtonStyle = css({
  position: 'absolute',
  top: '2',
  right: '2',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '8',
  height: '8',
  borderRadius: 'pill',
  bg: 'bg.surface',
  border: 'none',
  cursor: 'pointer',
  transitionProperty: 'background-color, box-shadow',
  transitionDuration: '150ms',
  _hover: {
    bg: 'primary.soft',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

export function LikeButton({
  isLiked,
  placeId,
  onLikeToggle,
}: LikeButtonProps) {
  return (
    <button
      type="button"
      aria-label={isLiked ? '북마크 해제' : '북마크 추가'}
      aria-pressed={isLiked}
      className={likeButtonStyle}
      onClick={() => onLikeToggle(placeId)}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={css({ color: isLiked ? 'warning' : 'text.secondary' })}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  )
}
