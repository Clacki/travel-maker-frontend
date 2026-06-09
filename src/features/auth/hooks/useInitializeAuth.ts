'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { refreshAccessToken } from '@/features/auth/api/authApi'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'
import {
  clearExplicitLogout,
  getStoredAccessToken,
  hasExplicitLogout,
} from '@/features/auth/utils/tokenStorage'

let authInitializationPromise: Promise<void> | null = null

export const useInitializeAuth = () => {
  const pathname = usePathname()
  const hasInitializedRef = useRef(false)
  const setAccessToken = useAuthStore((state) => state.setAccessToken)
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken)
  const initializeAuth = useAuthStore((state) => state.initializeAuth)
  const clearUserProfile = useUserProfileStore(
    (state) => state.clearUserProfile
  )

  useEffect(() => {
    if (hasInitializedRef.current) {
      return
    }

    hasInitializedRef.current = true

    if (useAuthStore.getState().isAuthInitialized) {
      return
    }

    const initialize = async () => {
      const storedAccessToken = getStoredAccessToken()

      if (storedAccessToken) {
        clearExplicitLogout()
        initializeAuth()
        return
      }

      if (pathname === '/social-callback') {
        initializeAuth()
        return
      }

      if (hasExplicitLogout()) {
        initializeAuth()
        return
      }

      try {
        const { access_token: accessToken } = await refreshAccessToken()
        setAccessToken(accessToken)
      } catch {
        clearAccessToken()
        clearUserProfile()
      }
    }

    authInitializationPromise ??= initialize()
    void authInitializationPromise
  }, [
    clearAccessToken,
    clearUserProfile,
    initializeAuth,
    pathname,
    setAccessToken,
  ])
}
