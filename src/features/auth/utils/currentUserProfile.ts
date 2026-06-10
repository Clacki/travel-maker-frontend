import {
  getCurrentUser,
  type CurrentUserResponse,
} from '@/features/auth/api/authApi'
import {
  type UserProfile,
  useUserProfileStore,
} from '@/features/auth/store/useUserProfileStore'

export const mapCurrentUserToUserProfile = (
  currentUser: CurrentUserResponse
): UserProfile => ({
  id: String(currentUser.id),
  nickname: currentUser.nickname,
  email: currentUser.email,
  bio: currentUser.bio,
  profileImageUrl: currentUser.profile_img_url,
  followerCount: currentUser.follower_count,
  followingCount: currentUser.following_count,
  bookmarkCount: currentUser.bookmark_count,
  reviewCount: currentUser.review_count,
})

export const loadCurrentUserProfile = async () => {
  const currentUser = await getCurrentUser()
  const userProfile = mapCurrentUserToUserProfile(currentUser)

  useUserProfileStore.getState().setUserProfile(userProfile)

  return userProfile
}
