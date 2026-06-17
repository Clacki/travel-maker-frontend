import { getTags } from '@/lib/tagsApi'
import type { Tag } from '@/types/tag.types'

const REGION_TAG_TYPE = '지역'
const THEME_TAG_TYPE = '여행 스타일'

export const getRegionTags = (): Promise<Tag[]> => getTags(REGION_TAG_TYPE)

export const getThemeTags = (): Promise<Tag[]> => getTags(THEME_TAG_TYPE)

// 기존 export는 유지하고 캐시 함수만 추가
let _cachedTags: Promise<[Tag[], Tag[]]> | null = null

export function getCachedRegionAndThemeTags(): Promise<[Tag[], Tag[]]> {
  if (!_cachedTags) {
    _cachedTags = Promise.all([getRegionTags(), getThemeTags()])
  }
  return _cachedTags
}
