'use client'

import { useState } from 'react'
import Link from 'next/link'
import { isAxiosError } from 'axios'

import { ReviewModal } from '@/components/common/ReviewModal'
import type { ReviewSubmitPayload } from '@/components/common/ReviewModal'
import { LoginModal } from '@/components/auth/LoginModal'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import {
  deleteReview,
  updateReview,
  uploadReviewImage,
} from '@/features/reviews/api/reviewsApi'

import type { Review } from '../types/travelDetail.types'

import { css, cx } from '@/styled-system/css'

interface ReviewCardProps {
  review: Review
  onDeleted?: (reviewId: number) => void
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

const ownerCardStyle = css({
  borderColor: 'primary',
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

const authorLinkStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '3',
  textDecoration: 'none',
  _hover: {
    '& span:last-child': {
      textDecoration: 'underline',
    },
  },
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

const actionGroupStyle = css({
  display: 'flex',
  ml: 'auto',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'pill',
  overflow: 'hidden',
})

const editButtonStyle = css({
  px: '3',
  py: '1',
  fontSize: 'xs',
  fontWeight: 'medium',
  color: 'text.secondary',
  borderRightWidth: '1px',
  borderRightColor: 'border.subtle',
  bg: 'transparent',
  cursor: 'pointer',
  transitionProperty: 'color, background-color',
  transitionDuration: '150ms',
  _hover: {
    color: 'primary',
    bg: 'primary.soft',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const deleteButtonStyle = css({
  px: '3',
  py: '1',
  fontSize: 'xs',
  fontWeight: 'medium',
  color: 'text.secondary',
  bg: 'transparent',
  cursor: 'pointer',
  transitionProperty: 'color, background-color',
  transitionDuration: '150ms',
  _hover: {
    color: 'warning',
    bg: 'primary.soft',
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

export default function ReviewCard({ review, onDeleted }: ReviewCardProps) {
  const { author, createdAt, isOwner } = review
  const { isLoggedIn, isAuthInitialized } = useAuthStore()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [displayRating, setDisplayRating] = useState(review.rating)
  const [displayContent, setDisplayContent] = useState(review.content)
  const [displayImageUrl, setDisplayImageUrl] = useState(review.imageUrl)

  const handleEditClick = () => {
    if (!isAuthInitialized) return
    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
      return
    }
    setSubmitError(null)
    setIsEditOpen(true)
  }

  const handleDeleteClick = () => {
    if (!isAuthInitialized) return
    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
      return
    }
    setIsDeleteOpen(true)
  }

  const handleEditSubmit = async ({
    rating,
    content,
    imageUrl,
    imageFile,
  }: ReviewSubmitPayload) => {
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      let nextImageUrl = imageUrl

      if (imageFile) {
        try {
          nextImageUrl = await uploadReviewImage(imageFile)
        } catch (error) {
          setSubmitError(
            isAxiosError(error)
              ? '이미지 업로드 URL 발급에 실패했습니다.'
              : '이미지 업로드에 실패했습니다.'
          )
          return
        }
      }

      await updateReview(review.id, {
        rating,
        content,
        ...(nextImageUrl ? { image_url: nextImageUrl } : {}),
      })

      setDisplayRating(rating)
      setDisplayContent(content)
      setDisplayImageUrl(nextImageUrl ?? displayImageUrl)
      setIsEditOpen(false)
    } catch {
      setSubmitError('리뷰 수정에 실패했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    await deleteReview(review.id)
    setIsDeleteOpen(false)
    onDeleted?.(review.id)
  }

  return (
    <>
      <article className={cx(cardStyle, isOwner && ownerCardStyle)}>
        <div className={headerStyle}>
          <Link
            href={ROUTES.PROFILE(String(author.id))}
            className={authorLinkStyle}
          >
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
          </Link>
          {isOwner && (
            <div className={actionGroupStyle}>
              <button
                type="button"
                className={editButtonStyle}
                onClick={handleEditClick}
                disabled={!isAuthInitialized}
                aria-busy={!isAuthInitialized}
              >
                수정
              </button>
              <button
                type="button"
                className={deleteButtonStyle}
                onClick={handleDeleteClick}
                disabled={!isAuthInitialized}
                aria-busy={!isAuthInitialized}
              >
                삭제
              </button>
            </div>
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
          initialImageSrc={displayImageUrl}
          isSubmitting={isSubmitting}
          errorMessage={submitError}
          onSubmit={handleEditSubmit}
        />
      )}
      {isOwner && isDeleteOpen && (
        <ReviewModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          mode="delete"
          onDelete={handleDelete}
        />
      )}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}
