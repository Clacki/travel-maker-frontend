import api from '@/lib/api'

export type Tag = {
  id: number
  tag_name: string
}

export const getTags = async (tagType?: string): Promise<Tag[]> => {
  const response = await api.get<Tag[]>('/tags/', {
    params: tagType ? { tag_type: tagType } : undefined,
  })
  return response.data
}
