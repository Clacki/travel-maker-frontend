import api from '@/lib/api'

const TOKEN_REFRESH_PATH = '/auth/token/refresh'
const LOGOUT_PATH = '/auth/logout'
const CURRENT_USER_PATH = '/users'

export type TokenRefreshResponse = {
  access_token: string
}

export type CurrentUserResponse = {
  id: number
  nickname: string
  bio: string
  email: string
  profile_img_url: string | null
  tags: Record<string, string>[]
  follower_count: number
  following_count: number
  bookmark_count: number
  review_count: number
  created_at: string
  updated_at: string
}

export const refreshAccessToken = async () => {
  const response = await api.post<TokenRefreshResponse>(TOKEN_REFRESH_PATH)

  return response.data
}

export const getCurrentUser = async () => {
  const response = await api.get<CurrentUserResponse>(CURRENT_USER_PATH)

  return response.data
}

export const logout = async () => {
  await api.post(LOGOUT_PATH)
}

export type AvatarUpdateResponse = {
  updated: boolean
}

export const patchUserAvatar = async (
  travelTypeId: number
): Promise<AvatarUpdateResponse> => {
  const response = await api.patch<AvatarUpdateResponse>('/users/avatar/', {
    travel_type_id: travelTypeId,
  })
  return response.data
}
