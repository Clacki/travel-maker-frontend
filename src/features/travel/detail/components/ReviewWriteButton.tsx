'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAxiosError } from 'axios'

import { LoginModal } from '@/components/auth/LoginModal'
import { Button } from '@/components/common/button'
import { css } from '@/styled-system/css'
import { ReviewModal } from '@/components/common/ReviewModal/ReviewModal'
import type { ReviewSubmitPayload } from '@/components/common/ReviewModal'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import {
  createReview,
  uploadReviewImage,
} from '@/features/reviews/api/reviewsApi'

interface ReviewWriteButtonProps {
  placeId: number
  onSuccess?: () => void
  hasMyReview?: boolean
}

function getCreateReviewErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    const status = error.response?.status

    if (status === 400) {
      return '평점과 리뷰 내용을 확인해주세요.'
    }

    if (status === 401) {
      return '로그인이 만료되었습니다. 다시 로그인해주세요.'
    }

    if (status === 403) {
      return '리뷰를 작성할 권한이 없습니다.'
    }

    if (status && status >= 500) {
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    }
  }

  return '리뷰 작성에 실패했습니다. 다시 시도해주세요.'
}

export default function ReviewWriteButton({
  placeId,
  onSuccess,
  hasMyReview = false,
}: ReviewWriteButtonProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized)

  const handleClick = () => {
    if (!isAuthInitialized) {
      return
    }

    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
      return
    }

    setErrorMessage(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    if (isSubmitting) {
      return
    }

    setErrorMessage(null)
    setIsModalOpen(false)
  }

  const handleSubmit = async ({
    rating,
    content,
    imageUrl,
    imageFile,
  }: ReviewSubmitPayload) => {
    const trimmedContent = content.trim()

    if (isSubmitting) {
      return
    }

    if (!Number.isFinite(placeId)) {
      setErrorMessage('장소 정보를 확인할 수 없습니다.')
      return
    }

    if (rating < 1 || rating > 5) {
      setErrorMessage('평점을 선택해주세요.')
      return
    }

    if (trimmedContent === '') {
      setErrorMessage('리뷰 내용을 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      let uploadedImageUrl = imageUrl

      if (imageFile) {
        try {
          uploadedImageUrl = await uploadReviewImage(imageFile)
        } catch (error) {
          setErrorMessage(
            isAxiosError(error)
              ? '이미지 업로드 URL 발급에 실패했습니다.'
              : '이미지 업로드에 실패했습니다.'
          )
          return
        }
      }

      await createReview(placeId, {
        rating,
        content: trimmedContent,
        ...(uploadedImageUrl ? { image_url: uploadedImageUrl } : {}),
      })
      setIsModalOpen(false)
      onSuccess?.()
      router.refresh()
    } catch (error) {
      const message = getCreateReviewErrorMessage(error)
      setErrorMessage(message)

      if (isAxiosError(error) && error.response?.status === 401) {
        setIsLoginModalOpen(true)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button
        aria-busy={!isAuthInitialized}
        disabled={!isAuthInitialized || hasMyReview}
        onClick={handleClick}
        size="sm"
        variant="outline"
        className={hasMyReview ? css({ opacity: 0.45 }) : undefined}
      >
        리뷰 쓰기
      </Button>
      {isModalOpen && (
        <ReviewModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          mode="create"
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
          onSubmit={handleSubmit}
        />
      )}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}
