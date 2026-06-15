import api from '@/lib/api'

export type FollowUser = {
  user_id: number
  nickname: string
  profile_img_url: string
}

export type FollowListResponse = {
  next: string | null
  previous: string | null
  results: FollowUser[]
}

export async function followUser(userId: number): Promise<void> {
  await api.post(`/users/${userId}/follow`)
}

export async function unfollowUser(userId: number): Promise<void> {
  await api.delete(`/users/${userId}/follow`)
}

export async function getFollowers(
  userId: number,
  cursor?: string,
  pageSize = 5
): Promise<FollowListResponse> {
  const response = await api.get<FollowListResponse>(
    `/users/${userId}/followers`,
    { params: { page_size: pageSize, ...(cursor ? { cursor } : {}) } }
  )
  return response.data
}

export async function getFollowing(
  userId: number,
  cursor?: string,
  pageSize = 5
): Promise<FollowListResponse> {
  const response = await api.get<FollowListResponse>(
    `/users/${userId}/following`,
    { params: { page_size: pageSize, ...(cursor ? { cursor } : {}) } }
  )
  return response.data
}
