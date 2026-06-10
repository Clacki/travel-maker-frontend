import { create } from 'zustand'

export type UserProfile = {
  id: string
  nickname: string
  email?: string
  bio?: string
  profileImageUrl?: string | null
  followerCount?: number
  followingCount?: number
  bookmarkCount?: number
  reviewCount?: number
}

export type UserProfileState = {
  userProfile: UserProfile | null
  setUserProfile: (userProfile: UserProfile) => void
  clearUserProfile: () => void
}

export const useUserProfileStore = create<UserProfileState>((set) => ({
  userProfile: null,
  setUserProfile: (userProfile) => {
    set({ userProfile })
  },
  clearUserProfile: () => {
    set({ userProfile: null })
  },
}))
