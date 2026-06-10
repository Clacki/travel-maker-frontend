'use client'

import { Button } from '@/components/common/button'
import { Modal } from '@/components/common/modal'
import { css, cx } from '@/styled-system/css'
import { ImagePlus, Star, Trash2 } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { useEffect, useId, useRef, useState } from 'react'

export type ReviewModalMode = 'create' | 'edit' | 'delete'

export interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  mode: ReviewModalMode
  initialRating?: number
  initialContent?: string
  initialImageSrc?: string | null
  initialCreatedAt?: string
  isSubmitting?: boolean
  errorMessage?: string | null
  onSubmit?: (rating: number, content: string, image?: string) => void
  onDelete?: () => void
}

const MAX_CONTENT_LENGTH = 200

const reviewDialogStyle = css({
  maxW: { base: 'calc(100vw - 32px)', md: '520px' },
  borderRadius: '2xl',
  '& h2': {
    display: 'flex',
    alignItems: 'center',
    gap: '3',
    fontSize: { base: 'xl', md: '2xl' },
  },
  '& h2::before': {
    content: '""',
    display: 'block',
    width: '1',
    height: '6',
    borderRadius: 'pill',
    bg: 'primary',
  },
})

const formStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '6',
})

const fieldStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '3',
})

const labelStyle = css({
  color: 'text.primary',
  fontSize: 'md',
  fontWeight: 'semibold',
})

const ratingPanelStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: { base: '2', md: '4' },
  minH: '18',
  px: { base: '4', md: '6' },
  py: '4',
  borderRadius: 'lg',
  bg: 'primary.soft',
})

const starRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: { base: '1', md: '2' },
})

const starButtonStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: { base: '8', md: '10' },
  height: { base: '8', md: '10' },
  borderWidth: '1px',
  borderColor: 'transparent',
  borderRadius: 'pill',
  bg: 'transparent',
  color: 'primary',
  transitionProperty: 'background-color, border-color, color, box-shadow',
  transitionDuration: '150ms',
  _hover: {
    bg: 'bg.surface',
    color: 'primary',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const activeStarStyle = css({
  color: 'primary',
})

const ratingValueStyle = css({
  minW: '8',
  color: 'primary',
  fontSize: 'md',
  fontWeight: 'bold',
  textAlign: 'center',
})

const imagePreviewStyle = css({
  width: 'full',
  aspectRatio: '16 / 6.4',
  overflow: 'hidden',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
  bg: 'bg.muted',
})

const previewImageStyle = css({
  width: 'full',
  height: 'full',
  objectFit: 'cover',
})

const emptyPreviewStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '2',
  width: 'full',
  height: 'full',
  color: 'text.secondary',
  fontSize: 'sm',
  fontWeight: 'medium',
})

const emptyPreviewIconStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '12',
  height: '12',
  borderRadius: 'pill',
  bg: 'bg.surface',
  color: 'primary',
})

const imageActionRowStyle = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', sm: '1fr 1fr' },
  gap: '2',
})

const imageInputStyle = css({
  position: 'absolute',
  width: '1px',
  height: '1px',
  p: '0',
  m: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: '0',
})

const imageChangeButtonStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2',
  minH: '10',
  px: '5',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'sm',
  bg: 'bg.surface',
  color: 'text.primary',
  fontSize: 'md',
  fontWeight: 'semibold',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  transitionProperty: 'background-color, border-color, color, box-shadow',
  transitionDuration: '150ms',
  _hover: {
    borderColor: 'primary',
    color: 'primary',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const imageDeleteButtonStyle = css({
  color: 'warning',
  _hover: {
    borderColor: 'warning',
    color: 'warning',
  },
})

const textareaStyle = css({
  width: 'full',
  minH: '40',
  px: '4',
  py: '3',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
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

const reviewMetaStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '3',
  color: 'text.secondary',
  fontSize: 'sm',
})

const errorMessageStyle = css({
  color: 'warning',
  fontSize: 'sm',
  fontWeight: 'medium',
  lineHeight: 'normal',
})

const footerRowStyle = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', sm: '1fr 1fr' },
  gap: '3',
  width: 'full',
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

const deleteButtonStyle = css({
  bg: 'warning',
  borderColor: 'warning',
  color: 'text.inverse',
  _hover: {
    opacity: '0.9',
  },
})

interface StarRatingProps {
  labelId: string
  value: number
  onChange: (rating: number) => void
}

function StarRating({ labelId, value, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const displayValue = hovered || value

  return (
    <div
      aria-labelledby={labelId}
      aria-label={`현재 평점 ${value}점`}
      className={ratingPanelStyle}
      role="radiogroup"
    >
      <div className={starRowStyle}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = displayValue >= star

          return (
            <button
              key={star}
              type="button"
              aria-checked={value === star}
              aria-label={`${star}점 선택`}
              className={cx(starButtonStyle, isActive && activeStarStyle)}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              role="radio"
            >
              <Star
                aria-hidden="true"
                fill={isActive ? 'currentColor' : 'none'}
                size={34}
                strokeWidth={1.8}
              />
            </button>
          )
        })}
      </div>
      <span className={ratingValueStyle}>{value.toFixed(1)}</span>
    </div>
  )
}

function formatDateText(value: Date | string = new Date()) {
  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  const formatter = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  return formatter.format(date).replace(/\. /g, '.').replace(/\.$/, '')
}

