import api from '@/lib/api'
import type { PublicUserProfile } from '@/types/mypage.types'
import { isAxiosError } from 'axios'

export async function checkNickname(
  nickname: string
): Promise<{ available: boolean }> {
  try {
    await api.post('/users/nickname/check', { nickname })
    return { available: true }
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 409) {
      return { available: false }
    }
    throw error
  }
}

export async function getPublicProfile(
  userId: number
): Promise<PublicUserProfile> {
  const response = await api.get<PublicUserProfile>(`/users/${userId}`)
  return response.data
}
