import api from '@/lib/api'

export async function followUser(userId: number): Promise<void> {
  await api.post(`/users/${userId}/follow`)
}

export async function unfollowUser(userId: number): Promise<void> {
  await api.delete(`/users/${userId}/follow`)
}
