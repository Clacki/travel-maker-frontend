'use client'

import { Heart } from 'lucide-react'
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
      <Heart
        size={18}
        fill={isLiked ? 'currentColor' : 'none'}
        className={css({ color: isLiked ? 'warning' : 'text.secondary' })}
      />
    </button>
  )
}
