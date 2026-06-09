import { create } from 'zustand'
import {
  getStoredAccessToken,
  removeStoredAccessToken,
  setStoredAccessToken,
} from '@/features/auth/utils/tokenStorage'

type AuthState = {
  accessToken: string | null
  isLoggedIn: boolean
  isAuthInitialized: boolean
  setAccessToken: (accessToken: string) => void
  clearAccessToken: () => void
  initializeAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isLoggedIn: false,
  isAuthInitialized: false,
  setAccessToken: (accessToken) => {
    setStoredAccessToken(accessToken)
    set({
      accessToken,
      isLoggedIn: true,
      isAuthInitialized: true,
    })
  },
  clearAccessToken: () => {
    removeStoredAccessToken()
    set({
      accessToken: null,
      isLoggedIn: false,
      isAuthInitialized: true,
    })
  },
  initializeAuth: () => {
    const accessToken = getStoredAccessToken()

    set({
      accessToken,
      isLoggedIn: !!accessToken,
      isAuthInitialized: true,
    })
  },
}))
