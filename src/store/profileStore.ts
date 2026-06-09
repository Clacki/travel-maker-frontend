import { create } from 'zustand'

import { getDefaultProfileTagIds } from '@/features/mypage/lib/profile-tags'

export type EditableProfile = {
  nickname: string
  bio: string
  tagIds: string[]
}

type ProfileStore = {
  profiles: Record<string, EditableProfile>
  getProfile: (userId: string, fallback: EditableProfile) => EditableProfile
  saveProfile: (userId: string, profile: EditableProfile) => void
}

export const DEFAULT_PROFILE_NICKNAME = '여행하는 민'
export const DEFAULT_PROFILE_BIO =
  '일 년에 한 번은 꼭 해외 나가야 직성이 풀리는 사람'

export function getDefaultEditableProfile(): EditableProfile {
  return {
    nickname: DEFAULT_PROFILE_NICKNAME,
    bio: DEFAULT_PROFILE_BIO,
    tagIds: getDefaultProfileTagIds(),
  }
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profiles: {},

  getProfile: (userId, fallback) => get().profiles[userId] ?? fallback,

  saveProfile: (userId, profile) =>
    set((state) => ({
      profiles: {
        ...state.profiles,
        [userId]: {
          nickname: profile.nickname.trim(),
          bio: profile.bio.trim(),
          tagIds: profile.tagIds,
        },
      },
    })),
}))
