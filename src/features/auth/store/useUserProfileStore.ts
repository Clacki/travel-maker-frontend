import { create } from 'zustand'

export type UserProfileState = {
  id: number | null
  nickname: string | null
  profileImageUrl: string | null
  setUserProfile: (profile: {
    id: number
    nickname: string
    profileImageUrl?: string | null
  }) => void
  clearUserProfile: () => void
}

export const useUserProfileStore = create<UserProfileState>((set) => ({
  id: null,
  nickname: null,
  profileImageUrl: null,
  setUserProfile: ({ id, nickname, profileImageUrl = null }) => {
    set({ id, nickname, profileImageUrl })
  },
  clearUserProfile: () => {
    set({ id: null, nickname: null, profileImageUrl: null })
  },
}))
