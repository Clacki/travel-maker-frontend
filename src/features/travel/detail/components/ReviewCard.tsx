'use client'

import { useState } from 'react'

import { ReviewModal } from '@/components/common/ReviewModal'
import { LoginModal } from '@/components/auth/LoginModal'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

import type { Review } from '../types/travelDetail.types'

import { css } from '@/styled-system/css'

interface ReviewCardProps {
  review: Review
}

const cardStyle = css({
  bg: 'bg.surface',
  borderRadius: 'lg',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  p: '6',
  display: 'flex',
  flexDirection: 'column',
  gap: '3',
})

const headerStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '3',
})

const avatarStyle = css({
  width: '10',
  height: '10',
  borderRadius: 'pill',
  bg: 'primary.soft',
  color: 'primary',
  fontSize: 'sm',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: '0',
})

const authorInfoStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1',
})

const authorNameStyle = css({
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'text.primary',
})

const metaStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  fontSize: 'xs',
  color: 'text.secondary',
})

const contentStyle = css({
  fontSize: 'sm',
  color: 'text.primary',
  lineHeight: 'relaxed',
})

const editButtonStyle = css({
  ml: 'auto',
  px: '3',
  py: '1',
  fontSize: 'xs',
  fontWeight: 'medium',
  color: 'text.secondary',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'pill',
  bg: 'transparent',
  cursor: 'pointer',
  transitionProperty: 'color, border-color',
  transitionDuration: '150ms',
  _hover: {
    color: 'primary',
    borderColor: 'primary',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getInitials(name: string): string {
  return name.slice(0, 1).toUpperCase()
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { author, createdAt, isOwner } = review
  const { isLoggedIn, isAuthInitialized } = useAuthStore()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [displayRating, setDisplayRating] = useState(review.rating)
  const [displayContent, setDisplayContent] = useState(review.content)

  const handleEditClick = () => {
    if (!isAuthInitialized) return
    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
      return
    }
    setIsEditOpen(true)
  }

  const handleEditSubmit = (newRating: number, newContent: string) => {
    setDisplayRating(newRating)
    setDisplayContent(newContent)
    // TODO: 리뷰 수정 API 호출
  }

  return (
    <>
      <article className={cardStyle}>
        <div className={headerStyle}>
          {/* TODO: API 연결 후 avatarUrl 도메인을 next.config에 허용하고 <Image>로 교체 */}
          {author.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={author.avatarUrl}
              alt={`${author.name} 프로필`}
              className={css({
                width: '10',
                height: '10',
                borderRadius: 'pill',
                objectFit: 'cover',
              })}
            />
          ) : (
            <div className={avatarStyle} aria-hidden="true">
              {getInitials(author.name)}
            </div>
          )}
          <div className={authorInfoStyle}>
            <span className={authorNameStyle}>{author.name}</span>
            <div className={metaStyle}>
              <span aria-label={`별점 ${displayRating}점`}>
                {'★'.repeat(displayRating)}
                {'☆'.repeat(5 - displayRating)}
              </span>
              <span aria-hidden="true">·</span>
              <time dateTime={createdAt}>{formatDate(createdAt)}</time>
            </div>
          </div>
          {isOwner && (
            <button
              type="button"
              className={editButtonStyle}
              onClick={handleEditClick}
              disabled={!isAuthInitialized}
              aria-busy={!isAuthInitialized}
            >
              수정
            </button>
          )}
        </div>
        <p className={contentStyle}>{displayContent}</p>
      </article>

      {isOwner && isEditOpen && (
        <ReviewModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          mode="edit"
          initialRating={displayRating}
          initialContent={displayContent}
          onSubmit={handleEditSubmit}
        />
      )}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}
