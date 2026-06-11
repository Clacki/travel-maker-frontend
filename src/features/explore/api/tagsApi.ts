import api from '@/lib/api'
import type { Tag } from '../types/tags.types'

export const getTags = async (tag_type?: string): Promise<Tag[]> => {
  const response = await api.get<Tag[]>('/tags/', {
    params: tag_type ? { tag_type } : undefined,
  })
  return response.data
}
