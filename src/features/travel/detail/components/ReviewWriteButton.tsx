'use client'

import { useState } from 'react'

import { Button } from '@/components/common/button'
import { LoginModal } from '@/components/auth/LoginModal'
import { ReviewModal } from '@/components/common/ReviewModal/ReviewModal'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

export default function ReviewWriteButton() {
  const { isLoggedIn, isAuthInitialized } = useAuthStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const handleClick = () => {
    if (!isAuthInitialized) return
    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
      return
    }
    setIsModalOpen(true)
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={!isAuthInitialized}
        aria-busy={!isAuthInitialized}
      >
        리뷰 쓰기
      </Button>
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="create"
        onSubmit={() => setIsModalOpen(false)}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}
