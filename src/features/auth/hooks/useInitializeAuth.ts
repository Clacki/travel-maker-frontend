'use client'

import { useEffect, useRef } from 'react'
import { refreshAccessToken } from '@/features/auth/api/authApi'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { getStoredAccessToken } from '@/features/auth/utils/tokenStorage'

export const useInitializeAuth = () => {
  const hasInitializedRef = useRef(false)
  const setAccessToken = useAuthStore((state) => state.setAccessToken)
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken)
  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  useEffect(() => {
    if (hasInitializedRef.current) {
      return
    }

    hasInitializedRef.current = true

    const initialize = async () => {
      const storedAccessToken = getStoredAccessToken()

      if (storedAccessToken) {
        initializeAuth()
        return
      }

      try {
        const { access_token: accessToken } = await refreshAccessToken()
        setAccessToken(accessToken)
      } catch {
        clearAccessToken()
      }
    }

    void initialize()
  }, [clearAccessToken, initializeAuth, setAccessToken])
}
