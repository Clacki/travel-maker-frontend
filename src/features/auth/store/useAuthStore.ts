import { create } from 'zustand'
import {
  clearAuthLoggedOut,
  clearLegacyStoredAccessToken,
} from '@/features/auth/utils/tokenStorage'

type AuthState = {
  accessToken: string | null
  isLoggedIn: boolean
  isAuthInitialized: boolean
  setAccessToken: (accessToken: string) => void
  clearAuth: () => void
  setAuthInitialized: (isAuthInitialized: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isLoggedIn: false,
  isAuthInitialized: false,
  setAccessToken: (accessToken) => {
    clearAuthLoggedOut()
    clearLegacyStoredAccessToken()
    set({
      accessToken,
      isLoggedIn: true,
      isAuthInitialized: true,
    })
  },
  clearAuth: () => {
    clearLegacyStoredAccessToken()
    set({
      accessToken: null,
      isLoggedIn: false,
      isAuthInitialized: true,
    })
  },
  setAuthInitialized: (isAuthInitialized) => {
    set({ isAuthInitialized })
  },
}))
