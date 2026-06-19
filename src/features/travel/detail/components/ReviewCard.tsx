'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { isAxiosError } from 'axios'

import { ReviewModal } from '@/components/common/ReviewModal'
import type { ReviewSubmitPayload } from '@/components/common/ReviewModal'
import { ReviewImageLightbox } from '@/components/common/ReviewImageLightbox'
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
  flexDirection: 'row',
  gap: '3',
  alignItems: 'flex-start',
})

const ownerCardStyle = css({
  borderColor: 'primary',
})

// 좌측: 헤더 + 텍스트 + 더보기
const textSectionStyle = css({
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
  minW: 0,
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

const textContainerStyle = css({
  position: 'relative',
})

const contentStyle = css({
  fontSize: 'sm',
  color: 'text.primary',
  lineHeight: 'relaxed',
})

const contentClampedStyle = css({
  lineClamp: 1,
  overflow: 'hidden',
})

// 텍스트 끝 오른쪽에 absolute로 붙는 더보기
const expandButtonStyle = css({
  position: 'absolute',
  right: 0,
  bottom: 0,
  fontSize: 'xs',
  color: 'primary',
  bg: 'bg.surface',
  pl: '4',
  border: 'none',
  cursor: 'pointer',
  _hover: {
    textDecoration: 'underline',
  },
})

// 펼쳐진 상태의 접기 버튼 (텍스트 우측 하단 absolute)
const collapseButtonStyle = css({
  position: 'absolute',
  right: 0,
  bottom: 0,
  fontSize: 'xs',
  color: 'primary',
  bg: 'bg.surface',
  pl: '4',
  border: 'none',
  cursor: 'pointer',
  _hover: {
    textDecoration: 'underline',
  },
})

// 우측 전체: (수정/삭제 + 더보기) | 이미지 가로 배치, 이미지는 항상 맨 오른쪽 끝 고정
const rightSectionStyle = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
  gap: '2',
  flexShrink: '0',
})

// 수정/삭제 + 더보기를 세로로 쌓는 컬럼
const rightActionsStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '2',
})

const reviewImageFrameStyle = css({
  display: 'inline-block',
  width: '120px',
  height: '90px',
  overflow: 'hidden',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'md',
  bg: 'bg.muted',
  cursor: 'pointer',
  flexShrink: '0',
  _hover: {
    opacity: 0.85,
  },
})

const reviewImageStyle = css({
  display: 'block',
  width: 'full',
  height: 'full',
  objectFit: 'cover',
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isTextExpanded, setIsTextExpanded] = useState(false)
  const [isTruncated, setIsTruncated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [displayRating, setDisplayRating] = useState(review.rating)
  const [displayContent, setDisplayContent] = useState(review.content)
  const [displayImageUrl, setDisplayImageUrl] = useState(review.imageUrl)
  const [avatarError, setAvatarError] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (isTextExpanded) return
    const el = textRef.current
    if (!el) return
    const raf = requestAnimationFrame(() => {
      setIsTruncated(el.scrollHeight > el.clientHeight)
    })
    return () => cancelAnimationFrame(raf)
  }, [displayContent, isTextExpanded])

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
        {/* 좌측: 헤더(아바타·이름·별점·날짜) + 텍스트 + 더보기 */}
        <div className={textSectionStyle}>
          <div className={headerStyle}>
            <Link
              href={ROUTES.PROFILE(String(author.id))}
              className={authorLinkStyle}
            >
              {/* TODO: API 연결 후 avatarUrl 도메인을 next.config에 허용하고 <Image>로 교체 */}
              {author.avatarUrl && !avatarError ? (
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
                  onError={() => setAvatarError(true)}
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
          </div>
          <div className={textContainerStyle}>
            <p
              ref={textRef}
              className={cx(
                contentStyle,
                !isTextExpanded && contentClampedStyle
              )}
            >
              {displayContent}
            </p>
            {!isTextExpanded && isTruncated && (
              <button
                type="button"
                className={expandButtonStyle}
                onClick={() => setIsTextExpanded(true)}
              >
                더보기
              </button>
            )}
            {isTextExpanded && (
              <button
                type="button"
                className={collapseButtonStyle}
                onClick={() => setIsTextExpanded(false)}
              >
                접기
              </button>
            )}
          </div>
        </div>

        {/* 우측: [수정|삭제] [이미지] */}
        {(displayImageUrl || isOwner) && (
          <div className={rightSectionStyle}>
            {isOwner && (
              <div className={rightActionsStyle}>
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
              </div>
            )}
            {displayImageUrl && (
              <button
                type="button"
                className={reviewImageFrameStyle}
                onClick={() => setIsLightboxOpen(true)}
                aria-label="리뷰 이미지 크게 보기"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayImageUrl}
                  alt={`${author.name} 리뷰 이미지`}
                  className={reviewImageStyle}
                />
              </button>
            )}
          </div>
        )}
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
      {displayImageUrl && (
        <ReviewImageLightbox
          src={displayImageUrl}
          alt={`${author.name} 리뷰 이미지`}
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </>
  )
}
