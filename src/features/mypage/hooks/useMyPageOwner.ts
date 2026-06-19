import { useEffect, useMemo, useState } from 'react'

import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'
import { isAxiosError } from 'axios'

import { getPublicProfile } from '../api/profileApi'
import { mockMyProfile } from '../data/profileMock'
import { mapProfileTagIdsToUserTags } from '../lib/profile-tags'
import type { MyPageUser } from '../types/mypage'
import {
  getDefaultEditableProfile,
  useProfileStore,
} from '@/store/profileStore'
import type { PublicUserProfile } from '@/types/mypage.types'

export function useMyPageOwner(userId: string) {
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const currentUserProfile = useUserProfileStore((state) => state.userProfile)
  const fallbackProfile = useMemo(() => getDefaultEditableProfile(), [])
  const editableProfile = useProfileStore((state) =>
    state.getProfile(userId, fallbackProfile)
  )

  const numericId = useMemo(() => Number(userId), [userId])
  const currentUserId = currentUserProfile?.id
  const isCurrentUserRoute = Boolean(
    currentUserId && (userId === currentUserId || userId === 'me')
  )
  const shouldWaitForCurrentUser =
    !isAuthInitialized && isLoggedIn && !currentUserProfile && userId === 'me'
  const isOwner = Boolean(currentUserProfile && isCurrentUserRoute)

  const [publicProfileResult, setPublicProfileResult] = useState<{
    userId: number
    data: PublicUserProfile | null
    error: 'not_found' | 'error' | null
  } | null>(null)

  const shouldFetchPublicProfile =
    isAuthInitialized &&
    !isOwner &&
    !shouldWaitForCurrentUser &&
    Boolean(numericId)

  const publicProfile =
    shouldFetchPublicProfile && publicProfileResult?.userId === numericId
      ? publicProfileResult.data
      : null
  const isProfileLoading =
    shouldWaitForCurrentUser ||
    (shouldFetchPublicProfile && publicProfileResult?.userId !== numericId)
  const profileError =
    !isAuthInitialized || isOwner || shouldWaitForCurrentUser
      ? null
      : !numericId
        ? 'not_found'
        : publicProfileResult?.userId === numericId
          ? publicProfileResult.error
          : null

  useEffect(() => {
    if (!shouldFetchPublicProfile) {
      return
    }

    let cancelled = false

    getPublicProfile(numericId)
      .then((data) => {
        if (!cancelled) {
          setPublicProfileResult({ userId: numericId, data, error: null })
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setPublicProfileResult({
            userId: numericId,
            data: null,
            error:
              isAxiosError(error) && error.response?.status === 404
                ? 'not_found'
                : 'error',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [numericId, shouldFetchPublicProfile])

  const user = useMemo<MyPageUser>(() => {
    if (!isOwner && publicProfile) {
      return {
        ...mockMyProfile,
        id: publicProfile.id,
        nickname: publicProfile.nickname,
        bio: publicProfile.bio,
        profile_img_url: publicProfile.profile_img_url,
        tags: publicProfile.tags,
        follower_count: publicProfile.follower_count,
        following_count: publicProfile.following_count,
        email: '',
        bookmark_count: 0,
        review_count: publicProfile.review_count,
        travel_type_name: publicProfile.travel_type_name,
        created_at: publicProfile.created_at,
        updated_at: publicProfile.updated_at,
      }
    }

    return {
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
      travel_type_name: null,
      tags: isOwner
        ? (currentUserProfile?.tags ??
          mapProfileTagIdsToUserTags(editableProfile.tagIds))
        : mapProfileTagIdsToUserTags(editableProfile.tagIds),
    }
  }, [currentUserProfile, editableProfile, isOwner, publicProfile])

  return {
    isOwner,
    isProfileLoading,
    profileError,
    canEditProfile: isOwner,
    canManageAccount: isOwner,
    canManageReviews: isOwner,
    canManageBookmarks: isOwner,
    user,
    initialIsFollowing: publicProfile?.is_following ?? false,
  }
}
