import { getTags } from '@/lib/tagsApi'
import type { Tag } from '@/types/tag.types'

const REGION_TAG_TYPE = '지역'
const THEME_TAG_TYPE = '세부 테마'

export const getRegionTags = (): Promise<Tag[]> => getTags(REGION_TAG_TYPE)

export const getThemeTags = (): Promise<Tag[]> => getTags(THEME_TAG_TYPE)
