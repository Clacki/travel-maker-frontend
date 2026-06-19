'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'

import { LoginModal } from '@/components/auth/LoginModal'
import { LoadingState } from '@/components/common/status'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

interface AuthGateProps {
  children: ReactNode
  onClose?: () => void
}

export function AuthGate({ children, onClose }: AuthGateProps) {
  const router = useRouter()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized)

  const handleClose = onClose ?? (() => router.replace(ROUTES.HOME))

  if (!isAuthInitialized) {
    return <LoadingState />
  }

  if (!isLoggedIn) {
    return <LoginModal isOpen onClose={handleClose} />
  }

  return children
}
