import api from '@/lib/api'
import type { RouteTag } from '../types/trip'

const REGION_TAG_TYPE = '지역'
const THEME_TAG_TYPE = '세부 테마'

const getTagsByType = async (tagType: string): Promise<RouteTag[]> => {
  const response = await api.get<RouteTag[]>('/tags/', {
    params: { tag_type: tagType },
  })
  return response.data.map((tag) => ({ id: tag.id, tag_name: tag.tag_name }))
}

export const getRegionTags = (): Promise<RouteTag[]> =>
  getTagsByType(REGION_TAG_TYPE)

export const getThemeTags = (): Promise<RouteTag[]> =>
  getTagsByType(THEME_TAG_TYPE)
