'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'

import { LoginModal } from '@/components/auth/LoginModal'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

type RequireAuth = (action: () => void) => void

interface UseRequireAuthReturn {
  requireAuth: RequireAuth
  loginModal: ReactNode
}

export function useRequireAuth(): UseRequireAuthReturn {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const requireAuth: RequireAuth = (action) => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
      return
    }
    action()
  }

  const loginModal = (
    <LoginModal
      isOpen={isLoginModalOpen}
      onClose={() => setIsLoginModalOpen(false)}
    />
  )

  return { requireAuth, loginModal }
}
