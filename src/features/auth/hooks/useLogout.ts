'use client'

import { useState } from 'react'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'
import {
  clearDemoSession,
  markAuthLoggedOut,
} from '@/features/auth/utils/tokenStorage'

export const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const clearUserProfile = useUserProfileStore(
    (state) => state.clearUserProfile
  )

  const handleLogout = async () => {
    if (isLoggingOut) {
      return
    }

    setIsLoggingOut(true)

    try {
      clearDemoSession()
      markAuthLoggedOut()
      clearAuth()
      clearUserProfile()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return {
    isLoggingOut,
    logout: handleLogout,
  }
}
