'use client'

import { useState } from 'react'
import { css } from '@/styled-system/css'
import { Modal } from '@/components/common/modal'
import { Button } from '@/components/common/button'

export type ReviewModalMode = 'create' | 'edit' | 'delete'

export interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  mode: ReviewModalMode
  initialRating?: number
  initialContent?: string
  onSubmit?: (rating: number, content: string) => void
  onDelete?: () => void
}

const ratingLabelStyle = css({
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'text.primary',
  mb: '2',
  textAlign: 'center',
})

const starRowStyle = css({
  display: 'flex',
  justifyContent: 'center',
  gap: '1',
  mb: '4',
})

const starButtonStyle = css({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '1',
  color: 'text.secondary',
  transitionProperty: 'color',
  transitionDuration: '150ms',
  _hover: {
    color: 'primary',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
    borderRadius: 'sm',
  },
})

const contentLabelStyle = css({
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'text.primary',
  mb: '2',
})

const textareaStyle = css({
  width: 'full',
  minH: '120px',
  px: '3',
  py: '2',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'sm',
  bg: 'bg.surface',
  color: 'text.primary',
  fontSize: 'md',
  lineHeight: 'normal',
  resize: 'vertical',
  _placeholder: {
    color: 'text.secondary',
  },
  _focusVisible: {
    outline: 'none',
    borderColor: 'primary',
    boxShadow: 'focus',
  },
})

const deleteTextStyle = css({
  fontSize: 'md',
  color: 'text.primary',
  lineHeight: 'normal',
  textAlign: 'center',
  py: '2',
})

const deleteFooterStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
  width: 'full',
})

const footerRowStyle = css({
  display: 'flex',
  gap: '3',
  width: 'full',
})

const deleteButtonStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'full',
  minH: '10',
  px: '5',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'warning',
  borderRadius: 'pill',
  bg: 'warning',
  color: 'text.inverse',
  fontSize: 'md',
  fontWeight: 'semibold',
  cursor: 'pointer',
  transitionProperty: 'background-color, border-color',
  transitionDuration: '150ms',
  _hover: {
    opacity: '0.9',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

interface StarRatingProps {
  value: number
  onChange: (rating: number) => void
}

function StarRating({ value, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className={starRowStyle}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star}점`}
          className={starButtonStyle}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill={(hovered || value) >= star ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
            className={css({
              color: (hovered || value) >= star ? 'primary' : 'text.secondary',
            })}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
    </div>
  )
}

export function ReviewModal({
  isOpen,
  onClose,
  mode,
  initialRating = 0,
  initialContent = '',
  onSubmit,
  onDelete,
}: ReviewModalProps) {
  const [rating, setRating] = useState(initialRating)
  const [content, setContent] = useState(initialContent)

  const title =
    mode === 'create'
      ? '리뷰 작성'
      : mode === 'edit'
        ? '리뷰 수정'
        : '리뷰 삭제'

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(rating, content)
    }
    onClose()
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
    }
    onClose()
  }

  if (mode === 'delete') {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        size="sm"
        footer={
          <div className={deleteFooterStyle}>
            <button
              type="button"
              className={deleteButtonStyle}
              onClick={handleDelete}
            >
              삭제하기
            </button>
            <Button variant="neutral" shape="pill" fullWidth onClick={onClose}>
              취소
            </Button>
          </div>
        }
      >
        <p className={deleteTextStyle}>
          정말 이 리뷰를 삭제하시겠습니까?
          <br />
          삭제된 리뷰는 복구할 수 없습니다.
        </p>
      </Modal>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className={footerRowStyle}>
          <Button variant="neutral" shape="pill" fullWidth onClick={onClose}>
            취소
          </Button>
          <Button
            variant="primary"
            shape="pill"
            fullWidth
            onClick={handleSubmit}
            disabled={rating === 0 || content.trim() === ''}
          >
            {mode === 'create' ? '작성하기' : '수정하기'}
          </Button>
        </div>
      }
    >
      <div>
        <p className={ratingLabelStyle}>별점 선택</p>
        <StarRating value={rating} onChange={setRating} />
        <p className={contentLabelStyle}>상세 내용</p>
        <textarea
          className={textareaStyle}
          placeholder="리뷰를 작성해주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={200}
        />
      </div>
    </Modal>
  )
}
