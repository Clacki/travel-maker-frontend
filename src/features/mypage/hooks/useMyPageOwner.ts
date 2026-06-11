import { useMemo } from 'react'

import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'
import {
  getDefaultEditableProfile,
  useProfileStore,
} from '@/store/profileStore'

import { mockMyProfile } from '../data/profileMock'
import { mapProfileTagIdsToUserTags } from '../lib/profile-tags'
import type { MyPageUser } from '../types/mypage'

export function useMyPageOwner(userId: string) {
  const currentUserProfile = useUserProfileStore((state) => state.userProfile)
  const fallbackProfile = useMemo(() => getDefaultEditableProfile(), [])
  const editableProfile = useProfileStore((state) =>
    state.getProfile(userId, fallbackProfile)
  )

  const isOwner = Boolean(
    currentUserProfile && (userId === currentUserProfile.id || userId === 'me')
  )

  // TODO: Connect another user's mypage API and split profile source by owner.
  const user = useMemo<MyPageUser>(
    () => ({
      ...mockMyProfile,
      id: isOwner ? Number(currentUserProfile?.id) : mockMyProfile.id,
      nickname: isOwner
        ? (currentUserProfile?.nickname ?? editableProfile.nickname)
        : editableProfile.nickname,
      bio: isOwner ? (currentUserProfile?.bio ?? '') : editableProfile.bio,
      email: isOwner ? (currentUserProfile?.email ?? '') : mockMyProfile.email,
      profile_img_url: isOwner
        ? (currentUserProfile?.profileImageUrl ?? '')
        : mockMyProfile.profile_img_url,
      follower_count: isOwner ? (currentUserProfile?.followerCount ?? 0) : 0,
      following_count: isOwner ? (currentUserProfile?.followingCount ?? 0) : 0,
      bookmark_count: isOwner
        ? (currentUserProfile?.bookmarkCount ?? mockMyProfile.bookmark_count)
        : mockMyProfile.bookmark_count,
      review_count: isOwner
        ? (currentUserProfile?.reviewCount ?? mockMyProfile.review_count)
        : mockMyProfile.review_count,
      tags: mapProfileTagIdsToUserTags(editableProfile.tagIds),
    }),
    [currentUserProfile, editableProfile, isOwner]
  )

  return {
    isOwner,
    canEditProfile: isOwner,
    canManageAccount: isOwner,
    canManageReviews: isOwner,
    canManageBookmarks: isOwner,
    user,
  }
}
