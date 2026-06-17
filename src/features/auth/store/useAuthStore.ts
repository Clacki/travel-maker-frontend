import { create } from 'zustand'
import {
  clearAuthLoggedOut,
  clearLegacyStoredAccessToken,
} from '@/features/auth/utils/tokenStorage'

type AuthStatus = 'initializing' | 'authenticated' | 'unauthenticated'

type AuthState = {
  accessToken: string | null
  isLoggedIn: boolean
  isAuthInitialized: boolean
  authStatus: AuthStatus
  setAccessToken: (
    accessToken: string,
    options?: { isAuthInitialized?: boolean }
  ) => void
  clearAuth: () => void
  setAuthInitialized: (isAuthInitialized: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isLoggedIn: false,
  isAuthInitialized: false,
  authStatus: 'initializing',
  setAccessToken: (accessToken, options) => {
    const isAuthInitialized = options?.isAuthInitialized ?? true

    clearAuthLoggedOut()
    clearLegacyStoredAccessToken()
    set({
      accessToken,
      isLoggedIn: true,
      isAuthInitialized,
      authStatus: isAuthInitialized ? 'authenticated' : 'initializing',
    })
  },
  clearAuth: () => {
    clearLegacyStoredAccessToken()
    set({
      accessToken: null,
      isLoggedIn: false,
      isAuthInitialized: true,
      authStatus: 'unauthenticated',
    })
  },
  setAuthInitialized: (isAuthInitialized) => {
    set((state) => ({
      isAuthInitialized,
      authStatus: isAuthInitialized
        ? state.isLoggedIn
          ? 'authenticated'
          : 'unauthenticated'
        : 'initializing',
    }))
  },
}))
