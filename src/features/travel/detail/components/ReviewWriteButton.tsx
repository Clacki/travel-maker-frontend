'use client'

import { useState } from 'react'

import { LoginModal } from '@/components/auth/LoginModal'
import { Button } from '@/components/common/button'
import { ReviewModal } from '@/components/common/ReviewModal/ReviewModal'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

export default function ReviewWriteButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
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

    setIsModalOpen(true)
  }

  return (
    <>
      <Button
        aria-busy={!isAuthInitialized}
        disabled={!isAuthInitialized}
        onClick={handleClick}
        size="sm"
        variant="outline"
      >
        리뷰 쓰기
      </Button>
      {isModalOpen && (
        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode="create"
          onSubmit={() => setIsModalOpen(false)}
        />
      )}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}
