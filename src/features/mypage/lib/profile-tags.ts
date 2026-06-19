import { travelFilterSections } from '@/lib/filter-data'
import type { UserProfile } from '@/types/mypage.types'

export const PROFILE_TAG_LIMIT = 3

const profileStyleTags = [
  { id: 'beach', label: '해변' },
  { id: 'mountain', label: '산악' },
  { id: 'city', label: '도시' },
  { id: 'culture', label: '문화' },
  { id: 'food', label: '미식' },
  { id: 'activity', label: '액티비티' },
  { id: 'romantic', label: '로맨틱' },
]

const themeTags =
  travelFilterSections.find((section) => section.id === 'theme')?.tags ?? []

export const profileInterestTags = [...profileStyleTags, ...themeTags]

const DEFAULT_PROFILE_TAG_IDS: string[] = []

function normalizeTagIds(tagIds: string[]) {
  const validTagIds = new Set(profileInterestTags.map((tag) => tag.id))

  return Array.from(new Set(tagIds))
    .filter((tagId) => validTagIds.has(tagId))
    .slice(0, PROFILE_TAG_LIMIT)
}

export function getDefaultProfileTagIds() {
  return normalizeTagIds(DEFAULT_PROFILE_TAG_IDS)
}

export function mapProfileTagIdsToUserTags(
  tagIds: string[]
): UserProfile['tags'] {
  return normalizeTagIds(tagIds)
    .map((tagId) => profileInterestTags.find((tag) => tag.id === tagId))
    .filter((tag): tag is (typeof profileInterestTags)[number] => Boolean(tag))
    .map((tag, index) => ({
      id: index + 1,
      name: tag.label,
    }))
}

export function mapProfileTagIdsToApiTagIds(tagIds: string[]) {
  return normalizeTagIds(tagIds)
    .map((tagId) => profileInterestTags.findIndex((tag) => tag.id === tagId))
    .filter((tagIndex) => tagIndex >= 0)
    .map((tagIndex) => tagIndex + 1)
}
