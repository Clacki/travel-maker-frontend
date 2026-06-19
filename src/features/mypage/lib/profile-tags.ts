import { travelFilterSections } from '@/lib/filter-data'
import type { UserProfile } from '@/types/mypage.types'

export const PROFILE_TAG_LIMIT = 3

const themeTags =
  travelFilterSections.find((section) => section.id === 'theme')?.tags ?? []

const FIRST_PROFILE_TAG_API_ID = 8

export const profileInterestTags = themeTags

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
    .map((tag) => ({
      id:
        profileInterestTags.findIndex((candidate) => candidate.id === tag.id) +
        FIRST_PROFILE_TAG_API_ID,
      name: tag.label,
    }))
}

export function mapProfileTagIdsToApiTagIds(tagIds: string[]) {
  return normalizeTagIds(tagIds)
    .map((tagId) => profileInterestTags.findIndex((tag) => tag.id === tagId))
    .filter((tagIndex) => tagIndex >= 0)
    .map((tagIndex) => tagIndex + FIRST_PROFILE_TAG_API_ID)
}

export function mapUserTagsToProfileTagIds(
  tags: { id: number; name: string }[]
) {
  return normalizeTagIds(
    tags
      .map((tag) => {
        const index = tag.id - FIRST_PROFILE_TAG_API_ID
        const tagById = profileInterestTags[index]

        if (tagById) {
          return tagById.id
        }

        return profileInterestTags.find(
          (candidate) => candidate.label === tag.name
        )?.id
      })
      .filter((tagId): tagId is string => Boolean(tagId))
  )
}
