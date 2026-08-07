'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { DEMO_ACCESS_TOKEN } from '../../../../mocks/db'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'
import {
  clearAuthLoggedOut,
  clearLegacyStoredAccessToken,
  hasDemoSession,
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

    if (pathname === '/auth/callback' || pathname === '/social-callback') {
      setAuthInitialized(true)
      return
    }

    if (!hasDemoSession()) {
      clearAuth()
      clearUserProfile()
      setAuthInitialized(true)
      return
    }

    const initializeDemoSession = async () => {
      try {
        clearAuthLoggedOut()
        setAccessToken(DEMO_ACCESS_TOKEN, { isAuthInitialized: false })
        try {
          await loadCurrentUserProfile()
        } catch (error) {
          console.error('Current user request failed after refresh.', error)
          clearUserProfile()
        }
      } catch {
        clearAuth()
        clearUserProfile()
      } finally {
        setAuthInitialized(true)
      }
    }

    authInitializationPromise ??= initializeDemoSession()
    void authInitializationPromise
  }, [
    clearAuth,
    clearUserProfile,
    pathname,
    setAccessToken,
    setAuthInitialized,
  ])
}