export function ReviewModal({
  isOpen,
  onClose,
  mode,
  initialRating = 0,
  initialContent = '',
  initialImageSrc = null,
  initialCreatedAt,
  isSubmitting = false,
  errorMessage,
  onSubmit,
  onDelete,
}: ReviewModalProps) {
  const ratingLabelId = useId()
  const textareaId = useId()
  const imageInputId = useId()
  const fileObjectUrlRef = useRef<string | null>(null)
  const [rating, setRating] = useState(initialRating)
  const [content, setContent] = useState(initialContent)
  const [previewSrc, setPreviewSrc] = useState<string | null>(
    mode === 'edit' ? initialImageSrc : null
  )
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (fileObjectUrlRef.current) {
        URL.revokeObjectURL(fileObjectUrlRef.current)
      }
    }
  }, [])

  const title =
    mode === 'create'
      ? '리뷰 작성'
      : mode === 'edit'
        ? '리뷰 수정'
        : '리뷰 삭제'
  const submitText = mode === 'create' ? '작성하기' : '수정하기'
  const submittingText = mode === 'create' ? '작성 중...' : '수정 중...'
  const createdAtText = formatDateText(initialCreatedAt)

  const handleSubmit = () => {
    const trimmedContent = content.trim()

    if (isSubmitting) {
      return
    }

    if (rating < 1 || rating > 5) {
      setValidationError('평점을 선택해주세요.')
      return
    }

    if (trimmedContent === '') {
      setValidationError('리뷰 내용을 입력해주세요.')
      return
    }

    const image =
      previewSrc && !previewSrc.startsWith('blob:') ? previewSrc : undefined

    setValidationError(null)
    onSubmit?.(rating, trimmedContent, image)
  }

  const handleDelete = () => {
    onDelete?.()
    onClose()
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (fileObjectUrlRef.current) {
      URL.revokeObjectURL(fileObjectUrlRef.current)
    }

    const objectUrl = URL.createObjectURL(file)
    fileObjectUrlRef.current = objectUrl
    setPreviewSrc(objectUrl)
  }

  const handleImageDelete = () => {
    if (fileObjectUrlRef.current) {
      URL.revokeObjectURL(fileObjectUrlRef.current)
      fileObjectUrlRef.current = null
    }

    setPreviewSrc(null)
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
            <Button
              className={deleteButtonStyle}
              fullWidth
              onClick={handleDelete}
              shape="pill"
              variant="primary"
            >
              삭제하기
            </Button>
            <Button variant="neutral" shape="pill" fullWidth onClick={onClose}>
              취소
            </Button>
          </div>
        }
      >
        <p className={deleteTextStyle}>
          정말 이 리뷰를 삭제하시겠습니까?
          <br />
          삭제한 리뷰는 복구할 수 없습니다.
        </p>
      </Modal>
    )
  }

  return (
    <Modal
      className={reviewDialogStyle}
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      footer={
        <div className={footerRowStyle}>
          <Button
            variant="outline"
            shape="rounded"
            fullWidth
            onClick={onClose}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            variant="primary"
            shape="rounded"
            fullWidth
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? submittingText : submitText}
          </Button>
        </div>
      }
    >
      <form className={formStyle} onSubmit={(event) => event.preventDefault()}>
        <section className={fieldStyle}>
          <h3 className={labelStyle} id={ratingLabelId}>
            평점 선택
          </h3>
          <StarRating
            labelId={ratingLabelId}
            value={rating}
            onChange={(nextRating) => {
              setRating(nextRating)
              setValidationError(null)
            }}
          />
        </section>

        <section className={fieldStyle}>
          <h3 className={labelStyle}>리뷰 이미지</h3>
          <div className={imagePreviewStyle}>
            {previewSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt="리뷰 이미지 미리보기"
                className={previewImageStyle}
                src={previewSrc}
              />
            ) : (
              <div className={emptyPreviewStyle}>
                <span className={emptyPreviewIconStyle}>
                  <ImagePlus aria-hidden="true" size={24} />
                </span>
                <span>이미지를 추가해주세요</span>
              </div>
            )}
          </div>
          <div className={imageActionRowStyle}>
            <input
              accept="image/*"
              className={imageInputStyle}
              id={imageInputId}
              onChange={handleImageChange}
              type="file"
            />
            <label className={imageChangeButtonStyle} htmlFor={imageInputId}>
              <ImagePlus aria-hidden="true" size={18} />
              이미지 추가/변경
            </label>
            <button
              className={cx(imageChangeButtonStyle, imageDeleteButtonStyle)}
              onClick={handleImageDelete}
              type="button"
            >
              <Trash2 aria-hidden="true" size={18} />
              이미지 삭제
            </button>
          </div>
        </section>

        <section className={fieldStyle}>
          <label className={labelStyle} htmlFor={textareaId}>
            상세 리뷰
          </label>
          <textarea
            aria-describedby={`${textareaId}-meta`}
            className={textareaStyle}
            id={textareaId}
            maxLength={MAX_CONTENT_LENGTH}
            onChange={(event) => {
              setContent(event.target.value)
              setValidationError(null)
            }}
            placeholder="방문했던 장소의 분위기와 경험을 자세히 적어주세요."
            value={content}
          />
          <div className={reviewMetaStyle} id={`${textareaId}-meta`}>
            <span>작성일 {createdAtText}</span>
            <span>
              {content.length}/{MAX_CONTENT_LENGTH}자
            </span>
          </div>
          {(errorMessage || validationError) && (
            <p className={errorMessageStyle} role="alert">
              {errorMessage ?? validationError}
            </p>
          )}
        </section>
      </form>
    </Modal>
  )
}
