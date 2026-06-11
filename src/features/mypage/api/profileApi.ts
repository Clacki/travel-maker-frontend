import api from '@/lib/api'
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
