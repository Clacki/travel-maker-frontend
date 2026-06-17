'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { LoginModal } from '@/components/auth/LoginModal'
import { LoadingState } from '@/components/common/status'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

interface TestAuthGateProps {
  children: ReactNode
}

export function TestAuthGate({ children }: TestAuthGateProps) {
  const router = useRouter()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized)

  if (!isAuthInitialized) {
    return <LoadingState />
  }

  if (!isLoggedIn) {
    return (
      <LoginModal
        isOpen
        onClose={() => {
          router.replace(ROUTES.HOME)
        }}
      />
    )
  }

  return children
}
