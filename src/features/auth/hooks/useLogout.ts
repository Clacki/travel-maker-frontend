'use client'

import { useState } from 'react'
import { logout } from '@/features/auth/api/authApi'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'
import { markAuthLoggedOut } from '@/features/auth/utils/tokenStorage'

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
      await logout()
    } catch (error) {
      console.error('Logout request failed.', error)
    } finally {
      markAuthLoggedOut()
      clearAuth()
      clearUserProfile()
      setIsLoggingOut(false)
    }
  }

  return {
    isLoggingOut,
    logout: handleLogout,
  }
}
