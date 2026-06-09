'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { refreshAccessToken } from '@/features/auth/api/authApi'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'
import {
  clearAuthLoggedOut,
  clearLegacyStoredAccessToken,
  getAuthLoggedOut,
} from '@/features/auth/utils/tokenStorage'
import { loadCurrentUserProfile } from '@/features/auth/utils/currentUserProfile'

let authInitializationPromise: Promise<void> | null = null

export const useInitializeAuth = () => {
  const pathname = usePathname()
  const hasInitializedRef = useRef(false)
  const setAccessToken = useAuthStore((state) => state.setAccessToken)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const setAuthInitialized = useAuthStore((state) => state.setAuthInitialized)
  const clearUserProfile = useUserProfileStore(
    (state) => state.clearUserProfile
  )

  useEffect(() => {
    if (hasInitializedRef.current) {
      return
    }

    hasInitializedRef.current = true
    clearLegacyStoredAccessToken()

    if (useAuthStore.getState().isAuthInitialized) {
      return
    }

    if (pathname === '/social-callback') {
      setAuthInitialized(true)
      return
    }

    if (getAuthLoggedOut()) {
      setAuthInitialized(true)
      return
    }

    const initializeWithRefresh = async () => {
      try {
        const { access_token: accessToken } = await refreshAccessToken()
        clearAuthLoggedOut()
        setAccessToken(accessToken)
        try {
          await loadCurrentUserProfile()
        } catch (error) {
          console.error('Current user request failed after refresh.', error)
          clearUserProfile()
        }
      } catch {
        clearAuth()
        clearUserProfile()
      }
    }

    authInitializationPromise ??= initializeWithRefresh()
    void authInitializationPromise
  }, [
    clearAuth,
    clearUserProfile,
    pathname,
    setAccessToken,
    setAuthInitialized,
  ])
}
